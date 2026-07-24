"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  FileCode2,
  MessageSquareWarning,
  GitGraph,
  ChevronRight,
  StopCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import UploadDropzone from "@/components/UploadDropzone";
import ComplianceUploader from "@/components/ComplianceUploader";
import ProviderSelector, { type CloudProvider } from "@/components/ProviderSelector";
import CritiqueViewer from "@/components/CritiqueViewer";
import DiagramCanvas from "@/components/DiagramCanvas";
import CodeExporter from "@/components/CodeExporter";
import { useCloudCanvasStream } from "@/hooks/useCloudCanvasStream";
import type { ConnectionStatus } from "@/components/Navbar";

/* ── Types ────────────────────────────────────────────────────────────── */

type TabId = "critique" | "diagram" | "terraform";

interface TabMeta {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  /** Dot indicator color when data is available. */
  hasData: boolean;
}

/* ── Page Component ───────────────────────────────────────────────────── */

export default function WorkbenchPage() {
  /* ── Local UI State ─────────────────────────────────────────────── */
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [complianceFile, setComplianceFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<CloudProvider>("AWS");
  const [activeTab, setActiveTab] = useState<TabId>("critique");

  /* ── Streaming Hook ─────────────────────────────────────────────── */
  const stream = useCloudCanvasStream();

  /* ── Derived State ──────────────────────────────────────────────── */
  const connectionStatus: ConnectionStatus = stream.isStreaming
    ? "processing"
    : stream.error
      ? "error"
      : stream.isComplete
        ? "active"
        : "idle";

  const hasResults =
    stream.critiqueText !== null ||
    stream.mermaidCode !== null ||
    stream.terraformCode !== null;

  /* ── Tab Config (dynamic) ───────────────────────────────────────── */
  const tabs: TabMeta[] = [
    {
      id: "critique",
      label: "Architectural Critique",
      icon: <MessageSquareWarning size={15} />,
      hasData: stream.critiqueText !== null,
    },
    {
      id: "diagram",
      label: "Interactive Diagram",
      icon: <GitGraph size={15} />,
      hasData: stream.mermaidCode !== null,
    },
    {
      id: "terraform",
      label: "Terraform Code",
      icon: <FileCode2 size={15} />,
      hasData: stream.terraformCode !== null,
    },
  ];

  /* ── Handlers ───────────────────────────────────────────────────── */

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    await stream.startAnalysis(imageFile, complianceFile, provider);
  }, [imageFile, complianceFile, provider, stream]);

  const handleAbort = useCallback(() => {
    stream.abort();
  }, [stream]);

  /* ── Tab Content Renderer ───────────────────────────────────────── */

  const renderTabContent = () => {
    switch (activeTab) {
      case "critique":
        return (
          <CritiqueViewer
            markdown={stream.critiqueText}
            isLoading={stream.isStreaming && !stream.critiqueText}
          />
        );
      case "diagram":
        return (
          <DiagramCanvas
            mermaidCode={stream.mermaidCode}
            isLoading={stream.isStreaming && !stream.mermaidCode}
          />
        );
      case "terraform":
        return (
          <CodeExporter
            code={stream.terraformCode}
            isLoading={stream.isStreaming && !stream.terraformCode}
          />
        );
    }
  };

  /* ── Main Render ───────────────────────────────────────────────── */

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Navbar status={connectionStatus} />

      {/* ── Workbench Grid ─────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(340px, 420px) 1fr",
          gap: "16px",
          padding: "16px",
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* ── LEFT PANEL: Workspace Input ─────────────────────────── */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel"
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "fit-content",
            position: "sticky",
            top: "88px",
          }}
        >
          {/* Section header */}
          <div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 4px",
              }}
            >
              Workspace
            </h2>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              Upload your architecture sketch to begin analysis
            </p>
          </div>

          <div style={{ height: 1, background: "var(--glass-border)" }} />

          {/* Upload Zone */}
          <UploadDropzone
            onFileSelect={setImageFile}
            selectedFile={imageFile}
            disabled={stream.isStreaming}
          />

          {/* Compliance Upload */}
          <ComplianceUploader
            onFileSelect={setComplianceFile}
            selectedFile={complianceFile}
            disabled={stream.isStreaming}
          />

          {/* Provider Selector */}
          <ProviderSelector
            selected={provider}
            onSelect={setProvider}
            disabled={stream.isStreaming}
          />

          <div style={{ height: 1, background: "var(--glass-border)" }} />

          {/* Analyze / Abort Button */}
          {stream.isStreaming ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAbort}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
                padding: "14px 32px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.9375rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                color: "white",
                background: "linear-gradient(135deg, var(--accent-rose), #e11d48)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <StopCircle size={18} />
              Stop Analysis
            </motion.button>
          ) : (
            <motion.button
              whileHover={imageFile ? { scale: 1.02 } : undefined}
              whileTap={imageFile ? { scale: 0.98 } : undefined}
              className="btn-analyze"
              disabled={!imageFile}
              onClick={handleAnalyze}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
              }}
            >
              <Sparkles size={18} />
              Analyze System Design
              <ChevronRight size={16} style={{ opacity: 0.6 }} />
            </motion.button>
          )}

          {/* Error banner */}
          <AnimatePresence>
            {stream.error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(251, 113, 133, 0.3)",
                  background: "rgba(251, 113, 133, 0.08)",
                  fontSize: "0.8125rem",
                  color: "var(--accent-rose)",
                  lineHeight: 1.5,
                }}
              >
                {stream.error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Model info (shown after connection) */}
          <AnimatePresence>
            {stream.activeModel && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.6875rem",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                <span className="status-dot status-dot--active" />
                {stream.activeModel} · {stream.activeProvider}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>

        {/* ── RIGHT PANEL: Live Intelligence Dashboard ────────────── */}
        <motion.section
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel"
          style={{
            padding: 0,
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100dvh - 120px)",
            overflow: "hidden",
          }}
        >
          {/* ── Tab Bar ──────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--glass-border)",
              padding: "0 8px",
            }}
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "14px 18px",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? "var(--accent-indigo-light)"
                      : "var(--text-muted)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                  }}
                >
                  {tab.icon}
                  {tab.label}

                  {/* Data availability dot */}
                  {tab.hasData && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--accent-emerald)",
                        boxShadow: "var(--glow-emerald)",
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Active tab indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "var(--accent-indigo)",
                        borderRadius: "1px 1px 0 0",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {/* Component count badge */}
            {stream.detectedComponents.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                  paddingRight: "16px",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono), monospace",
                  }}
                >
                  {stream.detectedComponents.length} components detected
                </span>
              </div>
            )}
          </div>

          {/* ── Tab Content ──────────────────────────────────────── */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{
                  height: "100%",
                  ...(activeTab !== "diagram" ? { padding: "24px" } : {}),
                }}
              >
                {!hasResults && !stream.isStreaming ? (
                  /* ── Empty State ────────────────────────────────── */
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "80px 24px",
                      textAlign: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "var(--radius-lg)",
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid var(--glass-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Sparkles size={28} color="var(--text-muted)" />
                    </div>
                    <p
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        margin: 0,
                      }}
                    >
                      Intelligence Dashboard
                    </p>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--text-muted)",
                        margin: 0,
                        maxWidth: 360,
                        lineHeight: 1.6,
                      }}
                    >
                      Upload an architecture sketch and hit{" "}
                      <strong style={{ color: "var(--text-secondary)" }}>
                        Analyze
                      </strong>{" "}
                      to see the critique, Mermaid diagram, and Terraform code
                      stream in live.
                    </p>
                  </div>
                ) : (
                  renderTabContent()
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>
      </main>

      {/* ── Responsive stacking ────────────────────────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          main {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
