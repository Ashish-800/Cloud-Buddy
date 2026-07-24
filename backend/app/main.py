"""
CloudCanvas – FastAPI Application Entry-point
===============================================
Sets up the FastAPI app, CORS middleware, health probes, and the
`/api/v1/analyze` SSE endpoint that orchestrates architecture analysis.
"""

from __future__ import annotations

import json
import logging
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.config import settings, CloudProvider
from app.schemas.analysis import SSEChunk
from app.services.gemma_service import analyze_architecture_stream

# ── Logging ───────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s │ %(name)-30s │ %(levelname)-7s │ %(message)s",
)
logger = logging.getLogger("cloudcanvas.main")

# ── FastAPI App ───────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description=(
        "**CloudCanvas API** — Upload a hand-drawn cloud architecture sketch "
        "and receive a structured critique, Mermaid diagram, and Terraform code "
        "streamed back in real-time via Server-Sent Events."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Health & Root ─────────────────────────────────────────────────────────


@app.get("/", tags=["Health"])
async def root() -> dict:
    """Root redirect / welcome."""
    return {
        "service": settings.app_title,
        "version": settings.app_version,
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    """Liveness probe for orchestrators (K8s, Cloud Run, etc.)."""
    return {"status": "healthy"}


# ── Constants ─────────────────────────────────────────────────────────────

_ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
_ALLOWED_DOC_TYPES = {"application/pdf", "text/plain"}
_MAX_BYTES = settings.max_upload_size_mb * 1024 * 1024


# ── Core Endpoint ─────────────────────────────────────────────────────────


@app.post(
    "/api/v1/analyze",
    tags=["Analysis"],
    summary="Analyze an architecture sketch",
    response_description="Server-Sent Events stream of analysis chunks",
)
async def analyze_architecture(
    image_file: UploadFile = File(
        ...,
        description="JPEG, PNG, or WebP image of a hand-drawn architecture sketch.",
    ),
    compliance_doc: Optional[UploadFile] = File(
        default=None,
        description="Optional PDF or TXT compliance/security policy document.",
    ),
    cloud_provider: Optional[str] = Form(
        default=None,
        description="Target cloud provider: AWS, GCP, or Azure. Defaults to AWS.",
    ),
) -> StreamingResponse:
    """
    Upload an architecture sketch and optionally a compliance document.

    Returns an SSE stream (`text/event-stream`) with progressive chunks:

    | event type   | payload                                      |
    |-------------|----------------------------------------------|
    | `metadata`  | model info, cloud provider, status            |
    | `critique`  | detected components + architectural critique  |
    | `mermaid`   | Mermaid.js flowchart code                     |
    | `terraform` | Production-ready Terraform configuration      |
    | `done`      | completion signal                              |
    | `error`     | error detail (on failure)                     |
    """

    # ── Validate image ────────────────────────────────────────────────
    if image_file.content_type not in _ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=415,
            detail=(
                f"Unsupported image type '{image_file.content_type}'. "
                f"Accepted: {', '.join(sorted(_ALLOWED_IMAGE_TYPES))}"
            ),
        )

    image_bytes = await image_file.read()
    if len(image_bytes) > _MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Image exceeds {settings.max_upload_size_mb} MB limit.",
        )

    # ── Validate optional compliance doc ──────────────────────────────
    compliance_text: Optional[str] = None
    if compliance_doc is not None:
        if compliance_doc.content_type not in _ALLOWED_DOC_TYPES:
            raise HTTPException(
                status_code=415,
                detail=(
                    f"Unsupported document type '{compliance_doc.content_type}'. "
                    f"Accepted: {', '.join(sorted(_ALLOWED_DOC_TYPES))}"
                ),
            )
        doc_bytes = await compliance_doc.read()
        if len(doc_bytes) > _MAX_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"Document exceeds {settings.max_upload_size_mb} MB limit.",
            )
        # For plain text, decode directly; for PDF, pass raw text extraction
        # (a full PDF parser can be added later – for now we decode as UTF-8)
        try:
            compliance_text = doc_bytes.decode("utf-8", errors="replace")
        except Exception:
            compliance_text = None

    # ── Resolve cloud provider ────────────────────────────────────────
    provider = cloud_provider or settings.default_cloud_provider.value
    # Normalise to enum display value
    try:
        provider = CloudProvider(provider).value
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid cloud provider '{provider}'. Must be one of: AWS, GCP, Azure.",
        )

    logger.info(
        "Analysis requested — provider=%s, image=%s (%d bytes), compliance=%s",
        provider,
        image_file.filename,
        len(image_bytes),
        compliance_doc.filename if compliance_doc else "none",
    )

    # ── SSE Generator ─────────────────────────────────────────────────

    async def _event_generator():
        """Wrap chunks into SSE-formatted text lines."""
        async for chunk in analyze_architecture_stream(
            image_bytes=image_bytes,
            cloud_provider=provider,
            compliance_text=compliance_text,
        ):
            # SSE format: "event: <type>\ndata: <json>\n\n"
            event_line = f"event: {chunk.event_type.value}\n"
            data_line = f"data: {chunk.data}\n\n"
            yield event_line + data_line

    return StreamingResponse(
        content=_event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable Nginx buffering
        },
    )


# ── Dev Server ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="debug" if settings.debug else "info",
    )
