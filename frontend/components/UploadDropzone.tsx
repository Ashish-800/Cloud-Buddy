"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, FileText } from "lucide-react";

interface UploadDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export default function UploadDropzone({
  onFileSelect,
  selectedFile,
  disabled = false,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file (PNG, JPEG, WebP).");
        return;
      }
      onFileSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    [onFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ width: "100%" }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        accept="image/png,image/jpeg,image/webp"
        style={{ display: "none" }}
        disabled={disabled}
      />

      <AnimatePresence mode="wait">
        {selectedFile && previewUrl ? (
          /* ── Image Preview View ─────────────────────────────────────── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "relative",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              background: "rgba(15, 23, 42, 0.6)",
              overflow: "hidden",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)",
            }}
          >
            {/* Image Preview */}
            <div
              style={{
                width: "100%",
                height: 180,
                position: "relative",
                background: "#050811",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Architecture sketch preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />

              {/* Remove button */}
              {!disabled && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRemove}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(15, 23, 42, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={14} />
                </motion.button>
              )}
            </div>

            {/* Meta info bar */}
            <div
              style={{
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(30, 41, 59, 0.4)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "#f8fafc",
                    maxWidth: 180,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFile.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  color: "#64748b",
                }}
              >
                {formatFileSize(selectedFile.size)}
              </span>
            </div>
          </motion.div>
        ) : (
          /* ── Interactive Dropzone View ──────────────────────────────── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`dropzone ${isDragging ? "dropzone--active" : ""}`}
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              padding: "32px 20px",
              textAlign: "center",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              transition={{ duration: 0.2 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <UploadCloud size={24} color="#818cf8" />
            </motion.div>

            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#f8fafc",
                margin: "0 0 4px",
              }}
            >
              Drag & drop architecture sketch
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                margin: 0,
              }}
            >
              or <span style={{ color: "#818cf8", textDecoration: "underline" }}>browse file</span> (PNG, JPEG, WebP)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
