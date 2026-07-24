"use client";

import React from "react";
import { motion } from "framer-motion";

/* ── Types ────────────────────────────────────────────────────────────── */

export type CloudProvider = "AWS" | "GCP" | "Azure";

interface ProviderSelectorProps {
  /** Currently selected provider. */
  selected: CloudProvider;
  /** Called when the user selects a provider. */
  onSelect: (provider: CloudProvider) => void;
  /** Disable interaction during analysis. */
  disabled?: boolean;
}

/* ── Provider Config ──────────────────────────────────────────────────── */

interface ProviderMeta {
  label: string;
  icon: string; /* emoji for simplicity – swap for SVG icons as needed */
  accentGradient: string;
}

const PROVIDERS: Record<CloudProvider, ProviderMeta> = {
  AWS: {
    label: "AWS",
    icon: "☁️",
    accentGradient: "linear-gradient(135deg, #ff9900, #ffb84d)",
  },
  GCP: {
    label: "GCP",
    icon: "🔷",
    accentGradient: "linear-gradient(135deg, #4285f4, #669df6)",
  },
  Azure: {
    label: "Azure",
    icon: "🔵",
    accentGradient: "linear-gradient(135deg, #0078d4, #3399e0)",
  },
};

const PROVIDER_KEYS: CloudProvider[] = ["AWS", "GCP", "Azure"];

/* ── Component ────────────────────────────────────────────────────────── */

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selected,
  onSelect,
  disabled = false,
}) => {
  return (
    <div>
      {/* Label */}
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--text-muted)",
          margin: "0 0 8px",
        }}
      >
        Cloud Provider
      </p>

      {/* Segmented Control */}
      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        {PROVIDER_KEYS.map((key) => {
          const meta = PROVIDERS[key];
          const isSelected = key === selected;

          return (
            <motion.button
              key={key}
              whileHover={!disabled ? { scale: 1.04 } : undefined}
              whileTap={!disabled ? { scale: 0.97 } : undefined}
              onClick={() => !disabled && onSelect(key)}
              disabled={disabled}
              className={`provider-pill ${isSelected ? "provider-pill--selected" : ""}`}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                position: "relative",
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {/* Animated selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="provider-indicator"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "999px",
                    background: "rgba(99, 102, 241, 0.1)",
                    border: "1px solid var(--accent-indigo)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <span style={{ position: "relative", zIndex: 1, fontSize: "0.875rem" }}>
                {meta.icon}
              </span>
              <span style={{ position: "relative", zIndex: 1 }}>{meta.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ProviderSelector;
