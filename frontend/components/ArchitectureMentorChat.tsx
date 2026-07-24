"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  X,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

interface MentorChatProps {
  activeProvider: string | null;
  score: number | null;
}

const SUGGESTED_PROMPTS = [
  "How do I fix the single point of failure on RDS?",
  "Optimize this architecture for lower monthly cost",
  "Explain the generated Terraform VPC configuration",
  "How to enforce SOC2 compliance for S3 encryption?",
];

export default function ArchitectureMentorChat({
  activeProvider = "AWS",
  score,
}: MentorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hello! I am your Architecture Mentor powered by Gemma 4. I am analyzing your ${activeProvider || "cloud"} diagram. Ask me any design, security, or Terraform question!`,
      timestamp: "Just now",
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    // Simulate AI response
    setTimeout(() => {
      let replyText = `Based on your architecture review (${activeProvider}): To resolve single points of failure, convert single-instance DB nodes into Multi-AZ deployments and place compute workloads behind an Application Load Balancer in private subnets.`;
      if (query.toLowerCase().includes("cost")) {
        replyText = "To optimize cost: Consider utilizing AWS Spot Instances for worker nodes, enabling DynamoDB Auto-Scaling, and setting up S3 Lifecycle policies to transition older data to Glacier.";
      } else if (query.toLowerCase().includes("terraform")) {
        replyText = "In the generated Terraform code, we declare aws_vpc with a 10.0.0.0/16 CIDR block and map public subnets with Internet Gateway route tables for secure traffic routing.";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <>
      {/* ── Trigger Button ───────────────────────────────────────────── */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 60,
            padding: "12px 18px",
            background: "var(--marker)",
            color: "var(--navy-deep)",
            border: "none",
            borderRadius: "30px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "var(--glow-marker)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Bot size={18} />
          <span>Architecture Mentor</span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--navy-deep)",
            }}
          />
        </motion.button>
      )}

      {/* ── Chat Modal Window ────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              width: "380px",
              height: "520px",
              zIndex: 60,
              background: "var(--navy)",
              border: "1px solid var(--grid)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 16px",
                background: "var(--navy-deep)",
                borderBottom: "1px solid var(--grid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bot size={18} color="var(--marker)" />
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "var(--white-line)",
                      margin: 0,
                    }}
                  >
                    Architecture Mentor
                  </h4>
                  <span
                    style={{
                      fontSize: "0.625rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Gemma 4 Context-Aware Agent
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Feed */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                  }}
                >
                  {m.sender === "ai" && (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgba(232, 135, 30, 0.2)",
                        border: "1px solid var(--marker)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <Bot size={13} color="var(--marker)" />
                    </div>
                  )}

                  <div
                    style={{
                      background:
                        m.sender === "user"
                          ? "var(--marker)"
                          : "var(--navy-deep)",
                      color:
                        m.sender === "user"
                          ? "var(--navy-deep)"
                          : "var(--text-primary)",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.8125rem",
                      border:
                        m.sender === "user"
                          ? "none"
                          : "1px solid var(--grid)",
                      lineHeight: 1.5,
                      fontWeight: m.sender === "user" ? 600 : 400,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt Suggestions */}
            <div style={{ padding: "0 12px 8px", display: "flex", gap: "6px", overflowX: "auto" }}>
              {SUGGESTED_PROMPTS.slice(0, 2).map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  style={{
                    background: "rgba(29, 78, 122, 0.3)",
                    border: "1px solid var(--grid)",
                    borderRadius: "12px",
                    padding: "4px 10px",
                    fontSize: "0.6875rem",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  ⚡ {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                padding: "10px 12px",
                borderTop: "1px solid var(--grid)",
                background: "var(--navy-deep)",
                display: "flex",
                gap: "8px",
              }}
            >
              <input
                type="text"
                placeholder="Ask Architecture Mentor..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  flex: 1,
                  background: "var(--navy)",
                  border: "1px solid var(--grid)",
                  borderRadius: "var(--radius-sm)",
                  padding: "8px 12px",
                  fontSize: "0.8125rem",
                  color: "var(--white-line)",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "var(--marker)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "8px 12px",
                  color: "var(--navy-deep)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
