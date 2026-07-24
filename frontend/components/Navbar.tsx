"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Activity } from "lucide-react";
import CloudBuddyLogo from "./CloudBuddyLogo";

export type ConnectionStatus = "idle" | "processing" | "active" | "error";

interface NavbarProps {
  status?: ConnectionStatus;
  modelName?: string;
}

export default function Navbar({
  status = "idle",
  modelName = "gemma-4-31b-it",
}: NavbarProps) {
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
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        padding: "12px 24px",
        background: "rgba(9, 13, 22, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* ── Brand & Title ────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.4 }}
          style={{ cursor: "pointer" }}
        >
          <CloudBuddyLogo size={42} />
        </motion.div>

        <div>
          <h1
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#f8fafc",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            CloudBuddy
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "12px",
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
                border: "1px solid rgba(56, 189, 248, 0.3)",
              }}
            >
              v2.0 AI
            </span>
          </h1>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            Your Friendly Cloud Companion & Architecture Tutor
          </p>
        </div>
      </div>


      {/* ── Center: Gemma 4 Model Badge ──────────────────────────────── */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "var(--radius-xl)",
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: "#cbd5e1",
        }}
      >
        <Cpu size={15} color="#818cf8" />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
          {modelName}
        </span>
        <span
          style={{
            fontSize: "0.625rem",
            textTransform: "uppercase",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "4px",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#10b981",
          }}
        >
          128K Context
        </span>
      </motion.div>

      {/* ── Right: Live Status Indicator ─────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "6px 14px",
          borderRadius: "var(--radius-md)",
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <span className={`status-dot ${getStatusDotClass()}`} />
        <span
          style={{
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "#cbd5e1",
          }}
        >
          {getStatusText()}
        </span>
        <Activity size={14} color="#64748b" style={{ marginLeft: 4 }} />
      </div>
    </motion.header>
  );
}
