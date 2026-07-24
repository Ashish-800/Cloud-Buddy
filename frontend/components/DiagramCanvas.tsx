"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2,
  Loader2,
} from "lucide-react";
import mermaid from "mermaid";

/* ── Types ────────────────────────────────────────────────────────────── */

interface DiagramCanvasProps {
  /** Mermaid.js code to render. Null = empty/loading state. */
  mermaidCode: string | null;
  /** Show loading skeleton while waiting for diagram data. */
  isLoading?: boolean;
}

/* ── Mermaid Init ─────────────────────────────────────────────────────── */

let mermaidInitialized = false;

function initMermaid() {
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      darkMode: true,
      background: "#0f1424",
      primaryColor: "#6366f1",
      primaryBorderColor: "#818cf8",
      primaryTextColor: "#f1f5f9",
      secondaryColor: "#1a2138",
      secondaryBorderColor: "#4b5563",
      secondaryTextColor: "#94a3b8",
      tertiaryColor: "#151b2e",
      lineColor: "#6366f1",
      fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      fontSize: "14px",
      nodeBorder: "#818cf8",
      clusterBkg: "rgba(99, 102, 241, 0.08)",
      clusterBorder: "rgba(99, 102, 241, 0.25)",
      edgeLabelBackground: "#0f1424",
    },
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      padding: 16,
    },
    securityLevel: "loose",
  });
  mermaidInitialized = true;
}

/* ── Loading Skeleton ─────────────────────────────────────────────────── */

const DiagramSkeleton: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      padding: "60px 24px",
    }}
  >
    {/* Fake node structure */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      {[1, 2, 3].map((row) => (
        <div key={row} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {Array.from({ length: row === 2 ? 3 : 1 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: (row + i) * 0.15 }}
              style={{
                width: row === 2 ? 90 : 120,
                height: 40,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--glass-border)",
                background: "var(--bg-tertiary)",
              }}
            />
          ))}
        </div>
      ))}
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Loader2
        size={16}
        color="var(--accent-indigo-light)"
        style={{ animation: "spin 1s linear infinite" }}
      />
      <span
        style={{
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono), monospace",
        }}
      >
        Parsing diagram tokens…
      </span>
    </div>
  </div>
);

/* ── Component ────────────────────────────────────────────────────────── */

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ mermaidCode, isLoading = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const renderIdRef = useRef(0);

  /* ── Panning State ─────────────────────────────────────────────── */
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  /* ── Render Mermaid ────────────────────────────────────────────── */

  useEffect(() => {
    if (!mermaidCode) {
      setSvgContent(null);
      setRenderError(null);
      return;
    }

    initMermaid();
    renderIdRef.current += 1;
    const currentId = renderIdRef.current;

    const render = async () => {
      try {
        const id = `mermaid-diagram-${currentId}`;
        const { svg } = await mermaid.render(id, mermaidCode);
        // Only update if this is still the latest render
        if (renderIdRef.current === currentId) {
          setSvgContent(svg);
          setRenderError(null);
          // Reset viewport on new diagram
          setScale(1);
          setTranslate({ x: 0, y: 0 });
        }
      } catch (err: unknown) {
        if (renderIdRef.current === currentId) {
          setSvgContent(null);
          setRenderError(
            err instanceof Error ? err.message : "Failed to render diagram",
          );
        }
      }
    };

    render();
  }, [mermaidCode]);

  /* ── Controls ──────────────────────────────────────────────────── */

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.2, 3)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.2, 0.3)), []);
  const resetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setIsFullscreen((f) => !f);
  }, [isFullscreen]);

  /* ── Export as PNG ─────────────────────────────────────────────── */

  const exportPng = useCallback(() => {
    if (!svgContent) return;

    const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const padding = 40;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Dark background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "cloudbuddy-diagram.png";
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");

      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, [svgContent]);

  /* ── Pan Handlers ──────────────────────────────────────────────── */

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isPanning.current = true;
    panStart.current = { x: e.clientX - translate.x, y: e.clientY - translate.y };
  }, [translate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setTranslate({
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  /* ── Wheel Zoom ────────────────────────────────────────────────── */

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.min(Math.max(s + delta, 0.3), 3));
  }, []);

  /* ── Render ────────────────────────────────────────────────────── */

  if (isLoading) return <DiagramSkeleton />;

  if (!mermaidCode && !svgContent) {
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
            background: "rgba(99, 102, 241, 0.08)",
            border: "1px solid var(--glass-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Maximize2 size={20} color="var(--text-muted)" />
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
          Architecture diagram will appear here after analysis.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 400,
      }}
    >
      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "8px 12px",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        {[
          { icon: <ZoomIn size={15} />, label: "Zoom In", action: zoomIn },
          { icon: <ZoomOut size={15} />, label: "Zoom Out", action: zoomOut },
          { icon: <RotateCcw size={15} />, label: "Reset", action: resetView },
          { icon: <Download size={15} />, label: "Export PNG", action: exportPng },
          {
            icon: isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />,
            label: isFullscreen ? "Exit Fullscreen" : "Fullscreen",
            action: toggleFullscreen,
          },
        ].map((btn) => (
          <motion.button
            key={btn.label}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={btn.action}
            title={btn.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 10px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--glass-border)",
              background: "transparent",
              color: "var(--text-secondary)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-tertiary)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--glass-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--glass-border)";
            }}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </motion.button>
        ))}

        {/* Zoom level indicator */}
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.6875rem",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* ── Canvas Area ───────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          cursor: isPanning.current ? "grabbing" : "grab",
          background: "var(--bg-secondary)",
          borderRadius: "0 0 var(--radius-sm) var(--radius-sm)",
          position: "relative",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {renderError ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: "40px",
              gap: "12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(251, 113, 133, 0.08)",
                border: "1px solid rgba(251, 113, 133, 0.25)",
                fontSize: "0.8125rem",
                color: "var(--accent-rose)",
                maxWidth: 400,
                lineHeight: 1.6,
              }}
            >
              <strong>Diagram Render Error</strong>
              <br />
              {renderError}
            </div>
          </div>
        ) : svgContent ? (
          <div
            ref={svgContainerRef}
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transformOrigin: "center center",
              transition: isPanning.current ? "none" : "transform 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100%",
              padding: "32px",
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : null}
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DiagramCanvas;
