"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Activity, Search, History, Clock, Command } from "lucide-react";
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
  onOpenHistory,
}: NavbarProps) {
  const [timeStr, setTimeStr] = useState("");

  // Live UTC system clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().substring(11, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusText = () => {
    switch (status) {
      case "processing":
        return "Analyzing Sketch...";
      case "active":
        return "Gemma 4 Connected";
      case "error":
        return "Connection Error";
      default:
        return "System Ready";
    }
  };

  const getStatusDotClass = () => {
    switch (status) {
      case "processing":
        return "status-dot--processing";
      case "active":
        return "status-dot--active";
      case "error":
        return "status-dot--error";
      default:
        return "status-dot--idle";
    }
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        height: "56px",
        background: "var(--navy-deep)",
        borderBottom: "1px solid var(--grid)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        userSelect: "none",
      }}
    >
      {/* ── Left: Session Breadcrumbs & Provider Selector ─────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ color: "var(--marker)", fontWeight: 700 }}>PROJECT</span>
          <span style={{ color: "var(--grid)" }}>/</span>
          <span style={{ color: "var(--white-line)" }}>US-East-1 Production Architecture</span>
        </div>

        {onProviderSelect && (
          <ProviderSelector
            selected={provider}
            onSelect={onProviderSelect}
          />
        )}
      </div>

      {/* ── Center: Quick Command Search Palette Trigger ───────────────── */}
      <button
        onClick={onOpenCommandPalette}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "6px 14px",
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
        <Search size={14} color="var(--marker)" />
        <span>Search commands or actions...</span>
        <span
          style={{
            padding: "2px 6px",
            background: "rgba(29, 78, 122, 0.4)",
            borderRadius: "3px",
            fontSize: "0.625rem",
            color: "var(--text-secondary)",
          }}
        >
          Ctrl + K
        </span>
      </button>

      {/* ── Right: AI Model Status, Clock & Controls ──────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Model Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "var(--radius-sm)",
            background: "var(--navy)",
            border: "1px solid var(--grid)",
            fontSize: "0.6875rem",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <Cpu size={13} color="var(--marker)" />
          <span>{modelName}</span>
          <span
            style={{
              padding: "1px 5px",
              borderRadius: "3px",
              background: "rgba(76, 175, 125, 0.15)",
              color: "var(--accent-emerald)",
              fontWeight: 700,
              fontSize: "0.5625rem",
            }}
          >
            128K
          </span>
        </div>

        {/* Live Status Dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            color: "var(--text-secondary)",
          }}
        >
          <span className={`status-dot ${getStatusDotClass()}`} />
          <span>{getStatusText()}</span>
        </div>

        {/* History Icon Trigger */}
        <button
          onClick={onOpenHistory}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          title="Session History"
        >
          <History size={16} />
        </button>

        {/* UTC Clock */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Clock size={12} color="var(--marker)" />
          <span>{timeStr}</span>
        </div>
      </div>
    </header>
  );
}
