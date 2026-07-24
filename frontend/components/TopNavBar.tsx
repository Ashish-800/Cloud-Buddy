"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Component ────────────────────────────────────────────────────────── */

const TopNavBar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Services" },
    { href: "/workbench", label: "Projects" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "var(--header-height)",
        backgroundColor: "var(--aws-header)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--space-md)",
        userSelect: "none",
      }}
    >
      {/* Left: Brand + Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Link
          href="/"
          style={{
            fontFamily: "'Work Sans', sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--primary-fixed-dim)",
            textDecoration: "none",
          }}
        >
          CloudCanvas
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-md)",
            marginLeft: "var(--space-lg)",
          }}
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? "var(--primary-fixed-dim)" : "var(--surface-container-low)",
                  textDecoration: "none",
                  padding: "4px 8px",
                  borderBottom: isActive ? "2px solid var(--primary-fixed-dim)" : "2px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar */}
        <div style={{ position: "relative", marginLeft: "var(--space-lg)", width: "384px" }}>
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              color: "var(--on-surface-variant)",
              opacity: 0.6,
            }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search for architectures, scans, or documentation"
            style={{
              width: "100%",
              height: "32px",
              paddingLeft: "32px",
              paddingRight: "12px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "white",
              fontSize: "12px",
              fontFamily: "'Work Sans', sans-serif",
              color: "var(--on-surface)",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <button
          style={{
            background: "transparent",
            border: "none",
            padding: "4px",
            cursor: "pointer",
            borderRadius: "var(--radius-md)",
            transition: "background 0.15s",
          }}
          title="Notifications"
        >
          <span className="material-symbols-outlined" style={{ color: "white", fontSize: "20px" }}>
            notifications
          </span>
        </button>
        <button
          style={{
            background: "transparent",
            border: "none",
            padding: "4px",
            cursor: "pointer",
            borderRadius: "var(--radius-md)",
          }}
          title="Help"
        >
          <span className="material-symbols-outlined" style={{ color: "white", fontSize: "20px" }}>
            help
          </span>
        </button>
        <button
          style={{
            background: "transparent",
            border: "none",
            padding: "4px",
            cursor: "pointer",
            borderRadius: "var(--radius-md)",
          }}
          title="Settings"
        >
          <span className="material-symbols-outlined" style={{ color: "white", fontSize: "20px" }}>
            settings
          </span>
        </button>

        {/* Avatar */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "var(--secondary-container)",
            marginLeft: "var(--space-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "white", fontSize: "18px" }}
          >
            person
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
