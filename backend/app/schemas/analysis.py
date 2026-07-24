"""
CloudCanvas – Pydantic Schemas for Architecture Analysis
==========================================================
Strict, fully-typed data contracts used both as the Gemma 4 structured
output target *and* as the SSE payload shape sent to the frontend.
"""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ── Enums ─────────────────────────────────────────────────────────────────


class Severity(str, Enum):
    """Severity level for an individual architectural finding."""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class SSEEventType(str, Enum):
    """Discriminated event types streamed over SSE."""
    CRITIQUE = "critique"
    MERMAID = "mermaid"
    TERRAFORM = "terraform"
    METADATA = "metadata"
    ERROR = "error"
    DONE = "done"


# ── Analysis Sub-Models ───────────────────────────────────────────────────


class ArchitectureFinding(BaseModel):
    """A single architectural finding (e.g. 'No Multi-AZ on RDS')."""
    title: str = Field(..., description="Short finding headline.")
    severity: Severity = Field(..., description="Impact severity.")
    description: str = Field(
        ...,
        description="Detailed explanation in Markdown.",
    )
    recommendation: str = Field(
        ...,
        description="Concrete remediation advice.",
    )


class ArchitectureCritique(BaseModel):
    """Full critique of the submitted architecture sketch."""
    summary: str = Field(
        ...,
        description="Executive summary of the architecture review (Markdown).",
    )
    findings: list[ArchitectureFinding] = Field(
        default_factory=list,
        description="Ordered list of findings, most critical first.",
    )
    score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Overall architecture health score (0-100).",
    )


class DetectedComponent(BaseModel):
    """A cloud component visually detected in the sketch."""
    name: str = Field(..., description="Component label (e.g. 'Web Server').")
    service: str = Field(..., description="Mapped cloud service (e.g. 'EC2', 'Cloud Run').")
    notes: Optional[str] = Field(
        default=None,
        description="Optional notes about the component.",
    )


# ── Top-Level Analysis Response ───────────────────────────────────────────


class AnalysisResult(BaseModel):
    """
    Complete analysis response returned as structured JSON.

    Each field maps 1-to-1 with an SSE event type so the frontend can
    render results progressively.
    """
    detected_components: list[DetectedComponent] = Field(
        default_factory=list,
        description="Cloud components detected in the sketch.",
    )
    critique: ArchitectureCritique = Field(
        ...,
        description="Detailed architectural critique.",
    )
    mermaid_code: str = Field(
        ...,
        description="Syntactically valid Mermaid.js flowchart (graph TD …).",
    )
    terraform_code: str = Field(
        ...,
        description="Production-ready, commented Terraform (.tf) config.",
    )
    cloud_provider: str = Field(
        ...,
        description="Cloud provider used for this analysis.",
    )


# ── SSE Envelope ──────────────────────────────────────────────────────────


class SSEChunk(BaseModel):
    """
    Wrapper sent as the `data` field in each Server-Sent Event.

    The `event_type` discriminator tells the frontend which panel
    to update.
    """
    event_type: SSEEventType
    data: Optional[str] = Field(
        default=None,
        description="JSON-encoded payload (or plain text for errors).",
    )
