"use client";

import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  FileCode2,
  MessageSquareWarning,
  GitGraph,
  ChevronRight,
  StopCircle,
} from "lucide-react";

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
  const [editMode, setEditMode] = useState<"edit" | "analyze">("edit");

  const stream = useCloudCanvasStream();

  const hasResults =
    stream.critiqueText !== null ||
    stream.mermaidCode !== null ||
    stream.terraformCode !== null;

  const tabs: TabMeta[] = [
    { id: "critique", label: "Anti-Patterns", icon: <MessageSquareWarning size={15} />, hasData: stream.critiqueText !== null },
    { id: "diagram", label: "Interactive Diagram", icon: <GitGraph size={15} />, hasData: stream.mermaidCode !== null },
    { id: "terraform", label: "Terraform Code", icon: <FileCode2 size={15} />, hasData: stream.terraformCode !== null },
  ];

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    await stream.startAnalysis(imageFile, complianceFile, provider);
  }, [imageFile, complianceFile, provider, stream]);

  const handleAbort = useCallback(() => {
    stream.abort();
  }, [stream]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "critique":
        return <CritiqueViewer markdown={stream.critiqueText} isLoading={stream.isStreaming && !stream.critiqueText} />;
      case "diagram":
        return <DiagramCanvas mermaidCode={stream.mermaidCode} isLoading={stream.isStreaming && !stream.mermaidCode} />;
      case "terraform":
        return <CodeExporter code={stream.terraformCode} isLoading={stream.isStreaming && !stream.terraformCode} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: `calc(100dvh - var(--header-height))` }}>
      {/* Breadcrumbs & Toolbar */}
      <div
        style={{
          height: "48px",
          borderBottom: "1px solid var(--outline-variant)",
          padding: "0 var(--space-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--surface-container-lowest)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
          <a href="/" style={{ color: "var(--secondary)", textDecoration: "none" }}>CloudCanvas</a>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--on-surface-variant)" }}>chevron_right</span>
          <a href="/workbench" style={{ color: "var(--secondary)", textDecoration: "none" }}>Architectures</a>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--on-surface-variant)" }}>chevron_right</span>
          <span style={{ color: "var(--on-surface)" }}>My-New-Architecture</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          {/* Edit / Analyze Toggle */}
          <div
            style={{
              display: "flex",
              background: "var(--surface-container)",
              borderRadius: "var(--radius-md)",
              padding: "2px",
              border: "1px solid var(--outline-variant)",
            }}
          >
            <button
              onClick={() => setEditMode("edit")}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: editMode === "edit" ? 700 : 400,
                background: editMode === "edit" ? "var(--surface-container-lowest)" : "transparent",
                boxShadow: editMode === "edit" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => setEditMode("analyze")}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: editMode === "analyze" ? 700 : 400,
                background: editMode === "analyze" ? "var(--surface-container-lowest)" : "transparent",
                boxShadow: editMode === "analyze" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                color: "var(--on-surface-variant)",
              }}
            >
              Analyze
            </button>
          </div>

          <a
            href="/deploy"
            className="btn-primary"
            style={{ padding: "6px 16px", fontSize: "11px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}
          >
            Deploy
          </a>
        </div>
      </div>

      {/* Warning Banners */}
      <div style={{ padding: "var(--space-sm)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        <div className="banner-warning">
          <span className="material-symbols-outlined" style={{ color: "var(--primary-container)", fontSize: "20px" }}>warning</span>
          <div>
            <h4 style={{ fontSize: "12px", fontWeight: 700, margin: "0 0 2px" }}>Potential cost spike detected</h4>
            <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", margin: 0 }}>
              The current configuration for Multi-Region failover may increase monthly costs by ~45%.
            </p>
          </div>
        </div>
        <div className="banner-error">
          <span className="material-symbols-outlined" style={{ color: "var(--error)", fontSize: "20px" }}>error</span>
          <div>
            <h4 style={{ fontSize: "12px", fontWeight: 700, margin: "0 0 2px" }}>Security vulnerability found</h4>
            <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", margin: 0 }}>
              S3 Bucket &apos;static-assets&apos; is configured with public-read access. Terraform plan will fail validation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Work Area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Canvas Area */}
        <div
          className="canvas-grid"
          style={{
            flex: 1,
            position: "relative",
            background: "var(--surface-container-lowest)",
            overflow: "hidden",
          }}
        >
          {/* Upload + Controls Panel (centered) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "var(--space-xl)",
            }}
          >
            {!imageFile && !hasResults ? (
              /* Upload state */
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", width: "100%", maxWidth: "480px" }}>
                <UploadDropzone onFileSelect={setImageFile} selectedFile={imageFile} disabled={stream.isStreaming} />
                <ComplianceUploader onFileSelect={setComplianceFile} selectedFile={complianceFile} disabled={stream.isStreaming} />
                <ProviderSelector selected={provider} onSelect={setProvider} disabled={stream.isStreaming} />

                <div style={{ height: 1, background: "var(--aws-border-color)" }} />

                {/* Analyze / Abort */}
                {stream.isStreaming ? (
                  <button onClick={handleAbort} className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "var(--error)" }}>
                    <StopCircle size={16} />
                    Stop Analysis
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    disabled={!imageFile}
                    onClick={handleAnalyze}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Sparkles size={16} />
                    Analyze System Design
                    <ChevronRight size={14} style={{ opacity: 0.6 }} />
                  </button>
                )}

                {/* Error */}
                <AnimatePresence>
                  {stream.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid rgba(186, 26, 26, 0.3)",
                        background: "rgba(186, 26, 26, 0.06)",
                        fontSize: "12px",
                        color: "var(--error)",
                      }}
                    >
                      {stream.error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Architecture cards placeholder */
              <div style={{ display: "flex", gap: "var(--space-xl)", flexWrap: "wrap", justifyContent: "center" }}>
                <div className="card" style={{ padding: "var(--space-md)", width: "288px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--outline-variant)", paddingBottom: "var(--space-xs)" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--secondary)" }}>cloud</span>
                    <span style={{ fontSize: "16px", fontWeight: 600 }}>AWS VPC</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-container-low)", padding: "var(--space-xs)", borderRadius: "var(--radius-md)" }}>
                      <span style={{ fontSize: "12px", color: "var(--on-surface-variant)" }}>Public Subnet</span>
                      <span style={{ fontSize: "10px", background: "var(--secondary-fixed)", color: "var(--on-secondary-container)", padding: "1px 4px", borderRadius: "var(--radius-md)" }}>10.0.1.0/24</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-container-low)", padding: "var(--space-xs)", borderRadius: "var(--radius-md)" }}>
                      <span style={{ fontSize: "12px", color: "var(--on-surface-variant)" }}>Private Subnet</span>
                      <span style={{ fontSize: "10px", background: "var(--secondary-fixed)", color: "var(--on-secondary-container)", padding: "1px 4px", borderRadius: "var(--radius-md)" }}>10.0.2.0/24</span>
                    </div>
                  </div>
                </div>
                <div className="card" style={{ padding: "var(--space-md)", width: "256px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--outline-variant)", paddingBottom: "var(--space-xs)" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>dns</span>
                    <span style={{ fontSize: "16px", fontWeight: 600 }}>EC2 Cluster</span>
                  </div>
                  <div style={{ height: "128px", border: "1px dashed var(--outline-variant)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-container-low)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--outline)", opacity: 0.5 }}>storage</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Controls */}
          <div
            style={{
              position: "absolute",
              bottom: "var(--space-md)",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "var(--surface-container-lowest)",
              border: "1px solid var(--outline-variant)",
              borderRadius: "999px",
              padding: "4px var(--space-md)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {["zoom_in", "zoom_out"].map((icon) => (
              <button key={icon} style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", borderRadius: "50%" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{icon}</span>
              </button>
            ))}
            <div style={{ width: 1, height: 24, background: "var(--outline-variant)", margin: "0 4px" }} />
            {["undo", "redo"].map((icon) => (
              <button key={icon} style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", borderRadius: "50%" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{icon}</span>
              </button>
            ))}
            <div style={{ width: 1, height: 24, background: "var(--outline-variant)", margin: "0 4px" }} />
            <button style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", borderRadius: "50%" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--primary)" }}>auto_fix</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar: Intelligence + Terraform */}
        <aside
          style={{
            width: "320px",
            background: "var(--surface-container-lowest)",
            borderLeft: "1px solid var(--outline-variant)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Intelligence Panel */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", borderBottom: "1px solid var(--outline-variant)", minHeight: 0 }}>
            <div style={{ padding: "var(--space-md)", background: "var(--surface-container-low)", borderBottom: "1px solid var(--outline-variant)", display: "flex", alignItems: "center", gap: "var(--space-sm)", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>psychology</span>
              <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>Intelligence</h3>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "var(--space-md)" }}>
              {hasResults ? (
                <div>
                  {/* Tab bar for results */}
                  <div style={{ display: "flex", gap: "2px", marginBottom: "var(--space-md)" }}>
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          flex: 1,
                          padding: "6px 8px",
                          fontSize: "11px",
                          fontWeight: activeTab === tab.id ? 700 : 400,
                          background: activeTab === tab.id ? "var(--surface-container)" : "transparent",
                          border: activeTab === tab.id ? "1px solid var(--outline-variant)" : "1px solid transparent",
                          borderRadius: "var(--radius-md)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          color: activeTab === tab.id ? "var(--on-surface)" : "var(--on-surface-variant)",
                        }}
                      >
                        {tab.icon}
                        {tab.hasData && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />}
                      </button>
                    ))}
                  </div>
                  {renderTabContent()}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                  {/* Anti-Patterns */}
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-sm)" }}>Anti-Patterns</p>
                    <div className="card" style={{ padding: "var(--space-sm)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--error)", fontSize: "18px" }}>cancel</span>
                        <span style={{ fontSize: "12px", fontWeight: 700 }}>Hardcoded Credentials</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", margin: "4px 0 0" }}>Detected plain-text access keys in user data scripts.</p>
                    </div>
                  </div>

                  {/* Critiques */}
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-sm)" }}>Critiques</p>
                    <div style={{ background: "var(--surface-container-low)", border: "1px solid rgba(219, 194, 173, 0.3)", borderRadius: "var(--radius-lg)", padding: "var(--space-sm)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--primary)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>lightbulb</span>
                        <span style={{ fontSize: "12px", fontWeight: 700 }}>Cost Optimization</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", margin: "4px 0 0" }}>Switching to Graviton3 instances (t4g) could reduce costs by 20% for this workload.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terraform Lab */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#232f3e", color: "white" }}>
            <div style={{ padding: "var(--space-md)", background: "#161e2d", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--secondary-container)" }}>terminal</span>
                <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>Terraform Lab</h3>
              </div>
              <span style={{ fontSize: "12px", color: "var(--secondary-fixed)", opacity: 0.6 }}>main.tf</span>
            </div>
            <div className="code-block" style={{ flex: 1, overflow: "auto", padding: "var(--space-md)", background: "#1e2631" }}>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "12px", lineHeight: "18px" }}>
                <span style={{ color: "var(--primary-fixed-dim)" }}>resource</span>{" "}
                <span style={{ color: "var(--tertiary-fixed-dim)" }}>&quot;aws_vpc&quot;</span> &quot;main&quot; {`{`}{"\n"}
                {"  "}cidr_block = <span style={{ color: "var(--secondary-fixed)" }}>&quot;10.0.0.0/16&quot;</span>{"\n"}
                {"\n"}
                {"  "}enable_dns_hostnames = <span style={{ color: "var(--secondary-fixed-dim)" }}>true</span>{"\n"}
                {"\n"}
                {"  "}tags = {`{`}{"\n"}
                {"    "}Name = <span style={{ color: "var(--secondary-fixed)" }}>&quot;cloud-canvas-vpc&quot;</span>{"\n"}
                {"  "}{`}`}{"\n"}
                {`}`}
              </pre>
            </div>
            <div style={{ padding: "var(--space-sm)", background: "#161e2d", display: "flex", gap: "var(--space-sm)", flexShrink: 0 }}>
              <button style={{ flex: 1, background: "var(--secondary)", color: "white", padding: "6px", borderRadius: "var(--radius-md)", border: "none", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Copy</button>
              <button style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: "white", padding: "6px", borderRadius: "var(--radius-md)", border: "none", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Validate</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
