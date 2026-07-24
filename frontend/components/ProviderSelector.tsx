"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud, Layers, Shield } from "lucide-react";

export type CloudProvider = "AWS" | "GCP" | "Azure";

interface ProviderSelectorProps {
  selected: CloudProvider;
  onSelect: (provider: CloudProvider) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

interface ProviderOption {
  id: CloudProvider;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
}

export default function ProviderSelector({
  selected,
  onSelect,
  disabled = false,
  showLabel = false,
}: ProviderSelectorProps) {
  const providers: ProviderOption[] = [
    {
      id: "AWS",
      label: "AWS",
      icon: <Cloud size={13} />,
      activeColor: "var(--marker)",
    },
    {
      id: "GCP",
      label: "GCP",
      icon: <Layers size={13} />,
      activeColor: "var(--accent-blue)",
    },
    {
      id: "Azure",
      label: "Azure",
      icon: <Shield size={13} />,
      activeColor: "var(--accent-blue)",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: showLabel ? "6px" : "0" }}>
      {showLabel && (
        <label
          style={{
            display: "block",
            fontSize: "0.6875rem",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
          }}
        >
          Cloud Provider
        </label>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "var(--navy)",
          border: "1px solid var(--grid)",
          borderRadius: "var(--radius-sm)",
          padding: "2px",
          height: "32px",
        }}
      >
        {providers.map((p) => {
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                height: "26px",
                padding: "0 10px",
                borderRadius: "3px",
                border: "none",
                background: isSelected ? "var(--navy-deep)" : "transparent",
                color: isSelected ? "var(--white-line)" : "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: isSelected ? 700 : 500,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ color: isSelected ? p.activeColor : "var(--text-muted)" }}>
                {p.icon}
              </span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
