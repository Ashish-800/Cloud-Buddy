"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Network,
  Shield,
  Server,
  Cpu,
  Zap,
  HardDrive,
  Database,
  Lock,
  CheckCircle2,
  Copy,
  Sparkles,
  Layers,
  Check,
} from "lucide-react";

const TOPICS = [
  { id: "vpc", label: "VPC Architecture & Subnets", category: "Networking", icon: Network },
  { id: "sg", label: "Security Groups & NACLs", category: "Networking", icon: Shield },
  { id: "elb", label: "Application Load Balancers", category: "Networking", icon: Server },
  { id: "ec2", label: "EC2 Instance Profiles", category: "Compute", icon: Cpu },
  { id: "lambda", label: "Lambda Serverless Functions", category: "Compute", icon: Zap },
  { id: "s3", label: "S3 Object Storage", category: "Storage", icon: HardDrive },
  { id: "rds", label: "RDS Multi-AZ Databases", category: "Storage", icon: Database },
  { id: "iam", label: "IAM Role Best Practices", category: "Security", icon: Lock },
];

const CATEGORIES = ["Networking", "Compute", "Storage", "Security"];

export default function KnowledgeHubPage() {
  const [activeTopic, setActiveTopic] = useState("vpc");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--navy-deep)",
        color: "var(--text-primary)",
        overflow: "hidden",
      }}
    >
      {/* ── Knowledge Sidebar ───────────────────────────────────────── */}
      <div
        style={{
          width: "280px",
          borderRight: "1px solid var(--grid)",
          background: "var(--navy)",
          overflowY: "auto",
          flexShrink: 0,
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
            borderBottom: "1px solid var(--grid)",
            paddingBottom: "12px",
          }}
        >
          <BookOpen size={20} color="var(--marker)" />
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--white-line)",
                margin: 0,
              }}
            >
              Knowledge Hub
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.625rem",
                color: "var(--text-muted)",
              }}
            >
              Cloud Architecture Patterns
            </span>
          </div>
        </div>

        {CATEGORIES.map((cat) => (
          <div key={cat} style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.625rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "8px",
                paddingLeft: "8px",
              }}
            >
              {cat}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {TOPICS.filter((t) => t.category === cat).map((topic) => {
                const Icon = topic.icon;
                const isActive = activeTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopic(topic.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "8px 10px",
                      fontSize: "0.8125rem",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--marker)" : "var(--text-secondary)",
                      background: isActive ? "rgba(232, 135, 30, 0.12)" : "transparent",
                      border: "none",
                      borderLeft: isActive ? "2px solid var(--marker)" : "2px solid transparent",
                      borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon size={15} color={isActive ? "var(--marker)" : "var(--text-muted)"} />
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {topic.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Knowledge Content Display ──────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 36px",
          background: "var(--navy-deep)",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            marginBottom: "16px",
          }}
        >
          <Link href="/workbench" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
            Workbench
          </Link>
          <span style={{ color: "var(--grid)" }}>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Knowledge Hub</span>
          <span style={{ color: "var(--grid)" }}>/</span>
          <span style={{ color: "var(--marker)", fontWeight: 700 }}>VPC Architecture Foundation</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--white-line)",
            marginBottom: "8px",
          }}
        >
          Amazon VPC Architecture Foundation
        </h1>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: "28px",
            maxWidth: "780px",
          }}
        >
          Amazon Virtual Private Cloud (Amazon VPC) lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.
        </p>

        {/* Key Takeaways Card Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "var(--navy)",
              border: "1px solid var(--grid)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                color: "var(--marker)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "12px",
              }}
            >
              Visual Blueprint Reference
            </div>

            <div
              style={{
                background: "var(--navy-deep)",
                border: "1px solid var(--grid)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--white-line)",
                  marginBottom: "12px",
                }}
              >
                VPC (10.0.0.0/16)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(56, 189, 248, 0.1)",
                    border: "1px solid var(--accent-blue)",
                    borderRadius: "var(--radius-sm)",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-blue)", fontWeight: 600 }}>
                    Public Subnets (10.0.1.0/24)
                  </span>
                </div>

                <div
                  style={{
                    padding: "12px",
                    background: "rgba(232, 135, 30, 0.1)",
                    border: "1px solid var(--marker)",
                    borderRadius: "var(--radius-sm)",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "var(--marker)", fontWeight: 600 }}>
                    Private Subnets (10.0.2.0/24)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "var(--navy)",
              border: "1px solid var(--grid)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--white-line)",
                margin: "0 0 12px",
              }}
            >
              Key Takeaways
            </h3>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "0.8125rem",
                color: "var(--text-secondary)",
              }}
            >
              {[
                "One VPC spans multiple Availability Zones in a Region.",
                "Public subnets require an Internet Gateway (IGW).",
                "Private subnets route outbound via NAT Gateway.",
                "Default VPC soft quota is 5 per region.",
              ].map((pt, i) => (
                <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* HCL Terraform Sample */}
        <div
          style={{
            background: "var(--navy)",
            border: "1px solid var(--grid)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              background: "var(--navy-deep)",
              borderBottom: "1px solid var(--grid)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--marker)",
            }}
          >
            <span>main.tf (HCL Reference)</span>
            <button
              onClick={handleCopy}
              style={{
                background: "rgba(29, 78, 122, 0.4)",
                border: "1px solid var(--grid)",
                color: "var(--white-line)",
                padding: "3px 10px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.6875rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {copied ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div
            style={{
              padding: "16px",
              background: "var(--navy-deep)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--paper)",
              lineHeight: 1.6,
            }}
          >
            <pre style={{ margin: 0 }}>
{`resource "aws_vpc" "main" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "Production-VPC"
    Env  = "Prod"
  }
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
