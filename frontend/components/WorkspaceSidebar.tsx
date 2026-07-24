"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layout,
  History,
  ShieldCheck,
  User,
  Compass,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import CloudBuddyLogo from "./CloudBuddyLogo";

interface SidebarProps {
  onOpenHistory?: () => void;
  onOpenCommandPalette?: () => void;
  onNewSession?: () => void;
}

export default function WorkspaceSidebar({
  onOpenHistory,
  onOpenCommandPalette,
  onNewSession,
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: "Workbench", href: "/workbench", icon: Layout },
    { label: "Knowledge Hub", href: "/knowledge", icon: Compass },
    { label: "Deployment", href: "/deploy", icon: ShieldCheck },
  ];

  const actionItems = [
    { label: "New Session", icon: PlusCircle, onClick: onNewSession },
    { label: "Session History", icon: History, onClick: onOpenHistory },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? "60px" : "220px",
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
        transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div
        style={{
          padding: isCollapsed ? "14px 8px" : "14px 16px",
          borderBottom: "1px solid var(--grid)",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          background: "var(--navy)",
          height: "52px",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <CloudBuddyLogo size={28} showText={false} />
          {!isCollapsed && (
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "var(--white-line)",
                margin: 0,
              }}
            >
              Cloud Buddy
            </h2>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "2px",
          }}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* ── Navigation List ───────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div>
          {!isCollapsed && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.625rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                marginBottom: "8px",
                paddingLeft: "8px",
              }}
            >
              Workspace
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                  <div
                    title={isCollapsed ? item.label : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      gap: "10px",
                      padding: "8px 10px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.8125rem",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--marker)" : "var(--text-secondary)",
                      background: isActive ? "rgba(232, 135, 30, 0.12)" : "transparent",
                      borderLeft: isActive ? "2px solid var(--marker)" : "2px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon size={16} color={isActive ? "var(--marker)" : "var(--text-muted)"} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Session Tools ───────────────────────────────────────────── */}
        <div>
          {!isCollapsed && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.625rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                marginBottom: "8px",
                paddingLeft: "8px",
              }}
            >
              Session
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {actionItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={item.onClick}
                  title={isCollapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    gap: "10px",
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8125rem",
                    fontWeight: 400,
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
                  {!isCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle DWG Stamp (Expanded mode) */}
        {!isCollapsed && (
          <div
            style={{
              marginTop: "auto",
              padding: "8px 10px",
              background: "transparent",
              borderTop: "1px solid rgba(29, 78, 122, 0.3)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              color: "var(--text-muted)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>DWG CB-2026</span>
            <span>REV 2.5</span>
          </div>
        )}
      </div>

      {/* ── Footer User Status ───────────────────────────────────────── */}
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid var(--grid)",
          background: "var(--navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "rgba(232, 135, 30, 0.15)",
            border: "1px solid var(--marker)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--marker)",
            flexShrink: 0,
          }}
        >
          <User size={12} />
        </div>
        {!isCollapsed && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Architect Studio
          </span>
        )}
      </div>
    </aside>
  );
}
