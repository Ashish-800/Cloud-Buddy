"use client";

import React from "react";

/* ── Deploy & Validate Page ──────────────────────────────────────────── */
/* Matches Stitch Screen 3: Deployment strategy with validation checks  */

export default function DeployValidatePage() {
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
        <span style={{ color: "var(--on-surface-variant)" }}>Projects</span>
        <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--on-surface-variant)" }}>chevron_right</span>
        <span style={{ color: "var(--on-surface-variant)" }}>US-East-1 Production</span>
        <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--on-surface-variant)" }}>chevron_right</span>
        <span style={{ color: "var(--on-surface)" }}>Deployment & Validation</span>
      </div>

      <div style={{ padding: "var(--space-lg)", maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "var(--space-lg)" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 600, lineHeight: "32px", margin: "0 0 4px" }}>
              Deployment Strategy: Canary
            </h1>
            <p style={{ fontSize: "14px", color: "var(--on-surface-variant)", margin: 0 }}>
              Validating Terraform plans against visual architecture and security policies.
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            <button className="btn-secondary">Cancel Plan</button>
            <button className="btn-primary">Provision Infrastructure</button>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
          {/* Validation Status */}
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "var(--space-md)" }}>Validation Status</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {/* Passed */}
              <div className="card" style={{ padding: "var(--space-md)", display: "flex", alignItems: "start", gap: "var(--space-md)" }}>
                <span className="material-symbols-outlined" style={{ color: "#22c55e", fontSize: "24px" }}>check_circle</span>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Network Connectivity</h4>
                  <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", margin: "0 0 8px" }}>
                    VPC Peering and Subnet routes validated. All routes resolve to active gateways.
                  </p>
                  <span className="tag tag--passed">PASSED</span>
                </div>
              </div>

              {/* Critical */}
              <div className="card" style={{ padding: "var(--space-md)", display: "flex", alignItems: "start", gap: "var(--space-md)" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--error)", fontSize: "24px" }}>error</span>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>IAM Policy Conflict</h4>
                  <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", margin: "0 0 8px" }}>
                    Overlapping permissions detected in &apos;all-read-access&apos; and &apos;global-admin&apos; roles.
                  </p>
                  <span className="tag tag--critical">CRITICAL</span>
                </div>
              </div>

              {/* Warning */}
              <div className="card" style={{ padding: "var(--space-md)", display: "flex", alignItems: "start", gap: "var(--space-md)" }}>
                <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "24px" }}>warning</span>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Cost Threshold</h4>
                  <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", margin: "0 0 8px" }}>
                    Current plan exceeds monthly budget by &dollar;156. Consider spot instances for worker nodes.
                  </p>
                  <span className="tag tag--warning">WARNING</span>
                </div>
              </div>
            </div>
          </div>

          {/* Architectural Visual Diff */}
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "var(--space-md)" }}>Architectural Visual Diff</h2>
            <div className="card" style={{ overflow: "hidden" }}>
              <div
                style={{
                  height: "200px",
                  background: "linear-gradient(135deg, var(--surface-container-high), var(--surface-container))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", top: "var(--space-sm)", left: "var(--space-sm)", fontSize: "10px", fontWeight: 700, color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  A/B Infrastructure Diagram: E-Commerce App
                </div>
                <div style={{ display: "flex", gap: "var(--space-xl)", alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--outline)" }}>draw</span>
                    <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--on-surface-variant)", marginTop: "4px" }}>Sketch Concept</p>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "var(--primary-container)" }}>compare_arrows</span>
                  <div style={{ textAlign: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--primary)" }}>cloud_done</span>
                    <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--on-surface-variant)", marginTop: "4px" }}>Provisioned Infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terraform Plan Output */}
        <div className="card" style={{ overflow: "hidden", marginBottom: "var(--space-lg)" }}>
          <div style={{ padding: "var(--space-sm) var(--space-md)", background: "var(--surface-container)", borderBottom: "1px solid var(--aws-border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "var(--on-surface-variant)" }}>terraform_plan_1a9_v3</span>
          </div>
          <div
            className="code-block"
            style={{
              padding: "var(--space-md)",
              background: "#1e2631",
              color: "#d3e4fe",
              maxHeight: "200px",
              overflow: "auto",
            }}
          >
            <pre style={{ margin: 0, fontSize: "12px", lineHeight: "20px" }}>
{`# terraform plan -out=tfplan
Plan: 32 to add, 0 to change, 0 to destroy.

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
}`}
            </pre>
          </div>
        </div>

        {/* Metadata Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-md)" }}>
          {[
            { icon: "location_on", color: "#22c55e", label: "Region", value: "us-east-1 (N. Virginia)" },
            { icon: "settings", color: "var(--on-surface-variant)", label: "Execution Mode", value: "Remote (Terraform Cloud)" },
            { icon: "policy", color: "var(--on-surface-variant)", label: "Validation Engine", value: "OPA Policy / Checkov" },
            { icon: "schedule", color: "var(--on-surface-variant)", label: "Estimated Time", value: "~14 Minutes" },
          ].map((meta, i) => (
            <div key={i} className="card" style={{ padding: "var(--space-md)", textAlign: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: meta.color, marginBottom: "8px", display: "block" }}>{meta.icon}</span>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 4px" }}>{meta.label}</p>
              <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>{meta.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
