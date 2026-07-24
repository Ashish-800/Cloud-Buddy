"""
CloudBuddy – Supabase Service
=============================
Initialises the Supabase Python client using application settings.
"""

from __future__ import annotations

import logging
from typing import Optional
from supabase import create_client, Client
from app.config import settings

logger = logging.getLogger("cloudcanvas.supabase_service")

_supabase_client: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """Lazy initialization of Supabase client."""
    global _supabase_client
    if _supabase_client is None:
        if settings.supabase_url and settings.supabase_key:
            try:
                _supabase_client = create_client(settings.supabase_url, settings.supabase_key)
                logger.info("Supabase client connected (%s)", settings.supabase_url)
            except Exception as e:
                logger.error("Failed to initialize Supabase client: %s", e)
                return None
        else:
            logger.warning("Supabase URL or Key not configured in environment.")
    return _supabase_client
