"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, AlertCircle, Flame } from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────────── */

interface CritiqueViewerProps {
  /** Markdown string to render. Null = empty state. */
  markdown: string | null;
  /** Show loading skeleton. */
  isLoading?: boolean;
}

/* ── Severity Badge Component ─────────────────────────────────────────── */

const SEVERITY_STYLES: Record<string, { bg: string; border: string; color: string; icon: React.ReactNode }> = {
  CRITICAL: {
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
    color: "#f87171",
    icon: <Flame size={12} />,
  },
  HIGH: {
    bg: "rgba(249, 115, 22, 0.1)",
    border: "rgba(249, 115, 22, 0.3)",
    color: "#fb923c",
    icon: <AlertTriangle size={12} />,
  },
  MEDIUM: {
    bg: "rgba(234, 179, 8, 0.1)",
    border: "rgba(234, 179, 8, 0.3)",
    color: "#facc15",
    icon: <AlertCircle size={12} />,
  },
  LOW: {
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.3)",
    color: "#60a5fa",
    icon: <Info size={12} />,
  },
  INFO: {
    bg: "rgba(99, 102, 241, 0.1)",
    border: "rgba(99, 102, 241, 0.3)",
    color: "#818cf8",
    icon: <CheckCircle2 size={12} />,
  },
};

/* ── Loading Skeleton ─────────────────────────────────────────────────── */

const Skeleton: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "8px 0" }}>
    {[100, 85, 92, 60, 78, 45, 88, 70].map((width, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        style={{
          height: i === 0 ? 28 : 14,
          width: `${width}%`,
          borderRadius: 6,
          background: "var(--glass-border)",
        }}
      />
    ))}
  </div>
);

/* ── Component ────────────────────────────────────────────────────────── */

const CritiqueViewer: React.FC<CritiqueViewerProps> = ({ markdown, isLoading = false }) => {
  if (isLoading) return <Skeleton />;

  if (!markdown) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          textAlign: "center",
          gap: "12px",
        }}
      >
        <AlertTriangle size={32} color="var(--text-muted)" strokeWidth={1.5} />
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
          No critique data available yet.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="critique-viewer"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* ── Headings ─────────────────────────────────────────── */
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginTop: 0,
                marginBottom: "16px",
                paddingBottom: "12px",
                borderBottom: "1px solid var(--glass-border)",
                letterSpacing: "-0.01em",
              }}
            >
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "24px 0 12px",
                letterSpacing: "-0.01em",
              }}
            >
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: "20px 0 8px",
              }}
            >
              {children}
            </h4>
          ),

          /* ── Paragraphs ───────────────────────────────────────── */
          p: ({ children }) => (
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                margin: "0 0 12px",
              }}
            >
              {children}
            </p>
          ),

          /* ── Blockquotes (Recommendations) ────────────────────── */
          blockquote: ({ children }) => (
            <blockquote
              style={{
                margin: "12px 0 16px",
                padding: "12px 16px",
                borderLeft: "3px solid var(--accent-indigo)",
                borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                background: "rgba(99, 102, 241, 0.06)",
                fontSize: "0.8125rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              {children}
            </blockquote>
          ),

          /* ── Inline Code (Severity Badges) ────────────────────── */
          code: ({ children, className }) => {
            const text = String(children).trim();
            const severity = SEVERITY_STYLES[text];

            if (severity && !className) {
              return (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono), monospace",
                    letterSpacing: "0.05em",
                    background: severity.bg,
                    border: `1px solid ${severity.border}`,
                    color: severity.color,
                    verticalAlign: "middle",
                  }}
                >
                  {severity.icon}
                  {text}
                </span>
              );
            }

            return (
              <code
                style={{
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.8125rem",
                  fontFamily: "var(--font-mono), monospace",
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "var(--accent-indigo-light)",
                  border: "1px solid rgba(99, 102, 241, 0.15)",
                }}
              >
                {children}
              </code>
            );
          },

          /* ── Tables ───────────────────────────────────────────── */
          table: ({ children }) => (
            <div style={{ overflowX: "auto", margin: "8px 0 16px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.8125rem",
                }}
              >
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead
              style={{
                borderBottom: "2px solid var(--glass-border)",
              }}
            >
              {children}
            </thead>
          ),

          th: ({ children }) => (
            <th
              style={{
                padding: "8px 12px",
                textAlign: "left",
                fontWeight: 600,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted)",
              }}
            >
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid var(--glass-border)",
                color: "var(--text-secondary)",
              }}
            >
              {children}
            </td>
          ),

          /* ── Horizontal Rules ─────────────────────────────────── */
          hr: () => (
            <hr
              style={{
                border: "none",
                height: 1,
                background: "var(--glass-border)",
                margin: "8px 0",
              }}
            />
          ),

          /* ── Strong ───────────────────────────────────────────── */
          strong: ({ children }) => (
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {children}
            </strong>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </motion.div>
  );
};

export default CritiqueViewer;
