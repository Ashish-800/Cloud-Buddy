"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  FileCheck,
  X,
  Sparkles,
  Clipboard,
  Layers,
  CheckCircle2,
} from "lucide-react";

interface DraftingBoardProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  isStreaming: boolean;
}

const SAMPLE_SKETCHES = [
  {
    name: "3-Tier AWS Architecture",
    description: "ALB + EC2 Web Servers + RDS Multi-AZ + S3 Bucket",
    fileUrl: "/sample_basic.png",
  },
  {
    name: "ECS Microservices",
    description: "API Gateway + ECS Containers + DynamoDB + Redis Cache",
    fileUrl: "/sample_microservices.png",
  },
  {
    name: "Serverless Event Pipeline",
    description: "CloudFront + API Gateway + Lambda + SQS Queue + DynamoDB",
    fileUrl: "/sample_serverless.png",
  },
];

export default function DraftingBoard({
  onFileSelect,
  selectedFile,
  isStreaming,
}: DraftingBoardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate preview when file changes
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  // Handle Drag & Drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (isStreaming) return;

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [isStreaming, onFileSelect]
  );

  // Handle Clipboard Paste (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isStreaming) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            onFileSelect(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isStreaming, onFileSelect]);

  // Load sample sketch by creating a synthetic PNG file
  const handleLoadSample = (sampleName: string) => {
    if (isStreaming) return;
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw blueprint sample sketch on canvas
    ctx.fillStyle = "#0B2545";
    ctx.fillRect(0, 0, 800, 600);

    // Grid lines
    ctx.strokeStyle = "#1D4E7A";
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    for (let y = 0; y < 600; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    // Title stamp
    ctx.strokeStyle = "#EAF2FA";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 720, 520);

    ctx.font = "bold 22px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#E8871E";
    ctx.fillText(`SYSTEM ARCHITECTURE SKETCH: ${sampleName.toUpperCase()}`, 60, 80);

    // Draw boxes
    ctx.strokeStyle = "#EAF2FA";
    ctx.lineWidth = 2.5;
    ctx.fillStyle = "rgba(29, 78, 122, 0.4)";
    ctx.fillRect(100, 160, 160, 80);
    ctx.strokeRect(100, 160, 160, 80);

    ctx.fillRect(340, 160, 160, 80);
    ctx.strokeRect(340, 160, 160, 80);

    ctx.fillRect(580, 160, 160, 80);
    ctx.strokeRect(580, 160, 160, 80);

    ctx.fillRect(340, 360, 200, 100);
    ctx.strokeRect(340, 360, 200, 100);

    // Text labels
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#F2EFE6";
    ctx.fillText("ALB (Public)", 120, 205);
    ctx.fillText("EC2 Cluster", 360, 205);
    ctx.fillText("S3 Storage", 600, 205);
    ctx.fillText("RDS Multi-AZ DB", 360, 415);

    // Arrows
    ctx.strokeStyle = "#E8871E";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(260, 200);
    ctx.lineTo(340, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(500, 200);
    ctx.lineTo(580, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(420, 240);
    ctx.lineTo(420, 360);
    ctx.stroke();

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${sampleName.toLowerCase().replace(/\s+/g, "_")}.png`, {
          type: "image/png",
        });
        onFileSelect(file);
      }
    });
  };

  return (
    <div
      style={{
        background: "var(--navy)",
        border: "1px solid var(--grid)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Drafting Header ───────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--white-line)",
              margin: 0,
            }}
          >
            Drafting Board & Sketch Ingestion
          </h3>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Upload hand-drawn architecture, whiteboard photos, or digital diagrams
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            color: "var(--text-muted)",
          }}
        >
          <Clipboard size={12} color="var(--marker)" />
          <span>Paste Clipboard (Ctrl+V) Supported</span>
        </div>
      </div>

      {/* ── CAD Interactive Dropzone ──────────────────────────────────── */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: "relative",
          minHeight: "220px",
          background: isDragOver
            ? "rgba(232, 135, 30, 0.08)"
            : "rgba(8, 27, 54, 0.7)",
          border: `2px dashed ${isDragOver ? "var(--marker)" : "var(--grid)"}`,
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
          transition: "all 0.2s ease",
          cursor: isStreaming ? "not-allowed" : "pointer",
        }}
      >
        {/* Four CAD Corner Crosshairs */}
        <span style={{ position: "absolute", top: 8, left: 10, fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--grid)", opacity: 0.8 }}>+</span>
        <span style={{ position: "absolute", top: 8, right: 10, fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--grid)", opacity: 0.8 }}>+</span>
        <span style={{ position: "absolute", bottom: 8, left: 10, fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--grid)", opacity: 0.8 }}>+</span>
        <span style={{ position: "absolute", bottom: 8, right: 10, fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--grid)", opacity: 0.8 }}>+</span>

        {/* Laser Scanning Grid Animation during SSE stream */}
        {isStreaming && (
          <motion.div
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background: "var(--marker)",
              boxShadow: "0 0 15px var(--marker), 0 0 30px var(--marker)",
              zIndex: 10,
            }}
          />
        )}

        {previewUrl ? (
          /* File Preview Display */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              width: "100%",
            }}
          >
            <div
              style={{
                position: "relative",
                maxHeight: "160px",
                maxWidth: "280px",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
                border: "1px solid var(--grid)",
                background: "var(--navy-deep)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selected architecture sketch"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--white-line)",
              }}
            >
              <FileCheck size={16} color="var(--accent-emerald)" />
              <span>{selectedFile?.name}</span>
              <span style={{ color: "var(--text-muted)" }}>
                ({((selectedFile?.size || 0) / 1024).toFixed(0)} KB)
              </span>

              {!isStreaming && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileSelect(null as any);
                  }}
                  style={{
                    background: "rgba(232, 90, 90, 0.15)",
                    border: "1px solid var(--accent-rose)",
                    color: "var(--accent-rose)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginLeft: "8px",
                  }}
                >
                  <X size={12} /> Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Empty Drag & Drop Ingestion State */
          <>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isStreaming}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />

            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(232, 135, 30, 0.12)",
                border: "1px solid var(--marker)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
                color: "var(--marker)",
              }}
            >
              <Upload size={22} />
            </div>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--white-line)",
                margin: "0 0 4px",
              }}
            >
              Drag & Drop Sketch or <span style={{ color: "var(--marker)", textDecoration: "underline" }}>Browse File</span>
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                margin: 0,
                maxWidth: "340px",
              }}
            >
              Supports PNG, JPEG, WebP up to 10MB · Whiteboard drawings or CAD exports
            </p>
          </>
        )}
      </div>

      {/* ── Sample Architectures Strip ────────────────────────────────── */}
      <div style={{ marginTop: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            color: "var(--text-muted)",
            marginBottom: "8px",
          }}
        >
          <Layers size={13} color="var(--marker)" />
          <span>Quick Sample Preset Sketches:</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
          }}
        >
          {SAMPLE_SKETCHES.map((sample, i) => (
            <button
              key={i}
              type="button"
              disabled={isStreaming}
              onClick={() => handleLoadSample(sample.name)}
              style={{
                padding: "8px 12px",
                background: "rgba(8, 27, 54, 0.6)",
                border: "1px solid var(--grid)",
                borderRadius: "var(--radius-sm)",
                textAlign: "left",
                cursor: isStreaming ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isStreaming) {
                  e.currentTarget.style.borderColor = "var(--marker)";
                  e.currentTarget.style.background = "rgba(232, 135, 30, 0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isStreaming) {
                  e.currentTarget.style.borderColor = "var(--grid)";
                  e.currentTarget.style.background = "rgba(8, 27, 54, 0.6)";
                }
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--white-line)",
                  margin: "0 0 2px",
                }}
              >
                {sample.name}
              </div>
              <div
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {sample.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
