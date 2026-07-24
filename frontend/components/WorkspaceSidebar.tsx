"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Layout,
  FolderGit2,
  History,
  ShieldCheck,
  FileCode,
  Download,
  Settings,
  Sparkles,
  User,
  Sliders,
  Compass,
} from "lucide-react";
import CloudBuddyLogo from "./CloudBuddyLogo";

interface SidebarProps {
  onOpenHistory?: () => void;
  onOpenCommandPalette?: () => void;
}

export default function WorkspaceSidebar({
  onOpenHistory,
  onOpenCommandPalette,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Workbench", href: "/workbench", icon: Layout },
    { label: "Knowledge Hub", href: "/knowledge", icon: Compass },
    { label: "Deployment & Validation", href: "/deploy", icon: ShieldCheck },
  ];

  const actionItems = [
    { label: "Session History", icon: History, onClick: onOpenHistory },
    { label: "Command Palette (Ctrl+K)", icon: Sliders, onClick: onOpenCommandPalette },
  ];

  return (
    <aside
      style={{
        width: "240px",
        background: "var(--navy-deep)",
        borderRight: "1px solid var(--grid)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 40,
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* ── Brand Stamp Header ────────────────────────────────────────── */}
      <div
        style={{
          padding: "18px 16px",
          borderBottom: "1px solid var(--grid)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "var(--navy)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <CloudBuddyLogo size={36} showText={false} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "var(--white-line)",
              margin: 0,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Cloud Buddy
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              color: "var(--marker)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Drafting Studio
          </span>
        </div>
      </div>

      {/* ── Navigation Section ────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              marginBottom: "8px",
              paddingLeft: "8px",
            }}
          >
            Primary Workspace
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.8125rem",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "var(--marker)" : "var(--text-secondary)",
                      background: isActive ? "rgba(232, 135, 30, 0.12)" : "transparent",
                      borderLeft: isActive ? "2px solid var(--marker)" : "2px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon size={16} color={isActive ? "var(--marker)" : "var(--text-muted)"} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Quick Tools Section ──────────────────────────────────────── */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              marginBottom: "8px",
              paddingLeft: "8px",
            }}
          >
            Engineering Tools
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {actionItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={item.onClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(29, 78, 122, 0.3)";
                    e.currentTarget.style.color = "var(--white-line)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  <Icon size={16} color="var(--text-muted)" />
                  <span style={{ flex: 1 }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── System Blueprint Stamp Card ─────────────────────────────── */}
        <div
          style={{
            marginTop: "auto",
            padding: "12px",
            background: "rgba(11, 37, 69, 0.6)",
            border: "1px solid var(--grid)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            color: "var(--text-secondary)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
              color: "var(--marker)",
              fontWeight: 700,
            }}
          >
            <span>DWG: CB-2026</span>
            <span>REV 2.4</span>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.625rem" }}>
            Gemma 4 Multimodal Engine
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.625rem" }}>
            AWS · GCP · Azure CAD Engine
          </div>
        </div>
      </div>

      {/* ── User Profile Drawer Footer ───────────────────────────────── */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid var(--grid)",
          background: "var(--navy)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(232, 135, 30, 0.2)",
            border: "1px solid var(--marker)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--marker)",
          }}
        >
          <User size={14} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--white-line)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Architect Workspace
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              color: "var(--text-muted)",
            }}
          >
            Connected to Supabase
          </div>
        </div>
      </div>
    </aside>
  );
}
