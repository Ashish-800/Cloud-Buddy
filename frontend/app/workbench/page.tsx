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
  ShieldCheck,
  BrainCircuit,
  Maximize2,
  RefreshCw,
} from "lucide-react";

import Navbar, { type ConnectionStatus } from "@/components/Navbar";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import DraftingBoard from "@/components/DraftingBoard";
import ComplianceUploader from "@/components/ComplianceUploader";
import CritiqueViewer from "@/components/CritiqueViewer";
import DiagramCanvas from "@/components/DiagramCanvas";
import CodeExporter from "@/components/CodeExporter";
import AIReasoningPanel from "@/components/AIReasoningPanel";
import ArchitectureMentorChat from "@/components/ArchitectureMentorChat";
import CommandPalette from "@/components/CommandPalette";
import SessionHistoryDrawer from "@/components/SessionHistoryDrawer";
import { type CloudProvider } from "@/components/ProviderSelector";
import { useCloudCanvasStream } from "@/hooks/useCloudCanvasStream";

type RightTabId = "critique" | "terraform" | "compliance";

export default function WorkbenchPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [complianceFile, setComplianceFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<CloudProvider>("AWS");
  const [activeRightTab, setActiveRightTab] = useState<RightTabId>("critique");

  // Modals / Drawers state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const stream = useCloudCanvasStream();

  // Connection status derivation
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

  // Analysis Handlers
  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    await stream.startAnalysis(imageFile, complianceFile, provider);
  }, [imageFile, complianceFile, provider, stream]);

  const handleAbort = useCallback(() => {
    stream.abort();
  }, [stream]);

  const handleCommandAction = (actionId: string) => {
    switch (actionId) {
      case "analyze":
        if (imageFile) handleAnalyze();
        break;
      case "export_tf":
        setActiveRightTab("terraform");
        break;
      case "history":
        setIsHistoryOpen(true);
        break;
      case "aws":
        setProvider("AWS");
        break;
      case "gcp":
        setProvider("GCP");
        break;
      case "azure":
        setProvider("Azure");
        break;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        background: "var(--bg-dark)",
        color: "var(--text-primary)",
        overflow: "hidden",
      }}
    >
      {/* ── 1. LEFT SIDEBAR: Compact Blueprint Navigation Rail ───────── */}
      <WorkspaceSidebar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* ── 2. TOP HEADER ───────────────────────────────────────────── */}
        <Navbar
          status={connectionStatus}
          modelName="gemma-4-31b-it"
          provider={provider}
          onProviderSelect={setProvider}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />

        {/* ── 3. WORKSPACE 2-COLUMN MAIN CANVAS & INTELLIGENCE SPLIT ──── */}
        <main
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: "16px",
            padding: "16px",
            overflow: "hidden",
            background: "var(--navy-deep)",
          }}
        >
          {/* ── CENTER WORKSPACE: Interactive Drafting Board & Diagram Canvas ── */}
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              minWidth: 0,
              height: "100%",
              overflowY: "auto",
            }}
          >
            {/* Interactive Upload Drafting Board */}
            <DraftingBoard
              onFileSelect={setImageFile}
              selectedFile={imageFile}
              isStreaming={stream.isStreaming}
            />

            {/* Analysis Trigger Control Bar */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                background: "var(--navy)",
                border: "1px solid var(--grid)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
              }}
            >
              {stream.isStreaming ? (
                <button
                  type="button"
                  onClick={handleAbort}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px",
                    background: "rgba(232, 90, 90, 0.15)",
                    border: "1px solid var(--accent-rose)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--accent-rose)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <StopCircle size={16} /> Stop Gemma 4 Analysis
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!imageFile}
                  onClick={handleAnalyze}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px",
                    background: imageFile ? "var(--marker)" : "rgba(29, 78, 122, 0.4)",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    color: imageFile ? "var(--navy-deep)" : "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: imageFile ? "pointer" : "not-allowed",
                    boxShadow: imageFile ? "var(--glow-marker)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Sparkles size={16} />
                  Analyze Architecture & Stream Code
                  <ChevronRight size={16} />
                </button>
              )}
            </div>

            {/* Error Notification */}
            <AnimatePresence>
              {stream.error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--accent-rose)",
                    background: "rgba(232, 90, 90, 0.12)",
                    fontSize: "0.8125rem",
                    color: "var(--accent-rose)",
                    lineHeight: 1.5,
                  }}
                >
                  {stream.error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Diagram Canvas Container */}
            <div
              style={{
                flex: 1,
                minHeight: "360px",
                background: "var(--navy)",
                border: "1px solid var(--grid)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  background: "var(--navy-deep)",
                  borderBottom: "1px solid var(--grid)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <GitGraph size={16} color="var(--marker)" />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "var(--white-line)",
                    }}
                  >
                    Interactive Architecture Canvas (Mermaid / CAD)
                  </span>
                </div>

                {stream.detectedComponents.length > 0 && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6875rem",
                      color: "var(--marker)",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: "rgba(232, 135, 30, 0.12)",
                      border: "1px solid var(--grid)",
                    }}
                  >
                    {stream.detectedComponents.length} Nodes Identified
                  </span>
                )}
              </div>

              <div style={{ flex: 1, position: "relative" }}>
                <DiagramCanvas
                  mermaidCode={stream.mermaidCode}
                  isLoading={stream.isStreaming && !stream.mermaidCode}
                />
              </div>
            </div>
          </section>

          {/* ── RIGHT COLUMN: AI Intelligence, Critique & Terraform IDE ───── */}
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              height: "100%",
              overflowY: "auto",
            }}
          >
            {/* AI Intelligence Scores & Reasoning Feed */}
            <AIReasoningPanel
              isStreaming={stream.isStreaming}
              critiqueData={stream.critiqueData}
              detectedComponents={stream.detectedComponents}
              activeModel={stream.activeModel}
              activeProvider={stream.activeProvider}
            />

            {/* Right Tabbed Inspector Header */}
            <div
              style={{
                background: "var(--navy)",
                border: "1px solid var(--grid)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: "380px",
              }}
            >
              {/* Tab Navigation */}
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid var(--grid)",
                  background: "var(--navy-deep)",
                }}
              >
                {[
                  { id: "critique", label: "Critique", icon: MessageSquareWarning },
                  { id: "terraform", label: "Terraform IDE", icon: FileCode2 },
                  { id: "compliance", label: "Compliance", icon: ShieldCheck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeRightTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveRightTab(tab.id as RightTabId)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "12px 8px",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.75rem",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "var(--marker)" : "var(--text-muted)",
                        background: isActive ? "var(--navy)" : "transparent",
                        border: "none",
                        borderBottom: isActive ? "2px solid var(--marker)" : "2px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Icon size={14} color={isActive ? "var(--marker)" : "var(--text-muted)"} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Display */}
              <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
                {activeRightTab === "critique" && (
                  <CritiqueViewer
                    markdown={stream.critiqueText}
                    isLoading={stream.isStreaming && !stream.critiqueText}
                  />
                )}

                {activeRightTab === "terraform" && (
                  <CodeExporter
                    code={stream.terraformCode}
                    isLoading={stream.isStreaming && !stream.terraformCode}
                  />
                )}

                {activeRightTab === "compliance" && (
                  <div style={{ padding: "16px" }}>
                    <ComplianceUploader
                      onFileSelect={setComplianceFile}
                      selectedFile={complianceFile}
                      disabled={stream.isStreaming}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ── MODALS & FLOATING CONTROLS ───────────────────────────────── */}
      <ArchitectureMentorChat
        activeProvider={provider}
        score={stream.critiqueData?.score ?? null}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleCommandAction}
      />

      <SessionHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
