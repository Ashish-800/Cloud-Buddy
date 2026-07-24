"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, AlertCircle, Flame, ShieldAlert } from "lucide-react";

interface CritiqueViewerProps {
  markdown: string | null;
  isLoading?: boolean;
  onNodeClick?: (nodeId: string) => void;
}

const SEVERITY_MAP: Record<string, { bg: string; border: string; color: string; icon: React.ReactNode }> = {
  CRITICAL: {
    bg: "rgba(232, 90, 90, 0.15)",
    border: "var(--accent-rose)",
    color: "var(--accent-rose)",
    icon: <Flame size={13} />,
  },
  HIGH: {
    bg: "rgba(232, 135, 30, 0.15)",
    border: "var(--marker)",
    color: "var(--marker)",
    icon: <AlertTriangle size={13} />,
  },
  MEDIUM: {
    bg: "rgba(244, 162, 54, 0.12)",
    border: "var(--accent-marker-light)",
    color: "var(--accent-marker-light)",
    icon: <AlertCircle size={13} />,
  },
  LOW: {
    bg: "rgba(56, 189, 248, 0.12)",
    border: "var(--accent-blue)",
    color: "var(--accent-blue)",
    icon: <Info size={13} />,
  },
  INFO: {
    bg: "rgba(76, 175, 125, 0.12)",
    border: "var(--accent-emerald)",
    color: "var(--accent-emerald)",
    icon: <CheckCircle2 size={13} />,
  },
};

const Skeleton: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "12px 0" }}>
    {[95, 80, 88, 65, 75, 50, 85].map((width, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
        style={{
          height: i === 0 ? "24px" : "16px",
          width: `${width}%`,
          borderRadius: "var(--radius-sm)",
          background: "rgba(29, 78, 122, 0.4)",
        }}
      />
    ))}
  </div>
);

export default function CritiqueViewer({
  markdown,
  isLoading = false,
  onNodeClick,
}: CritiqueViewerProps) {
  if (isLoading) {
    return (
      <div style={{ padding: "16px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--marker)",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ShieldAlert size={14} /> Evaluating Architecture against AWS Well-Architected Framework...
        </div>
        <Skeleton />
      </div>
    );
  }

  if (!markdown) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        <ShieldAlert size={36} color="var(--grid)" style={{ marginBottom: "12px" }} />
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            margin: "0 0 6px",
          }}
        >
          No Critique Available
        </h4>
        <p style={{ fontSize: "0.8125rem", margin: 0, maxWidth: "340px" }}>
          Upload an architecture sketch and run analysis to receive structured architectural findings.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: "16px",
        color: "var(--text-primary)",
        lineHeight: 1.6,
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "var(--white-line)",
                borderBottom: "1px solid var(--grid)",
                paddingBottom: "8px",
                marginTop: "20px",
                marginBottom: "12px",
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--marker)",
                marginTop: "16px",
                marginBottom: "8px",
              }}
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => {
            const text = String(children);
            let sevKey = "INFO";
            if (text.includes("CRITICAL")) sevKey = "CRITICAL";
            else if (text.includes("HIGH")) sevKey = "HIGH";
            else if (text.includes("MEDIUM")) sevKey = "MEDIUM";
            else if (text.includes("LOW")) sevKey = "LOW";

            const style = SEVERITY_MAP[sevKey] || SEVERITY_MAP.INFO;

            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  marginTop: "16px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "var(--white-line)",
                  }}
                >
                  {children}
                </div>

                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    color: style.color,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  {style.icon} {sevKey}
                </span>
              </div>
            );
          },
          blockquote: ({ children }) => (
            <blockquote
              style={{
                background: "rgba(232, 135, 30, 0.08)",
                borderLeft: "3px solid var(--marker)",
                padding: "10px 14px",
                borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                margin: "12px 0",
                fontSize: "0.8125rem",
                color: "var(--text-primary)",
              }}
            >
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: "auto", margin: "14px 0" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.8125rem",
                  border: "1px solid var(--grid)",
                }}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th
              style={{
                background: "var(--navy-deep)",
                padding: "8px 12px",
                borderBottom: "1px solid var(--grid)",
                textAlign: "left",
                fontFamily: "var(--font-mono)",
                color: "var(--marker)",
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid rgba(29, 78, 122, 0.4)",
                color: "var(--text-secondary)",
              }}
            >
              {children}
            </td>
          ),
          code: ({ children }) => (
            <code
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                background: "var(--navy-deep)",
                padding: "2px 6px",
                borderRadius: "3px",
                color: "var(--marker)",
                border: "1px solid var(--grid)",
              }}
            >
              {children}
            </code>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </motion.div>
  );
}
