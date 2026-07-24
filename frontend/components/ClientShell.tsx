"use client";

import React from "react";
import TopNavBar from "@/components/TopNavBar";
import SideNavBar from "@/components/SideNavBar";

/* ── ClientShell ─────────────────────────────────────────────────────── */
/* Wraps every page with the shared TopNavBar, SideNavBar, and Footer.   */

const ClientShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <TopNavBar />
      <SideNavBar />

      {/* Main Content Area */}
      <main
        style={{
          marginLeft: "var(--sidebar-width)",
          marginTop: "var(--header-height)",
          minHeight: `calc(100dvh - var(--header-height) - var(--footer-height))`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "var(--footer-height)",
          background: "var(--surface-container)",
          borderTop: "1px solid var(--outline-variant)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--space-md)",
          zIndex: 50,
          fontSize: "11px",
          fontWeight: 700,
          color: "var(--on-surface-variant)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)" }}>
          <span>© 2024 CloudCanvas AI</span>
          <div style={{ display: "flex", gap: "var(--space-md)" }}>
            <a href="#" style={{ color: "var(--on-surface-variant)", textDecoration: "none", fontWeight: 400, fontSize: "12px" }}>
              Documentation
            </a>
            <a href="#" style={{ color: "var(--on-surface-variant)", textDecoration: "none", fontWeight: 400, fontSize: "12px" }}>
              Status
            </a>
            <a href="#" style={{ color: "var(--secondary)", textDecoration: "none", fontWeight: 600, fontSize: "12px" }}>
              Region
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ClientShell;
