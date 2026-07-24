"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Types ────────────────────────────────────────────────────────────── */

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/workbench", label: "My Architectures", icon: "architecture" },
  { href: "/knowledge", label: "Knowledge Base", icon: "database" },
  { href: "/", label: "Recent Scans", icon: "history" },
  { href: "/deploy", label: "Deploy & Validate", icon: "rocket_launch" },
];

/* ── Component ────────────────────────────────────────────────────────── */

const SideNavBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: "var(--header-height)",
        bottom: 0,
        width: "var(--sidebar-width)",
        background: "var(--surface-dim)",
        borderRight: "1px solid var(--outline-variant)",
        display: "flex",
        flexDirection: "column",
        padding: "var(--space-sm)",
        gap: "var(--space-xs)",
        zIndex: 40,
        overflowY: "auto",
      }}
    >
      {/* Section Header */}
      <div style={{ padding: "var(--space-md) var(--space-sm)" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "22px",
            color: "var(--on-surface)",
            margin: 0,
          }}
        >
          Navigation
        </h2>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--on-surface-variant)",
            opacity: 0.7,
            margin: "2px 0 0",
            letterSpacing: "0.02em",
          }}
        >
          Cloud Architecture Assistant
        </p>
      </div>

      {/* Nav Items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
                padding: "var(--space-sm)",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "var(--on-surface)" : "var(--on-surface-variant)",
                background: isActive ? "var(--surface-container-high)" : "transparent",
                borderLeft: isActive
                  ? "2px solid var(--primary-container)"
                  : "2px solid transparent",
                borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                transition: "all 0.15s ease",
                cursor: "pointer",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "20px",
                  color: isActive ? "var(--primary)" : "inherit",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* Upgrade to Pro */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-sm)",
            padding: "var(--space-sm)",
            fontSize: "12px",
            color: "var(--on-surface-variant)",
            cursor: "pointer",
            marginTop: "var(--space-md)",
            transition: "background 0.15s",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
            grade
          </span>
          Upgrade to Pro
        </div>
      </nav>

      {/* Create New Design Button */}
      <div style={{ marginTop: "auto", padding: "0 var(--space-sm) var(--space-lg)" }}>
        <Link
          href="/workbench"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-sm)",
            width: "100%",
            padding: "10px var(--space-md)",
            borderRadius: "var(--radius-lg)",
            background: "var(--primary-container)",
            color: "var(--on-primary-container)",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
            transition: "filter 0.15s ease",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
            add
          </span>
          Create New Design
        </Link>
      </div>
    </aside>
  );
};

export default SideNavBar;
