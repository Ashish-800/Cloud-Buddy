"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud, Layers, Shield } from "lucide-react";

export type CloudProvider = "AWS" | "GCP" | "Azure";

interface ProviderSelectorProps {
  selected: CloudProvider;
  onSelect: (provider: CloudProvider) => void;
  disabled?: boolean;
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
}: ProviderSelectorProps) {
  const providers: ProviderOption[] = [
    {
      id: "AWS",
      label: "AWS",
      icon: <Cloud size={14} />,
      activeColor: "#ff9900",
    },
    {
      id: "GCP",
      label: "GCP",
      icon: <Layers size={14} />,
      activeColor: "#4285f4",
    },
    {
      id: "Azure",
      label: "Azure",
      icon: <Shield size={14} />,
      activeColor: "#0078d4",
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#64748b",
          marginBottom: "8px",
        }}
      >
        Target Cloud Provider
      </label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
        }}
      >
        {providers.map((p) => {
          const isSelected = selected === p.id;
          return (
            <motion.button
              key={p.id}
              whileTap={!disabled ? { scale: 0.96 } : undefined}
              onClick={() => !disabled && onSelect(p.id)}
              disabled={disabled}
              className={`provider-pill ${isSelected ? "provider-pill--selected" : ""}`}
              style={{
                justifyContent: "center",
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                position: "relative",
              }}
            >
              <span style={{ color: isSelected ? p.activeColor : "#64748b" }}>
                {p.icon}
              </span>
              <span>{p.label}</span>

              {/* Active animated glow line */}
              {isSelected && (
                <motion.div
                  layoutId="provider-indicator"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${p.activeColor}`,
                    pointerEvents: "none",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
