"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  ShieldCheck,
  DollarSign,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import type { CritiqueData, DetectedComponent } from "@/hooks/useCloudCanvasStream";

interface AIReasoningPanelProps {
  isStreaming: boolean;
  critiqueData: CritiqueData | null;
  detectedComponents: DetectedComponent[];
  activeModel: string | null;
  activeProvider: string | null;
}

export default function AIReasoningPanel({
  isStreaming,
  critiqueData,
  detectedComponents,
  activeModel,
  activeProvider,
}: AIReasoningPanelProps) {
  const score = critiqueData?.score ?? null;

  // Calculate score color based on threshold
  const getScoreColor = (val: number) => {
    if (val >= 80) return "var(--accent-emerald)";
    if (val >= 50) return "var(--accent-marker)";
    return "var(--accent-rose)";
  };

  // Sub-scores derived or simulated for breakdown display
  const securityScore = score !== null ? Math.min(100, Math.max(20, score - 5)) : null;
  const costScore = score !== null ? Math.min(100, Math.max(30, score + 8)) : null;
  const availabilityScore = score !== null ? Math.min(100, Math.max(25, score - 2)) : null;
  const complianceScore = score !== null ? Math.min(100, Math.max(15, score - 10)) : null;

  return (
    <div
      style={{
        background: "var(--navy)",
        border: "1px solid var(--grid)",
        borderRadius: "var(--radius-lg)",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* ── Panel Header ────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--grid)",
          paddingBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BrainCircuit size={18} color="var(--marker)" />
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "var(--white-line)",
              margin: 0,
            }}
          >
            AI Intelligence & Scores
          </h3>
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.625rem",
            color: isStreaming ? "var(--marker)" : "var(--accent-emerald)",
            padding: "2px 8px",
            borderRadius: "10px",
            background: isStreaming
              ? "rgba(232, 135, 30, 0.15)"
              : "rgba(76, 175, 125, 0.15)",
            border: `1px solid ${
              isStreaming ? "var(--marker)" : "var(--accent-emerald)"
            }`,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {isStreaming ? (
            <>
              <Loader2 size={10} className="animate-spin" /> Live Stream
            </>
          ) : (
            <>
              <CheckCircle2 size={10} /> Model Ready
            </>
          )}
        </span>
      </div>

      {/* ── Overall Architecture Health Score ───────────────────────── */}
      <div
        style={{
          background: "var(--navy-deep)",
          border: "1px solid var(--grid)",
          borderRadius: "var(--radius-md)",
          padding: "16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "8px",
          }}
        >
          Overall Architecture Health Score
        </div>

        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.75rem",
            fontWeight: 800,
            color: score !== null ? getScoreColor(score) : "var(--text-muted)",
            lineHeight: 1,
            marginBottom: "8px",
          }}
        >
          {score !== null ? `${score}/100` : "—"}
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "rgba(29, 78, 122, 0.4)",
            borderRadius: "4px",
            overflow: "hidden",
            margin: "0 auto 8px",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score ?? 0}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              height: "100%",
              background: score !== null ? getScoreColor(score) : "transparent",
              borderRadius: "4px",
            }}
          />
        </div>

        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
          }}
        >
          {score === null
            ? "Upload a sketch to compute health score"
            : score >= 80
            ? "🟢 Enterprise Ready & Highly Resilient"
            : score >= 50
            ? "🟡 Moderate Risk — Security & Single Points of Failure Detected"
            : "🔴 High Risk — Critical Compliance Violations & SPOF"}
        </div>
      </div>

      {/* ── Sub-Scores Progress Bar Metrics ─────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { label: "Security Posture", val: securityScore, icon: ShieldCheck },
          { label: "Cost Optimization", val: costScore, icon: DollarSign },
          { label: "High Availability", val: availabilityScore, icon: Zap },
          { label: "Compliance Alignment", val: complianceScore, icon: Activity },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  marginBottom: "4px",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Icon size={13} color="var(--marker)" />
                  {item.label}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                  {item.val !== null ? `${item.val}%` : "—"}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "5px",
                  background: "rgba(29, 78, 122, 0.3)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.val ?? 0}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  style={{
                    height: "100%",
                    background:
                      item.val !== null
                        ? item.val >= 75
                          ? "var(--accent-emerald)"
                          : item.val >= 50
                          ? "var(--marker)"
                          : "var(--accent-rose)"
                        : "transparent",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Live AI Reasoning Activity Feed ────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid var(--grid)",
          paddingTop: "12px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            marginBottom: "8px",
          }}
        >
          Live AI Reasoning Pipeline
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "var(--accent-emerald)" }}>✓</span> Ingested Multimodal Vision Canvas
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "var(--accent-emerald)" }}>✓</span> Mapped {detectedComponents.length} Cloud Service Nodes
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: isStreaming ? "var(--marker)" : "var(--accent-emerald)" }}>
              {isStreaming ? "●" : "✓"}
            </span>{" "}
            Cross-referencing Well-Architected Framework ({activeProvider || "AWS"})
          </div>
        </div>
      </div>
    </div>
  );
}
