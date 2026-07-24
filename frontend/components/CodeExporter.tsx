"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download, FileCode2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

/* ── Types ────────────────────────────────────────────────────────────── */

interface CodeExporterProps {
  /** Terraform HCL code to display. Null = empty state. */
  code: string | null;
  /** Show loading skeleton. */
  isLoading?: boolean;
}

/* ── Toast Component ──────────────────────────────────────────────────── */

const CopyToast: React.FC<{ visible: boolean }> = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          borderRadius: "var(--radius-md)",
          background: "rgba(52, 211, 153, 0.15)",
          border: "1px solid rgba(52, 211, 153, 0.3)",
          backdropFilter: "blur(12px)",
          color: "var(--accent-emerald)",
          fontSize: "0.8125rem",
          fontWeight: 600,
          boxShadow: "var(--glow-emerald)",
        }}
      >
        <Check size={15} />
        Copied to clipboard!
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Loading Skeleton ─────────────────────────────────────────────────── */

const CodeSkeleton: React.FC = () => (
  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
    {Array.from({ length: 15 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.07 }}
        style={{
          height: 14,
          width: `${30 + Math.random() * 60}%`,
          marginLeft: i % 3 !== 0 ? (i % 5 === 0 ? 48 : 24) : 0,
          borderRadius: 4,
          background: "var(--glass-border)",
        }}
      />
    ))}
  </div>
);

/* ── Custom Syntax Theme Override ─────────────────────────────────────── */

const customStyle: Record<string, React.CSSProperties> = {
  ...vscDarkPlus,
  'code[class*="language-"]': {
    ...(vscDarkPlus['code[class*="language-"]'] as React.CSSProperties),
    fontFamily: "var(--font-mono), 'JetBrains Mono', 'Fira Code', monospace",
    fontSize: "0.8125rem",
    lineHeight: "1.7",
  },
  'pre[class*="language-"]': {
    ...(vscDarkPlus['pre[class*="language-"]'] as React.CSSProperties),
    background: "var(--bg-primary)",
    margin: 0,
    padding: "20px",
    borderRadius: 0,
  },
};

/* ── Component ────────────────────────────────────────────────────────── */

const CodeExporter: React.FC<CodeExporterProps> = ({ code, isLoading = false }) => {
  const [showToast, setShowToast] = useState(false);

  /* ── Copy to Clipboard ─────────────────────────────────────────── */

  const handleCopy = useCallback(async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }, [code]);

  /* ── Download as .tf File ──────────────────────────────────────── */

  const handleDownload = useCallback(() => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "main.tf";
    a.click();
    URL.revokeObjectURL(url);
  }, [code]);

  /* ── Render ────────────────────────────────────────────────────── */

  if (isLoading) return <CodeSkeleton />;

  if (!code) {
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
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "var(--radius-md)",
            background: "rgba(52, 211, 153, 0.08)",
            border: "1px solid var(--glass-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileCode2 size={20} color="var(--text-muted)" />
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
          Terraform code will appear here after analysis.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          borderBottom: "1px solid var(--glass-border)",
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
        }}
      >
        {/* File label */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
          <FileCode2 size={14} color="var(--accent-emerald)" />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            main.tf
          </span>
          <span
            style={{
              fontSize: "0.6875rem",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            · {code.split("\n").length} lines
          </span>
        </div>

        {/* Copy Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--glass-border)",
            background: "transparent",
            color: "var(--text-secondary)",
            fontSize: "0.6875rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-indigo)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(99, 102, 241, 0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--glass-border)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <Copy size={13} />
          Copy Code
        </motion.button>

        {/* Download Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--glass-border)",
            background: "transparent",
            color: "var(--text-secondary)",
            fontSize: "0.6875rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-emerald)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(52, 211, 153, 0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--glass-border)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <Download size={13} />
          Download main.tf
        </motion.button>
      </div>

      {/* ── Code Block ────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          borderRadius: "0 0 var(--radius-sm) var(--radius-sm)",
        }}
      >
        <SyntaxHighlighter
          language="hcl"
          style={customStyle}
          showLineNumbers
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "16px",
            color: "var(--text-muted)",
            opacity: 0.5,
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono), monospace",
            userSelect: "none",
          }}
          wrapLines
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* ── Copy Toast ────────────────────────────────────────────── */}
      <CopyToast visible={showToast} />
    </motion.div>
  );
};

export default CodeExporter;
