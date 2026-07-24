"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileCode,
  ShieldCheck,
  Globe,
  Settings,
  Clock,
  ArrowRight,
  Server,
  Layers,
  Sparkles,
} from "lucide-react";

export default function DeployValidatePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--navy-deep)",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Breadcrumb Bar ────────────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 24px",
          background: "var(--navy)",
          borderBottom: "1px solid var(--grid)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.75rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        <Link href="/workbench" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Workbench
        </Link>
        <span style={{ color: "var(--grid)" }}>/</span>
        <span style={{ color: "var(--text-secondary)" }}>US-East-1 Production</span>
        <span style={{ color: "var(--grid)" }}>/</span>
        <span style={{ color: "var(--marker)", fontWeight: 700 }}>Deployment & Validation</span>
      </div>

      <div style={{ padding: "24px", maxWidth: "1400px", width: "100%", margin: "0 auto", flex: 1 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
            background: "var(--navy)",
            border: "1px solid var(--grid)",
            borderRadius: "var(--radius-lg)",
            padding: "20px 24px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                color: "var(--marker)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "4px",
              }}
            >
              Infrastructure Pipeline
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--white-line)",
                margin: "0 0 4px",
              }}
            >
              Deployment Strategy: Canary Rollout
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
              Validating HCL Terraform plans against visual architecture and security compliance policies.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              style={{
                padding: "10px 18px",
                background: "rgba(29, 78, 122, 0.3)",
                border: "1px solid var(--grid)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                cursor: "pointer",
              }}
            >
              Cancel Plan
            </button>
            <button
              style={{
                padding: "10px 20px",
                background: "var(--marker)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                color: "var(--navy-deep)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "var(--glow-marker)",
              }}
            >
              Provision Infrastructure
            </button>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {/* Validation Status Cards */}
          <div
            style={{
              background: "var(--navy)",
              border: "1px solid var(--grid)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--white-line)",
                margin: "0 0 16px",
              }}
            >
              Automated Validation Checks
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Passed Check */}
              <div
                style={{
                  padding: "14px",
                  background: "rgba(76, 175, 125, 0.08)",
                  border: "1px solid var(--accent-emerald)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--white-line)" }}>
                      Network Topology & VPC Connectivity
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        color: "var(--accent-emerald)",
                        padding: "2px 6px",
                        background: "rgba(76, 175, 125, 0.2)",
                        borderRadius: "3px",
                      }}
                    >
                      PASSED
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>
                    VPC Peering and Subnet routes validated. All routes resolve cleanly to active gateways.
                  </p>
                </div>
              </div>

              {/* Critical IAM Issue */}
              <div
                style={{
                  padding: "14px",
                  background: "rgba(232, 90, 90, 0.08)",
                  border: "1px solid var(--accent-rose)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <AlertTriangle size={20} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--white-line)" }}>
                      IAM Role Overlap Conflict
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        color: "var(--accent-rose)",
                        padding: "2px 6px",
                        background: "rgba(232, 90, 90, 0.2)",
                        borderRadius: "3px",
                      }}
                    >
                      CRITICAL
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>
                    Overlapping permissions detected between &apos;all-read-access&apos; and &apos;global-admin&apos; roles.
                  </p>
                </div>
              </div>

              {/* Warning Cost Threshold */}
              <div
                style={{
                  padding: "14px",
                  background: "rgba(232, 135, 30, 0.08)",
                  border: "1px solid var(--marker)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <AlertCircle size={20} color="var(--marker)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--white-line)" }}>
                      Monthly Budget Threshold Exceeded
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        color: "var(--marker)",
                        padding: "2px 6px",
                        background: "rgba(232, 135, 30, 0.2)",
                        borderRadius: "3px",
                      }}
                    >
                      WARNING
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>
                    Current plan exceeds target monthly budget by $156. Consider Spot instances for worker nodes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Architecture Diff Card */}
          <div
            style={{
              background: "var(--navy)",
              border: "1px solid var(--grid)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--white-line)",
                margin: "0 0 16px",
              }}
            >
              Architectural Visual Diff
            </h2>

            <div
              style={{
                flex: 1,
                background: "var(--navy-deep)",
                border: "1px solid var(--grid)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 14,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.625rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                A/B Visual Verification
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "rgba(29, 78, 122, 0.3)",
                      border: "1px solid var(--grid)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 8px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Layers size={26} />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                    Sketch Concept
                  </span>
                </div>

                <ArrowRight size={24} color="var(--marker)" />

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "rgba(76, 175, 125, 0.15)",
                      border: "1px solid var(--accent-emerald)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 8px",
                      color: "var(--accent-emerald)",
                    }}
                  >
                    <Server size={26} />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--white-line)" }}>
                    Provisioned Target
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HCL Terraform Plan Execution Code Box */}
        <div
          style={{
            background: "var(--navy)",
            border: "1px solid var(--grid)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              background: "var(--navy-deep)",
              borderBottom: "1px solid var(--grid)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--marker)",
            }}
          >
            <span>terraform_plan_1a9_v3 (Execution Output)</span>
            <span style={{ color: "var(--text-muted)" }}>32 resources to add</span>
          </div>

          <div
            style={{
              padding: "16px",
              background: "var(--navy-deep)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--paper)",
              lineHeight: 1.6,
              overflowX: "auto",
            }}
          >
            <pre style={{ margin: 0 }}>
{`# terraform plan -out=tfplan
Plan: 32 to add, 0 to change, 0 to destroy.

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
}`}
            </pre>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {[
            { label: "TARGET REGION", val: "us-east-1 (N. Virginia)", icon: Globe, color: "var(--accent-emerald)" },
            { label: "EXECUTION MODE", val: "Remote (Terraform Cloud)", icon: Settings, color: "var(--text-secondary)" },
            { label: "VALIDATION ENGINE", val: "OPA Policy / Checkov", icon: ShieldCheck, color: "var(--marker)" },
            { label: "ESTIMATED TIME", val: "~14 Minutes", icon: Clock, color: "var(--text-secondary)" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                style={{
                  background: "var(--navy)",
                  border: "1px solid var(--grid)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <Icon size={20} color={item.color} style={{ margin: "0 auto 8px" }} />
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.625rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.08em",
                    marginBottom: "4px",
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--white-line)" }}>
                  {item.val}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
