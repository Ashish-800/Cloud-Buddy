"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileImage } from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────────── */

interface UploadDropzoneProps {
  /** Called with the selected image File (or null on clear). */
  onFileSelect: (file: File | null) => void;
  /** Currently selected file (controlled). */
  selectedFile: File | null;
  /** Disable interaction during analysis. */
  disabled?: boolean;
}

/* ── Component ────────────────────────────────────────────────────────── */

const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileSelect,
  selectedFile,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Helpers ──────────────────────────────────────────────────────── */

  const processFile = useCallback(
    (file: File) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return; // silently reject unsupported types
      }
      onFileSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    },
    [onFileSelect]
  );

  const clearFile = useCallback(() => {
    onFileSelect(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onFileSelect, previewUrl]);

  /* ── Drag Handlers ───────────────────────────────────────────────── */

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [disabled, processFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  /* ── Format file size ────────────────────────────────────────────── */

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /* ── Render ──────────────────────────────────────────────────────── */

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        style={{ display: "none" }}
        aria-label="Upload architecture sketch"
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          /* ── Empty State: Drop Zone ────────────────────────────── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className={`dropzone ${isDragOver ? "dropzone--active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            style={{
              padding: "48px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              opacity: disabled ? 0.5 : 1,
              pointerEvents: disabled ? "none" : "auto",
            }}
          >
            <motion.div
              animate={isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: "var(--radius-lg)",
                background: "rgba(255, 153, 0, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Upload
                size={24}
                color={isDragOver ? "var(--primary-container)" : "var(--on-surface-variant)"}
              />
            </motion.div>

            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--on-surface)",
                  margin: "0 0 4px",
                }}
              >
                Drop your architecture sketch here
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--on-surface-variant)",
                  margin: 0,
                }}
              >
                or click to browse · JPEG, PNG, WebP up to 10 MB
              </p>
            </div>
          </motion.div>
        ) : (
          /* ── Preview State ─────────────────────────────────────── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="card"
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Image Preview */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                background: "var(--surface-container-low)",
              }}
            >
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Architecture sketch preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              )}

              {/* Clear button */}
              {!disabled && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                  }}
                  aria-label="Remove image"
                >
                  <X size={14} />
                </motion.button>
              )}
            </div>

            {/* File Info Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-container-low)",
              }}
            >
              <FileImage size={16} color="var(--primary-container)" />
              <span
                style={{
                  flex: 1,
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--on-surface)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedFile.name}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--on-surface-variant)",
                  fontFamily: "'JetBrains Mono', monospace",
                  flexShrink: 0,
                }}
              >
                {formatSize(selectedFile.size)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadDropzone;
