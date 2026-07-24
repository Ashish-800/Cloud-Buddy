"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileCode2,
  MessageSquareWarning,
  GitGraph,
  ChevronRight,
  StopCircle,
  ArrowLeft,
} from "lucide-react";

import Navbar, { type ConnectionStatus } from "@/components/Navbar";
import UploadDropzone from "@/components/UploadDropzone";
import ComplianceUploader from "@/components/ComplianceUploader";
import ProviderSelector, { type CloudProvider } from "@/components/ProviderSelector";
import CritiqueViewer from "@/components/CritiqueViewer";
import DiagramCanvas from "@/components/DiagramCanvas";
import CodeExporter from "@/components/CodeExporter";
import { useCloudCanvasStream } from "@/hooks/useCloudCanvasStream";

/* ── Types ────────────────────────────────────────────────────────────── */

type TabId = "critique" | "diagram" | "terraform";

interface TabMeta {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  hasData: boolean;
}

/* ── Page Component ───────────────────────────────────────────────────── */

export default function WorkbenchPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [complianceFile, setComplianceFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<CloudProvider>("AWS");
  const [activeTab, setActiveTab] = useState<TabId>("critique");

  const stream = useCloudCanvasStream();

  /* ── Connection Status ────────────────────────────────────────── */
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

  /* ── Tab Configuration ────────────────────────────────────────── */
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
    <div className="workbench-shell" style={{ display: "flex", flexDirection: "column" }}>
      {/* Navbar with Gemma 4 Badge & Live Status */}
      <Navbar status={connectionStatus} modelName="gemma-4-31b-it" />

      {/* ── 2-Column Split Workbench Layout ─────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(340px, 420px) 1fr",
          gap: "20px",
          padding: "20px",
          maxWidth: "1680px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* ── LEFT PANEL: Workspace Input ─────────────────────────── */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel"
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "fit-content",
            position: "sticky",
            top: "84px",
          }}
        >
          {/* Back to landing */}
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              color: "#64748b",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#818cf8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            <ArrowLeft size={12} /> Back to Cloud Buddy
          </a>

          {/* Header */}
          <div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#f8fafc",
                margin: "0 0 4px",
              }}
            >
              Workspace Input
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "#64748b", margin: 0 }}>
              Upload architecture sketch & security guidelines
            </p>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

          {/* 1. Drag & Drop Sketch Upload Zone */}
          <UploadDropzone
            onFileSelect={setImageFile}
            selectedFile={imageFile}
            disabled={stream.isStreaming}
          />

          {/* 2. Optional Compliance / Security Policy Uploader */}
          <ComplianceUploader
            onFileSelect={setComplianceFile}
            selectedFile={complianceFile}
            disabled={stream.isStreaming}
          />

          {/* 3. Cloud Provider Segmented Pill Control */}
          <ProviderSelector
            selected={provider}
            onSelect={setProvider}
            disabled={stream.isStreaming}
          />

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

          {/* 4. Trigger / Abort Button */}
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
                padding: "14px 28px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: "#ffffff",
                background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(244, 63, 94, 0.4)",
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
              <ChevronRight size={16} style={{ opacity: 0.7 }} />
            </motion.button>
          )}

          {/* Error Banner */}
          <AnimatePresence>
            {stream.error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(244, 63, 94, 0.4)",
                  background: "rgba(244, 63, 94, 0.1)",
                  fontSize: "0.8125rem",
                  color: "#f43f5e",
                  lineHeight: 1.5,
                }}
              >
                {stream.error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Model Context */}
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
                  fontSize: "0.75rem",
                  color: "#64748b",
                  fontFamily: "var(--font-mono)",
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
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-panel"
          style={{
            padding: 0,
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 120px)",
            overflow: "hidden",
          }}
        >
          {/* Tab Navigation Bar */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              padding: "0 12px",
              background: "rgba(15,23,42,0.5)",
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
                    gap: "8px",
                    padding: "16px 20px",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#818cf8" : "#64748b",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                  }}
                >
                  {tab.icon}
                  {tab.label}

                  {tab.hasData && (
                    <span
                      style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#10b981",
                        boxShadow: "0 0 10px rgba(16,185,129,0.6)",
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="active-tab-glow"
                      style={{
                        position: "absolute",
                        bottom: 0, left: 0, right: 0, height: 2,
                        background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                        borderRadius: "2px 2px 0 0",
                        boxShadow: "0 0 12px rgba(99,102,241,0.8)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {stream.detectedComponents.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", marginLeft: "auto", paddingRight: 16 }}>
                <span
                  style={{
                    fontSize: "0.75rem", color: "#818cf8",
                    fontFamily: "var(--font-mono)", padding: "3px 10px",
                    borderRadius: 12, background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.25)",
                  }}
                >
                  {stream.detectedComponents.length} components detected
                </span>
              </div>
            )}
          </div>

          {/* Tab Content Display */}
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "100px 24px",
                      textAlign: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: 64, height: 64,
                        borderRadius: "var(--radius-lg)",
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        boxShadow: "0 0 30px rgba(99,102,241,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Sparkles size={28} color="#818cf8" />
                    </div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#f8fafc", margin: 0 }}>
                      Live Intelligence Dashboard
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0, maxWidth: 400, lineHeight: 1.6 }}>
                      Upload an architecture sketch and click{" "}
                      <strong style={{ color: "#818cf8" }}>Analyze System Design</strong>{" "}
                      to watch Gemma 4 produce real-time critiques, Mermaid diagrams, and Terraform code.
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

      {/* Responsive Breakpoint Override */}
      <style>{`
        @media (max-width: 960px) {
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
