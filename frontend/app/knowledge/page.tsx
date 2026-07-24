"use client";

import React, { useState } from "react";

/* ── Knowledge Hub Page ──────────────────────────────────────────────── */
/* Matches Stitch Screen 4: Educational reference with docs, code, tables */

const TOPICS = [
  { id: "vpc", label: "VPC Architecture & Subnets", category: "Networking", icon: "cloud" },
  { id: "sg", label: "Security Groups", category: "Networking", icon: "shield" },
  { id: "elb", label: "Load Balancers", category: "Networking", icon: "dns" },
  { id: "ec2", label: "EC2 Instance Types", category: "Compute", icon: "memory" },
  { id: "lambda", label: "Lambda Functions", category: "Compute", icon: "bolt" },
  { id: "s3", label: "S3 Storage", category: "Storage", icon: "storage" },
  { id: "rds", label: "RDS Databases", category: "Storage", icon: "database" },
  { id: "iam", label: "IAM Best Practices", category: "Security", icon: "admin_panel_settings" },
  { id: "nacl", label: "NACLs vs Security Groups", category: "Security", icon: "security" },
];

const CATEGORIES = ["Networking", "Compute", "Storage", "Security"];

export default function KnowledgeHubPage() {
  const [activeTopic, setActiveTopic] = useState("vpc");

  return (
    <div style={{ display: "flex", height: `calc(100dvh - var(--header-height))` }}>
      {/* Knowledge Sidebar */}
      <div
        style={{
          width: "260px",
          borderRight: "1px solid var(--outline-variant)",
          background: "var(--surface-container-lowest)",
          overflowY: "auto",
          flexShrink: 0,
          padding: "var(--space-md)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
          <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>menu_book</span>
          <h2 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>Knowledge Base</h2>
        </div>

        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-sm)" }}>
          Core Concepts
        </p>

        {CATEGORIES.map((cat) => (
          <div key={cat} style={{ marginBottom: "var(--space-md)" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-xs)" }}>
              {cat}
            </p>
            {TOPICS.filter((t) => t.category === cat).map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-sm)",
                  width: "100%",
                  padding: "6px var(--space-sm)",
                  fontSize: "12px",
                  fontWeight: activeTopic === topic.id ? 700 : 400,
                  color: activeTopic === topic.id ? "var(--on-surface)" : "var(--on-surface-variant)",
                  background: activeTopic === topic.id ? "var(--surface-container-high)" : "transparent",
                  border: "none",
                  borderLeft: activeTopic === topic.id ? "2px solid var(--primary-container)" : "2px solid transparent",
                  borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{topic.icon}</span>
                {topic.label}
              </button>
            ))}
          </div>
        ))}

        {/* Sub-sections */}
        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "var(--space-lg)", marginBottom: "var(--space-sm)" }}>
          Resources
        </p>
        <button style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", width: "100%", padding: "6px var(--space-sm)", fontSize: "12px", color: "var(--on-surface-variant)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>auto_awesome</span>
          Networking Best Practices
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", width: "100%", padding: "6px var(--space-sm)", fontSize: "12px", color: "var(--on-surface-variant)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>security</span>
          Security Fundamentals
        </button>

        <div style={{ marginTop: "var(--space-lg)", padding: "var(--space-md)", background: "var(--surface-container-low)", borderRadius: "var(--radius-lg)", border: "1px solid var(--outline-variant)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--primary)", marginBottom: "4px", display: "block" }}>upgrade</span>
          <p style={{ fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>Upgrade to Pro</p>
          <p style={{ fontSize: "10px", color: "var(--on-surface-variant)", margin: 0 }}>Access advanced tutorials and compliance guides.</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-lg) var(--space-xl)", paddingBottom: "calc(var(--footer-height) + var(--space-xl))" }}>
        {/* Breadcrumbs */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", marginBottom: "var(--space-lg)" }}>
          <span style={{ color: "var(--on-surface-variant)" }}>Knowledge Hub</span>
          <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--on-surface-variant)" }}>chevron_right</span>
          <span style={{ color: "var(--on-surface-variant)" }}>Networking</span>
          <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--on-surface-variant)" }}>chevron_right</span>
          <span style={{ color: "var(--on-surface)" }}>VPC Architecture & Subnets</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "24px", fontWeight: 600, lineHeight: "32px", marginBottom: "8px" }}>
          Amazon VPC Architecture Foundation
        </h1>
        <p style={{ fontSize: "14px", color: "var(--on-surface-variant)", marginBottom: "var(--space-xl)", maxWidth: "720px" }}>
          Amazon Virtual Private Cloud (Amazon VPC) lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.
        </p>

        {/* Architecture Sketch + Takeaways */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "var(--space-sm) var(--space-md)", background: "var(--surface-container)", borderBottom: "1px solid var(--aws-border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>Architecture Sketch</span>
              <button className="tag tag--info">Live Preview</button>
            </div>
            <div
              style={{
                height: "240px",
                background: "var(--surface-container-low)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                padding: "var(--space-lg)",
              }}
            >
              {/* VPC Diagram Mockup */}
              <div style={{ border: "2px dashed var(--outline-variant)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)", width: "100%", maxWidth: "400px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--on-surface-variant)", margin: "0 0 var(--space-md)", fontFamily: "'JetBrains Mono', monospace" }}>
                  VPC (10.0.0.0/16)
                </p>
                <div style={{ display: "flex", gap: "var(--space-md)" }}>
                  <div style={{ flex: 1, padding: "var(--space-sm)", background: "rgba(0, 98, 160, 0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(0, 98, 160, 0.2)", textAlign: "center" }}>
                    <span style={{ fontSize: "10px", color: "var(--secondary)", fontWeight: 600 }}>Public Subnets</span>
                  </div>
                  <div style={{ flex: 1, padding: "var(--space-sm)", background: "rgba(255, 153, 0, 0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 153, 0, 0.2)", textAlign: "center" }}>
                    <span style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 600 }}>Private Subnets</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-lg)", marginTop: "var(--space-md)" }}>
                  <div style={{ textAlign: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "var(--outline)" }}>router</span>
                    <p style={{ fontSize: "9px", color: "var(--on-surface-variant)", margin: "2px 0 0" }}>Internet Gateway</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "var(--outline)" }}>swap_vert</span>
                    <p style={{ fontSize: "9px", color: "var(--on-surface-variant)", margin: "2px 0 0" }}>NAT Gateway</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "var(--space-md)" }}>Key Takeaways</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {[
                "One VPC spans multiple AZs in a Region.",
                "Subnets are mapped to specific AZs.",
                "Default VPC limits are 5 per region.",
                "Public subnets require an Internet Gateway (IGW).",
                "Private subnets use NAT Gateway for outbound access.",
              ].map((point, i) => (
                <li key={i} style={{ display: "flex", gap: "var(--space-sm)", fontSize: "13px", color: "var(--on-surface-variant)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--primary-container)", flexShrink: 0, marginTop: "2px" }}>check_circle</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Implementation with Terraform */}
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "var(--space-md)" }}>Implementation with Terraform</h2>
        <div className="card" style={{ overflow: "hidden", marginBottom: "var(--space-lg)" }}>
          <div style={{ padding: "var(--space-sm) var(--space-md)", background: "var(--surface-container)", borderBottom: "1px solid var(--aws-border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "var(--secondary)" }}>main.tf</span>
            <button
              style={{
                background: "var(--primary-container)",
                color: "var(--on-primary-container)",
                border: "none",
                padding: "4px 12px",
                borderRadius: "var(--radius-md)",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>content_copy</span>
              Copy
            </button>
          </div>
          <div
            className="code-block"
            style={{
              padding: "var(--space-md)",
              background: "#1e2631",
              color: "#d3e4fe",
            }}
          >
            <pre style={{ margin: 0, fontSize: "12px", lineHeight: "20px" }}>
{`resource "aws_vpc" "main" {
  cidr_block         = "10.0.0.0/16"
  instance_tenancy   = "default"

  tags = {
    Name = "Production-VPC"
    Env  = "Prod"
  }
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"

  tags = { Name = "Public-Subnet-A11" }
}`}
            </pre>
          </div>
        </div>

        {/* Expert Tip */}
        <div
          style={{
            background: "rgba(255, 153, 0, 0.06)",
            border: "1px solid rgba(255, 153, 0, 0.2)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-md)",
            marginBottom: "var(--space-xl)",
            display: "flex",
            alignItems: "start",
            gap: "var(--space-sm)",
          }}
        >
          <span className="material-symbols-outlined" style={{ color: "var(--primary-container)", fontSize: "20px", flexShrink: 0 }}>tips_and_updates</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 4px" }}>Expert Tip</p>
            <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", margin: 0 }}>
              Always enable <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", background: "var(--surface-container)", padding: "1px 4px", borderRadius: "2px" }}>dns_hostnames</code> and <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", background: "var(--surface-container)", padding: "1px 4px", borderRadius: "2px" }}>dns_support</code> in your VPC configuration to ensure proper service discovery within the cloud environment.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "var(--space-md)" }}>Comparison: NACLs vs Security Groups</h2>
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--surface-container)" }}>
                {["Feature", "Security Groups", "Network ACLs"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: "12px",
                      borderBottom: "2px solid var(--outline-variant)",
                      color: "var(--on-surface)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Scope", "Instance Level", "Subnet Level"],
                ["Stateful?", "Yes (Stateful)", "No (Stateless)"],
                ["Default", "Allow rules only", "Allow & Deny rules"],
                ["Rules", "Allow rules only", "Allow & Deny rules"],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid var(--aws-border-color)",
                        color: j === 0 ? "var(--on-surface)" : "var(--on-surface-variant)",
                        fontWeight: j === 0 ? 600 : 400,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
