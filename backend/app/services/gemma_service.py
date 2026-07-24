"""
CloudCanvas – Gemma 4 Multimodal Service (v2 – Enterprise Compliance)
======================================================================
Encapsulates all communication with the Gemma 4 (12B / 4B) model via
the Google GenAI SDK.  Handles:

  • Image + optional PDF/TXT compliance document ingestion
  • Deep compliance context injection into Gemma 4's context window
  • Prompt construction with cloud-provider awareness
  • Streaming structured JSON generation
  • Error boundaries around every SDK call

The public entry-point is `analyze_architecture_stream()`, which yields
`SSEChunk` objects ready to be forwarded over Server-Sent Events.
"""

from __future__ import annotations

import json
import logging
import traceback
from io import BytesIO
from typing import AsyncGenerator, Optional

from google import genai
from google.genai import types
from PIL import Image

from app.config import settings
from app.schemas.analysis import (
    AnalysisResult,
    ArchitectureCritique,
    SSEChunk,
    SSEEventType,
)

logger = logging.getLogger("cloudcanvas.gemma_service")

# ── Google GenAI Client (module-level singleton) ──────────────────────────

_client: genai.Client | None = None


def _get_model_name() -> str:
    """Safely retrieve the model name string regardless of type."""
    val = settings.gemma_model
    return val.value if hasattr(val, "value") else str(val)


def _get_client() -> genai.Client:
    """Lazy-init the GenAI client so import-time failures don't crash the app."""
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.google_api_key)
        logger.info("Google GenAI client initialised (model=%s)", _get_model_name())
    return _client


# ── Prompt Templates ─────────────────────────────────────────────────────

_SYSTEM_PROMPT_BASE = """\
You are **CloudCanvas AI**, an elite cloud-architecture reviewer and \
infrastructure-as-code generator.  You receive a hand-drawn (or rough) \
cloud architecture sketch and optionally a compliance/security policy document.

Your task is to produce a **single, valid JSON object** (no markdown fences, \
no commentary outside the JSON) with exactly the following keys:

{
  "detected_components": [
    {"name": "<label>", "service": "<cloud service>", "notes": "<optional>"}
  ],
  "critique": {
    "summary": "<executive Markdown summary>",
    "findings": [
      {
        "title": "<short headline>",
        "severity": "<critical|high|medium|low|info>",
        "description": "<detailed Markdown explanation>",
        "recommendation": "<concrete fix>"
      }
    ],
    "score": <0-100>
  },
  "mermaid_code": "<valid Mermaid.js graph TD flowchart>",
  "terraform_code": "<production-ready, commented .tf code>",
  "cloud_provider": "<provider>"
}

### Rules
1. **detected_components** – list every cloud service you can identify in the \
sketch (EC2, S3, RDS, ALB, VPC, subnets, Lambda, API Gateway, etc.).
2. **critique** – evaluate single-points-of-failure, security gaps, cost \
inefficiencies, and performance bottlenecks.  Order findings by severity.
3. **mermaid_code** – produce a clean `graph TD` diagram.  Use descriptive \
node IDs (e.g. `ALB[Application Load Balancer]`).  Do NOT wrap in \
triple-backtick fences.
4. **terraform_code** – generate fully commented Terraform for the target \
cloud provider.  Include provider block, VPC/networking, compute, storage, \
and IAM where visible.  Do NOT wrap in triple-backtick fences.
5. Return **only** the JSON object. No preamble, no trailing text.
"""

_COMPLIANCE_ENFORCEMENT_PROMPT = """\

### ⚠️ MANDATORY COMPLIANCE ENFORCEMENT

The user has attached an enterprise compliance / security policy document.
You **MUST** treat every rule in this document as a hard requirement:

{compliance_text}

### Compliance Integration Instructions
1. **Critique**: For every policy rule, check whether the architecture \
satisfies it. If a rule is violated, emit a finding with severity \
"critical" or "high" and reference the specific policy clause.
2. **Terraform Code**: The generated Terraform **MUST** implement all \
mandatory controls from the compliance document, including but not limited to:
   - Encryption at rest (KMS / SSE) on all storage and database resources
   - Encryption in transit (TLS/HTTPS) on all endpoints and load balancers
   - Multi-AZ / multi-region deployment for high availability
   - Private subnets for compute workloads (no direct public internet access)
   - VPC Flow Logs, CloudTrail / Cloud Audit Logs enabled
   - Least-privilege IAM policies with explicit deny statements
   - Backup and disaster recovery configurations
   - Tagging policies for cost allocation and governance
3. **Score**: Heavily penalise non-compliance. An architecture violating \
critical compliance rules should score below 40.
4. If the compliance document mentions specific frameworks (SOC2, HIPAA, \
PCI-DSS, FedRAMP, ISO 27001, NIST), explicitly reference them in the \
critique findings.
"""


def _build_system_prompt(compliance_text: Optional[str] = None) -> str:
    """
    Assemble the full system prompt.

    When a compliance document is provided, its full text is injected
    directly into Gemma 4's system prompt to maximise context window
    utilisation (Gemma 4 supports up to 128K tokens).  This ensures the
    model treats compliance rules as first-class constraints rather than
    optional suggestions.
    """
    prompt = _SYSTEM_PROMPT_BASE

    if compliance_text:
        # Inject the full compliance document into the system prompt
        # Gemma 4 12B supports 128K context – we can be generous
        max_compliance_chars = 100_000  # ~25K tokens, well within limits
        truncated = compliance_text[:max_compliance_chars]
        if len(compliance_text) > max_compliance_chars:
            truncated += "\n\n[... document truncated for context limits ...]"
            logger.warning(
                "Compliance document truncated from %d to %d chars",
                len(compliance_text),
                max_compliance_chars,
            )

        prompt += _COMPLIANCE_ENFORCEMENT_PROMPT.format(compliance_text=truncated)
        logger.info(
            "Compliance context injected: %d chars (%d original)",
            len(truncated),
            len(compliance_text),
        )

    return prompt


def _build_user_prompt(cloud_provider: str, has_compliance: bool = False) -> str:
    """Assemble the user-turn prompt with provider context."""
    parts = [
        f"Analyze the attached architecture sketch for **{cloud_provider}**.",
        "Identify every component, produce a thorough critique, generate a "
        "Mermaid.js diagram, and write production Terraform code.",
    ]

    if has_compliance:
        parts.append(
            "\n**IMPORTANT**: A compliance policy document has been provided in "
            "the system context. You MUST validate every architectural decision "
            "against those policies and ensure the Terraform code enforces all "
            "mandatory controls. Flag every violation as a critical finding."
        )

    parts.append("\nRespond with **only** the JSON object described in your instructions.")
    return "\n".join(parts)


# ── Image Helpers ─────────────────────────────────────────────────────────


def _prepare_image(raw_bytes: bytes) -> Image.Image:
    """Load, validate, and optionally down-scale the uploaded image."""
    img = Image.open(BytesIO(raw_bytes))
    img.verify()  # raises if corrupt
    img = Image.open(BytesIO(raw_bytes))  # re-open after verify

    # Down-scale very large images to keep token count reasonable
    max_dim = 2048
    if max(img.size) > max_dim:
        img.thumbnail((max_dim, max_dim), Image.LANCZOS)
        logger.info("Image down-scaled to %s", img.size)

    return img


# ── Core Streaming Analyser ──────────────────────────────────────────────


async def analyze_architecture_stream(
    image_bytes: bytes,
    cloud_provider: str = "AWS",
    compliance_text: Optional[str] = None,
) -> AsyncGenerator[SSEChunk, None]:
    """
    Stream architecture analysis from Gemma 4 as SSEChunk objects.

    Yields chunks in order:
      1. metadata  – quick ack with provider info
      2. critique  – the full critique JSON
      3. mermaid   – the Mermaid diagram string
      4. terraform – the Terraform code string
      5. done      – signals the frontend to close the EventSource

    On any error an `error` chunk is emitted and the generator closes.

    **Compliance Context Injection (v2)**:
    When `compliance_text` is provided, the full document is injected into
    Gemma 4's system prompt (not just the user prompt).  This leverages
    Gemma 4's 128K context window to ensure the model treats compliance
    rules as immutable constraints throughout the entire generation.
    """

    has_compliance = bool(compliance_text and compliance_text.strip())

    # ── 1. Emit metadata immediately ─────────────────────────────────
    yield SSEChunk(
        event_type=SSEEventType.METADATA,
        data=json.dumps({
            "cloud_provider": cloud_provider,
            "model": _get_model_name(),
            "status": "processing",
            "compliance_loaded": has_compliance,
        }),
    )

    try:
        # ── 2. Prepare inputs ────────────────────────────────────────
        image = _prepare_image(image_bytes)
        system_prompt = _build_system_prompt(compliance_text if has_compliance else None)
        user_prompt = _build_user_prompt(cloud_provider, has_compliance)
        client = _get_client()

        logger.info(
            "Sending analysis request to Gemma 4 (%s) — compliance=%s, "
            "system_prompt_len=%d, user_prompt_len=%d",
            _get_model_name(),
            has_compliance,
            len(system_prompt),
            len(user_prompt),
        )

        # ── 3. Call Gemma 4 ──────────────────────────────────────────
        #
        # System prompt carries the compliance context (if any) so it
        # acts as an immutable constraint layer.  The user prompt carries
        # the per-request analysis instructions.
        response = await client.aio.models.generate_content(
            model=_get_model_name(),
            contents=[
                image,
                user_prompt,
            ],
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.3 if has_compliance else 0.4,  # tighter for compliance
                top_p=0.92 if has_compliance else 0.95,
                max_output_tokens=8192,
            ),
        )

        raw_text: str = response.text or ""
        logger.debug("Raw model output length: %d chars", len(raw_text))

        # ── 4. Parse JSON ────────────────────────────────────────────
        # Strip possible markdown fences the model might add despite instructions
        cleaned = raw_text.strip()
        if cleaned.startswith("```"):
            first_newline = cleaned.index("\n")
            cleaned = cleaned[first_newline + 1:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        result = AnalysisResult.model_validate_json(cleaned)

        # ── 5. Stream structured sections ────────────────────────────

        # Critique
        yield SSEChunk(
            event_type=SSEEventType.CRITIQUE,
            data=json.dumps({
                "detected_components": [c.model_dump() for c in result.detected_components],
                "critique": result.critique.model_dump(),
            }),
        )

        # Mermaid diagram
        yield SSEChunk(
            event_type=SSEEventType.MERMAID,
            data=json.dumps({"mermaid_code": result.mermaid_code}),
        )

        # Terraform code
        yield SSEChunk(
            event_type=SSEEventType.TERRAFORM,
            data=json.dumps({"terraform_code": result.terraform_code}),
        )

        # Done signal
        yield SSEChunk(
            event_type=SSEEventType.DONE,
            data=json.dumps({
                "status": "complete",
                "compliance_enforced": has_compliance,
            }),
        )

    except json.JSONDecodeError as exc:
        logger.error("Gemma returned invalid JSON: %s", exc)
        yield SSEChunk(
            event_type=SSEEventType.ERROR,
            data=json.dumps({
                "error": "Model returned malformed JSON. Please retry.",
                "detail": str(exc),
            }),
        )

    except Exception as exc:
        logger.error("Analysis failed: %s\n%s", exc, traceback.format_exc())
        yield SSEChunk(
            event_type=SSEEventType.ERROR,
            data=json.dumps({
                "error": "An unexpected error occurred during analysis.",
                "detail": str(exc),
            }),
        )
