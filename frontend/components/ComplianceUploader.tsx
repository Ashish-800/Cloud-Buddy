"use client";

import React, { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, ShieldCheck } from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────────── */

interface ComplianceUploaderProps {
  /** Called with the selected compliance File (or null on clear). */
  onFileSelect: (file: File | null) => void;
  /** Currently selected file (controlled). */
  selectedFile: File | null;
  /** Disable interaction during analysis. */
  disabled?: boolean;
}

/* ── Component ────────────────────────────────────────────────────────── */

const ComplianceUploader: React.FC<ComplianceUploaderProps> = ({
  onFileSelect,
  selectedFile,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const clearFile = useCallback(() => {
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onFileSelect]);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        onChange={handleChange}
        style={{ display: "none" }}
        aria-label="Upload compliance document"
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          /* ── Empty State ──────────────────────────────────────── */
          <motion.button
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !disabled && inputRef.current?.click()}
            disabled={disabled}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px dashed var(--outline-variant)",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
              transition: "border-color 0.25s ease",
              color: "var(--on-surface-variant)",
            }}
            onMouseEnter={(e) => {
              if (!disabled)
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--primary-container)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--outline-variant)";
            }}
          >
            <ShieldCheck size={16} color="var(--on-surface-variant)" />
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 500,
              }}
            >
              Attach compliance / security policy
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                color: "var(--on-surface-variant)",
                marginLeft: "auto",
              }}
            >
              Optional · PDF / TXT
            </span>
          </motion.button>
        ) : (
          /* ── File Selected State ──────────────────────────────── */
          <motion.div
            key="file"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              background: "rgba(34, 197, 94, 0.06)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FileText size={16} color="#22c55e" />

            <span
              style={{
                flex: 1,
                fontSize: "0.8125rem",
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
                fontSize: "0.75rem",
                color: "var(--on-surface-variant)",
                fontFamily: "var(--font-mono), monospace",
                flexShrink: 0,
              }}
            >
              {formatSize(selectedFile.size)}
            </span>

            {!disabled && (
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(186, 26, 26, 0.1)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--error)",
                  flexShrink: 0,
                }}
                aria-label="Remove compliance document"
              >
                <X size={12} />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplianceUploader;
