"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, FileText, X, Plus } from "lucide-react";

interface ComplianceUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export default function ComplianceUploader({
  onFileSelect,
  selectedFile,
  disabled = false,
}: ComplianceUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.txt,.md"
        style={{ display: "none" }}
        disabled={disabled}
      />

      <AnimatePresence mode="wait">
        {selectedFile ? (
          /* ── Attached Compliance File ──────────────────────────────── */
          <motion.div
            key="file-attached"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldCheck size={18} color="#10b981" />
              <div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#f8fafc",
                    margin: 0,
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFile.name}
                </p>
                <p
                  style={{
                    fontSize: "0.6875rem",
                    color: "#10b981",
                    margin: 0,
                  }}
                >
                  Compliance Policy Loaded into Gemma Context
                </p>
              </div>
            </div>

            {!disabled && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                }}
              >
                <X size={14} />
              </motion.button>
            )}
          </motion.div>
        ) : (
          /* ── Optional Upload Prompt ───────────────────────────────── */
          <motion.div
            key="upload-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !disabled && fileInputRef.current?.click()}
            whileHover={!disabled ? { borderColor: "rgba(99, 102, 241, 0.4)" } : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: "rgba(15, 23, 42, 0.4)",
              border: "1px dashed rgba(255, 255, 255, 0.1)",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
              transition: "border-color 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldCheck size={16} color="#64748b" />
              <div>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "#cbd5e1",
                  }}
                >
                  Attach Security Policy
                </span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "#64748b",
                    marginLeft: 6,
                  }}
                >
                  (Optional · PDF / TXT)
                </span>
              </div>
            </div>

            <Plus size={16} color="#64748b" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
