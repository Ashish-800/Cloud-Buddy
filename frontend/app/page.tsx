"use client";

import React from "react";
import Link from "next/link";

/* ── Console Scan Page (Home) ────────────────────────────────────────── */
/* Matches Stitch Screen 1: Upload zone + Student Critique Lab + Recent Scans */

export default function ConsoleScanPage() {
  return (
    <div style={{ padding: "0 0 var(--footer-height)" }}>
      {/* Breadcrumbs */}
      <div
        style={{
          padding: "var(--space-sm) var(--space-lg)",
          borderBottom: "1px solid var(--aws-border-color)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
        }}
      >
        <a href="#" style={{ color: "var(--secondary)", textDecoration: "none" }}>CloudCanvas</a>
        <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--on-surface-variant)" }}>chevron_right</span>
        <a href="#" style={{ color: "var(--secondary)", textDecoration: "none" }}>Scans</a>
        <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--on-surface-variant)" }}>chevron_right</span>
        <span style={{ color: "var(--on-surface)" }}>Initialize New Scan</span>
      </div>

      {/* Page Content */}
      <div style={{ padding: "var(--space-lg)", maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
        {/* Page Header */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 600, lineHeight: "32px", letterSpacing: "-0.01em", margin: "0 0 4px" }}>
            Initialize New Scan
          </h1>
          <p style={{ fontSize: "14px", color: "var(--on-surface-variant)", margin: 0 }}>
            Convert your whiteboard diagrams into AWS CloudFormation templates in seconds.
          </p>
        </div>

        {/* Grid Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "var(--space-lg)" }}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Upload Dropzone */}
            <Link
              href="/workbench"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="card"
                style={{
                  padding: "var(--space-xl) var(--space-lg)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "400px",
                  borderStyle: "dashed",
                  borderWidth: "2px",
                  borderColor: "var(--outline-variant)",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--surface-container-low)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>
                    add_a_photo
                  </span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                  Drop Whiteboard Photo
                </h3>
                <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", textAlign: "center", maxWidth: "360px", marginBottom: "var(--space-lg)" }}>
                  Support for JPG, PNG, and HEIC. Ensure lighting is clear and all component icons are visible.
                </p>
                <div style={{ display: "flex", gap: "var(--space-md)" }}>
                  <span className="btn-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>upload_file</span>
                    Choose Files
                  </span>
                  <span className="btn-secondary">
                    Take Photo
                  </span>
                </div>
              </div>
            </Link>

            {/* Student Critique Lab */}
            <section
              style={{
                background: "var(--surface-container-low)",
                border: "1px solid var(--aws-border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-lg)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--tertiary)" }}>school</span>
                  <h2 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>Student Critique Lab</h2>
                </div>
                <span className="tag tag--info" style={{ fontSize: "10px" }}>Learning Mode</span>
              </div>

              <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", marginBottom: "var(--space-lg)" }}>
                Practice identifying misconfigurations in provided whiteboard scenarios. Earn cloud architect credits.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                {/* Scenario 1 */}
                <div className="card" style={{ padding: "var(--space-sm)", cursor: "pointer" }}>
                  <div
                    style={{
                      height: "128px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-container-high)",
                      marginBottom: "var(--space-sm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--outline)" }}>draw</span>
                  </div>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Scenario: The Single-Region Trap</h4>
                  <p style={{ fontSize: "11px", color: "var(--on-surface-variant)", margin: 0 }}>Identify 3 critical availability flaws.</p>
                </div>

                {/* Scenario 2 */}
                <div className="card" style={{ padding: "var(--space-sm)", cursor: "pointer" }}>
                  <div
                    style={{
                      height: "128px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-container-high)",
                      marginBottom: "var(--space-sm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--outline)" }}>security</span>
                  </div>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Scenario: Over-Privileged Lambda</h4>
                  <p style={{ fontSize: "11px", color: "var(--on-surface-variant)", margin: 0 }}>Find the security group overlap.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Recent Scans */}
          <div className="card" style={{ height: "fit-content", overflow: "hidden" }}>
            <div
              style={{
                background: "var(--surface-container)",
                padding: "var(--space-sm) var(--space-md)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>Recent Scans</h3>
              <button style={{ color: "var(--secondary)", fontSize: "11px", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                View All
              </button>
            </div>

            {/* Scan Items */}
            {[
              { name: "E-Commerce Backend", tags: ["VPC", "RDS"], status: "Terraform Ready", statusIcon: "check_circle", statusColor: "#22c55e", time: "2h ago" },
              { name: "Serverless Pipeline", tags: ["Lambda"], status: "Manual Review Required", statusIcon: "pending", statusColor: "#f59e0b", time: "Yesterday" },
              { name: "Transit Hub V2", tags: ["Direct Connect"], status: "OCR Failed (Low Light)", statusIcon: "error", statusColor: "var(--error)", time: "3 days ago" },
            ].map((scan, i) => (
              <div
                key={i}
                style={{
                  padding: "var(--space-md)",
                  borderTop: i > 0 ? "1px solid var(--outline-variant)" : undefined,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "start", gap: "var(--space-md)" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-container-high)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "var(--outline)" }}>
                      description
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <h4 style={{ fontSize: "13px", fontWeight: 700, margin: 0 }}>{scan.name}</h4>
                      <span style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}>{scan.time}</span>
                    </div>
                    <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                      {scan.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            background: "var(--on-secondary-container)",
                            color: "white",
                            padding: "1px 6px",
                            borderRadius: "var(--radius-md)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--on-surface-variant)", margin: "8px 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "12px", color: scan.statusColor }}>
                        {scan.statusIcon}
                      </span>
                      {scan.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
