"use client";

import React from "react";
import { Cpu, Search, User } from "lucide-react";
import ProviderSelector, { type CloudProvider } from "./ProviderSelector";

export type ConnectionStatus = "idle" | "processing" | "active" | "error";

interface NavbarProps {
  status?: ConnectionStatus;
  modelName?: string;
  provider?: CloudProvider;
  onProviderSelect?: (provider: CloudProvider) => void;
  onOpenCommandPalette?: () => void;
  onOpenHistory?: () => void;
}

export default function Navbar({
  status = "idle",
  modelName = "gemma-4-31b-it",
  provider = "AWS",
  onProviderSelect,
  onOpenCommandPalette,
}: NavbarProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        height: "52px",
        background: "var(--navy-deep)",
        borderBottom: "1px solid var(--grid)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        userSelect: "none",
      }}
    >
      {/* ── 1. Current Project Name & Region (No "PROJECT" label) ──────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "var(--white-line)",
          }}
        >
          Production Architecture
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>·</span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          US-East-1
        </span>
      </div>

      {/* ── 2. Centered Cloud Provider Switcher ────────────────────────── */}
      {onProviderSelect && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ProviderSelector
            selected={provider}
            onSelect={onProviderSelect}
            showLabel={false}
          />
        </div>
      )}

      {/* ── 3. Compact Search, Active Model, Status Dot & Profile ──────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Global Search (Ctrl + K) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: "30px",
            padding: "0 10px",
            background: "var(--navy)",
            border: "1px solid var(--grid)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-muted)",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--marker)";
            e.currentTarget.style.color = "var(--white-line)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--grid)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <Search size={13} color="var(--marker)" />
          <span>Search</span>
          <span
            style={{
              padding: "1px 5px",
              background: "rgba(29, 78, 122, 0.4)",
              borderRadius: "3px",
              fontSize: "0.625rem",
              color: "var(--text-secondary)",
            }}
          >
            Ctrl + K
          </span>
        </button>

        {/* Active AI Model */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <Cpu size={13} color="var(--marker)" />
          <span>{modelName}</span>
        </div>

        {/* Small Green Status Dot (Subtle "● Ready") */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            color: "var(--text-secondary)",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--accent-emerald)",
              boxShadow: "0 0 8px rgba(76, 175, 125, 0.5)",
            }}
          />
          <span>Ready</span>
        </div>

        {/* User Profile */}
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(232, 135, 30, 0.15)",
            border: "1px solid var(--marker)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--marker)",
            cursor: "pointer",
          }}
          title="Architect Account"
        >
          <User size={13} />
        </div>
      </div>
    </header>
  );
}
