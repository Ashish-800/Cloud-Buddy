"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  FileCode,
  ShieldCheck,
  History,
  Layers,
  Settings,
  X,
  Command,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
}

const COMMANDS = [
  { id: "analyze", label: "Analyze Current Architecture Sketch", icon: Sparkles, category: "Analysis" },
  { id: "export_tf", label: "Export Generated Terraform (.tf) Bundle", icon: FileCode, category: "Infrastructure" },
  { id: "compliance", label: "Run SOC2 / Security Policy Audit", icon: ShieldCheck, category: "Security" },
  { id: "history", label: "View Architecture Session History", icon: History, category: "Sessions" },
  { id: "aws", label: "Switch Target Cloud Provider to AWS", icon: Layers, category: "Provider" },
  { id: "gcp", label: "Switch Target Cloud Provider to GCP", icon: Layers, category: "Provider" },
  { id: "azure", label: "Switch Target Cloud Provider to Azure", icon: Layers, category: "Provider" },
];

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectAction,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered via parent handler if passed
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            background: "rgba(8, 27, 54, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "120px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "var(--navy-deep)",
              border: "1px solid var(--grid)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            {/* Search Input Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                borderBottom: "1px solid var(--grid)",
                background: "var(--navy)",
              }}
            >
              <Search size={18} color="var(--marker)" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search action (e.g. 'Terraform', 'AWS')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9375rem",
                  color: "var(--white-line)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.625rem",
                  color: "var(--text-muted)",
                  padding: "2px 6px",
                  background: "rgba(29, 78, 122, 0.4)",
                  border: "1px solid var(--grid)",
                  borderRadius: "4px",
                }}
              >
                ESC to exit
              </span>
            </div>

            {/* Command Items List */}
            <div
              style={{
                maxHeight: "320px",
                overflowY: "auto",
                padding: "8px",
              }}
            >
              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.8125rem",
                  }}
                >
                  No matching commands found.
                </div>
              ) : (
                filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectAction(item.id);
                        onClose();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(232, 135, 30, 0.12)";
                        e.currentTarget.style.color = "var(--marker)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }}
                    >
                      <Icon size={16} color="var(--marker)" />
                      <span style={{ flex: 1, fontSize: "0.8125rem", fontWeight: 500 }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.625rem",
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
