"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Activity, Zap } from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────────── */

export type ConnectionStatus = "idle" | "processing" | "active" | "error";

interface NavbarProps {
  /** Current connection/processing status for the neon indicator. */
  status: ConnectionStatus;
}

/* ── Status Mapping ───────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string; dotClass: string; color: string }
> = {
  idle: {
    label: "Ready",
    dotClass: "status-dot status-dot--idle",
    color: "var(--text-muted)",
  },
  processing: {
    label: "Analyzing…",
    dotClass: "status-dot status-dot--processing",
    color: "var(--accent-cyan)",
  },
  active: {
    label: "Connected",
    dotClass: "status-dot status-dot--active",
    color: "var(--accent-emerald)",
  },
  error: {
    label: "Error",
    dotClass: "status-dot status-dot--error",
    color: "var(--accent-rose)",
  },
};

/* ── Component ────────────────────────────────────────────────────────── */

const Navbar: React.FC<NavbarProps> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        margin: "12px 16px 0",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* ── Brand ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-sm)",
            background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--glow-indigo)",
          }}
        >
          <Zap size={18} color="white" strokeWidth={2.5} />
        </div>

        <div>
          <h1
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            CloudCanvas
          </h1>
          <p
            style={{
              fontSize: "0.6875rem",
              color: "var(--text-muted)",
              margin: 0,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            AI System Design Tutor
          </p>
        </div>
      </div>

      {/* ── Center: Model Badge ────────────────────────────────────── */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "999px",
          border: "1px solid var(--glass-border)",
          background: "rgba(99, 102, 241, 0.08)",
        }}
      >
        <Cpu size={14} color="var(--accent-indigo-light)" />
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--accent-indigo-light)",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          Gemma 4 · 12B Multimodal
        </span>
      </motion.div>

      {/* ── Right: Status Indicator ────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Activity size={14} color="var(--text-muted)" />
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className={cfg.dotClass} />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: cfg.color,
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            {cfg.label}
          </span>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
