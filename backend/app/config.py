"""
CloudBuddy – Application Configuration
=========================================
Centralised, validated configuration loaded from environment variables
(or a `.env` file) via Pydantic Settings.  Every secret and tunable
knob lives here so the rest of the codebase stays free of raw
`os.getenv()` calls.
"""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class CloudProvider(str, Enum):
    """Supported cloud providers for Terraform generation."""
    AWS = "AWS"
    GCP = "GCP"
    AZURE = "Azure"


class GemmaModelVariant(str, Enum):
    """Available Gemma 4 / Gemini multimodal checkpoints."""
    GEMMA_4_31B = "gemma-4-31b-it"
    GEMMA_4_26B = "gemma-4-26b-a4b-it"
    GEMMA_4_12B = "gemma-4-12b-it"
    GEMMA_4_4B = "gemma-4-4b-it"
    GEMINI_2_0_FLASH = "gemini-2.0-flash"
    GEMINI_2_5_PRO = "gemini-2.5-pro"


class Settings(BaseSettings):
    """
    Application settings sourced from environment variables.

    To override any value, export the corresponding env-var (case-insensitive)
    or place it in a `.env` file at the project root.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Google GenAI / Vertex AI ──────────────────────────────────────
    google_api_key: str = Field(
        ...,
        description="Google AI Studio API key for Gemma 4 multimodal access.",
    )
    gemma_model: str = Field(
        default="gemma-4-31b-it",
        description="Which Gemma 4 / Gemini checkpoint to use.",
    )

    # ── Application Defaults ──────────────────────────────────────────
    default_cloud_provider: CloudProvider = Field(
        default=CloudProvider.AWS,
        description="Default cloud provider when the client doesn't specify one.",
    )
    max_upload_size_mb: int = Field(
        default=10,
        description="Maximum upload size in megabytes for image/PDF files.",
    )

    # ── Server ────────────────────────────────────────────────────────
    app_title: str = "CloudBuddy API"
    app_version: str = "1.0.0"
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        description="Allowed CORS origins.",
    )
    debug: bool = False

    # ── Supabase ──────────────────────────────────────────────────────
    supabase_url: Optional[str] = Field(
        default=None,
        description="Supabase project URL.",
    )
    supabase_key: Optional[str] = Field(
        default=None,
        description="Supabase API key.",
    )

    # ── Streaming ─────────────────────────────────────────────────────
    stream_chunk_delay_ms: int = Field(
        default=0,
        description="Optional artificial delay (ms) between SSE chunks for demo/debug.",
    )


# Singleton – import `settings` everywhere instead of re-instantiating.
settings = Settings()  # type: ignore[call-arg]
