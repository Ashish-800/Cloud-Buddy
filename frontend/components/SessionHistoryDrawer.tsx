"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, X, Calendar, Layers, ShieldCheck, ChevronRight } from "lucide-react";

interface Session {
  id: string;
  title: string;
  provider: string;
  score: number;
  date: string;
}

interface SessionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession?: (sessionId: string) => void;
}

const MOCK_SESSIONS: Session[] = [
  {
    id: "sess_1",
    title: "E-Commerce 3-Tier Production",
    provider: "AWS",
    score: 84,
    date: "Today, 14:20",
  },
  {
    id: "sess_2",
    title: "Microservices Event Driven Pipeline",
    provider: "AWS",
    score: 68,
    date: "Yesterday, 18:45",
  },
  {
    id: "sess_3",
    title: "GCP Multi-Region Kubernetes",
    provider: "GCP",
    score: 92,
    date: "Jul 22, 2026",
  },
];

export default function SessionHistoryDrawer({
  isOpen,
  onClose,
  onSelectSession,
}: SessionHistoryDrawerProps) {
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
            zIndex: 90,
            background: "rgba(8, 27, 54, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "100vh",
              background: "var(--navy-deep)",
              borderLeft: "1px solid var(--grid)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid var(--grid)",
                background: "var(--navy)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <History size={18} color="var(--marker)" />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--white-line)",
                    margin: 0,
                  }}
                >
                  Session History
                </h3>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Session Timeline Feed */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {MOCK_SESSIONS.map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => {
                    if (onSelectSession) onSelectSession(sess.id);
                    onClose();
                  }}
                  style={{
                    padding: "14px",
                    background: "var(--navy)",
                    border: "1px solid var(--grid)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--marker)";
                    e.currentTarget.style.background = "rgba(232, 135, 30, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--grid)";
                    e.currentTarget.style.background = "var(--navy)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "var(--white-line)",
                      }}
                    >
                      {sess.title}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color:
                          sess.score >= 80
                            ? "var(--accent-emerald)"
                            : "var(--marker)",
                      }}
                    >
                      {sess.score}/100
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.6875rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>Provider: {sess.provider}</span>
                    <span>{sess.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
