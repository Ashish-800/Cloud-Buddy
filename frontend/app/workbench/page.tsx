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
  RotateCcw,
  BrainCircuit,
  SlidersHorizontal,
  X,
  Layers,
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

type ViewStage = "upload" | "analyzing" | "diagram" | "critique" | "terraform" | "compliance";

export default function WorkbenchPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [complianceFile, setComplianceFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<CloudProvider>("AWS");
  const [activeStage, setActiveStage] = useState<ViewStage>("upload");
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Modals & Drawers state
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

  // Handle Analysis Trigger
  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    setActiveStage("analyzing");
    setIsRightPanelOpen(true);
    await stream.startAnalysis(imageFile, complianceFile, provider);
    setActiveStage("diagram");
  }, [imageFile, complianceFile, provider, stream]);

  // Handle Reset / New Session
  const handleNewSession = useCallback(() => {
    setImageFile(null);
    setComplianceFile(null);
    stream.reset();
    setActiveStage("upload");
    setIsRightPanelOpen(false);
  }, [stream]);

  const handleAbort = useCallback(() => {
    stream.abort();
  }, [stream]);

  const handleCommandAction = (actionId: string) => {
    switch (actionId) {
      case "analyze":
        if (imageFile) handleAnalyze();
        break;
      case "export_tf":
        setActiveStage("terraform");
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
      {/* ── 1. LEFT SIDEBAR: Collapsible Blueprint Rail ───────────────── */}
      <WorkspaceSidebar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onNewSession={handleNewSession}
      />

      {/* ── MAIN WORKSPACE CONTENT AREA ───────────────────────────────── */}
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
        {/* ── 2. TOP HEADER BAR ───────────────────────────────────────── */}
        <Navbar
          status={connectionStatus}
          modelName="gemma-4-31b-it"
          provider={provider}
          onProviderSelect={setProvider}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />

        {/* ── 3. STAGE MODE NAVIGATION BAR (Appears post-upload) ─────── */}
        {activeStage !== "upload" && (
          <div
            style={{
              padding: "0 20px",
              background: "var(--navy-deep)",
              borderBottom: "1px solid var(--grid)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "44px",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              {[
                { id: "diagram", label: "Interactive Diagram", icon: GitGraph },
                { id: "critique", label: "Critique Findings", icon: MessageSquareWarning },
                { id: "terraform", label: "Terraform IDE", icon: FileCode2 },
                { id: "compliance", label: "Compliance Audit", icon: ShieldCheck },
              ].map((stage) => {
                const Icon = stage.icon;
                const isActive = activeStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id as ViewStage)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.75rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "var(--marker)" : "var(--text-muted)",
                      background: isActive ? "rgba(232, 135, 30, 0.12)" : "transparent",
                      border: "none",
                      borderBottom: isActive ? "2px solid var(--marker)" : "2px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon size={14} color={isActive ? "var(--marker)" : "var(--text-muted)"} />
                    {stage.label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={handleNewSession}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  background: "rgba(29, 78, 122, 0.3)",
                  border: "1px solid var(--grid)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.6875rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={12} /> New Sketch
              </button>

              <button
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  background: isRightPanelOpen ? "rgba(232, 135, 30, 0.15)" : "rgba(29, 78, 122, 0.3)",
                  border: `1px solid ${isRightPanelOpen ? "var(--marker)" : "var(--grid)"}`,
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.6875rem",
                  fontFamily: "var(--font-mono)",
                  color: isRightPanelOpen ? "var(--marker)" : "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <BrainCircuit size={13} />
                <span>AI Intelligence</span>
              </button>
            </div>
          </div>
        )}

        {/* ── 4. PROGRESSIVE DISCLOSURE STAGE WORKSPACE ───────────────── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            position: "relative",
            background: "var(--navy-deep)",
          }}
        >
          {/* ── MAIN CENTERPIECE CANVAS (Fills 100% when right panel collapsed) ── */}
          <div
            style={{
              flex: 1,
              height: "100%",
              overflowY: "auto",
              padding: activeStage === "upload" ? "40px 24px" : "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: activeStage === "upload" ? "center" : "stretch",
              justifyContent: activeStage === "upload" ? "center" : "flex-start",
              minWidth: 0,
            }}
          >
            {/* ── STAGE 1: INITIAL UPLOAD (Serene & Spacious Focal Point) ── */}
            {activeStage === "upload" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  width: "100%",
                  maxWidth: "760px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <DraftingBoard
                  onFileSelect={setImageFile}
                  selectedFile={imageFile}
                  isStreaming={stream.isStreaming}
                />

                {/* Single Primary Action Button */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <motion.button
                    whileHover={imageFile ? { scale: 1.02 } : undefined}
                    whileTap={imageFile ? { scale: 0.98 } : undefined}
                    disabled={!imageFile || stream.isStreaming}
                    onClick={handleAnalyze}
                    style={{
                      width: "100%",
                      maxWidth: "480px",
                      padding: "16px 28px",
                      background: imageFile ? "var(--marker)" : "rgba(29, 78, 122, 0.3)",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      color: imageFile ? "var(--navy-deep)" : "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      cursor: imageFile ? "pointer" : "not-allowed",
                      boxShadow: imageFile ? "var(--glow-marker)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Sparkles size={18} />
                    Analyze Architecture & Stream HCL
                    <ChevronRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STAGE 2: AI SCANNING & REASONING ───────────────────── */}
            {activeStage === "analyzing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                <DraftingBoard
                  onFileSelect={setImageFile}
                  selectedFile={imageFile}
                  isStreaming={true}
                />
              </motion.div>
            )}

            {/* ── STAGE 3: INTERACTIVE DIAGRAM CENTERPIECE ───────────── */}
            {activeStage === "diagram" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  flex: 1,
                  height: "100%",
                  background: "var(--navy)",
                  border: "1px solid var(--grid)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <DiagramCanvas
                  mermaidCode={stream.mermaidCode}
                  isLoading={stream.isStreaming && !stream.mermaidCode}
                />
              </motion.div>
            )}

            {/* ── STAGE 4: ARCHITECTURAL CRITIQUE ─────────────────────── */}
            {activeStage === "critique" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  flex: 1,
                  background: "var(--navy)",
                  border: "1px solid var(--grid)",
                  borderRadius: "var(--radius-lg)",
                  overflowY: "auto",
                  padding: "16px",
                }}
              >
                <CritiqueViewer
                  markdown={stream.critiqueText}
                  isLoading={stream.isStreaming && !stream.critiqueText}
                />
              </motion.div>
            )}

            {/* ── STAGE 5: TERRAFORM HCL IDE ─────────────────────────── */}
            {activeStage === "terraform" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  flex: 1,
                  height: "100%",
                }}
              >
                <CodeExporter
                  code={stream.terraformCode}
                  isLoading={stream.isStreaming && !stream.terraformCode}
                />
              </motion.div>
            )}

            {/* ── STAGE 6: COMPLIANCE AUDIT ──────────────────────────── */}
            {activeStage === "compliance" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  flex: 1,
                  background: "var(--navy)",
                  border: "1px solid var(--grid)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px",
                }}
              >
                <ComplianceUploader
                  onFileSelect={setComplianceFile}
                  selectedFile={complianceFile}
                  disabled={stream.isStreaming}
                />
              </motion.div>
            )}
          </div>

          {/* ── RIGHT CONTEXT PANEL: Slides in only when requested ───── */}
          <AnimatePresence>
            {isRightPanelOpen && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                style={{
                  width: "360px",
                  height: "100%",
                  borderLeft: "1px solid var(--grid)",
                  background: "var(--navy)",
                  padding: "16px",
                  overflowY: "auto",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    borderBottom: "1px solid var(--grid)",
                    paddingBottom: "10px",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem" }}>
                    AI Context & Telemetry
                  </span>
                  <button
                    onClick={() => setIsRightPanelOpen(false)}
                    style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <AIReasoningPanel
                  isStreaming={stream.isStreaming}
                  critiqueData={stream.critiqueData}
                  detectedComponents={stream.detectedComponents}
                  activeModel={stream.activeModel}
                  activeProvider={stream.activeProvider}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ── MODALS & ASSISTANTS ──────────────────────────────────────── */}
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
