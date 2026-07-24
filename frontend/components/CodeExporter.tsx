"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  Sparkles,
  Layers,
  Info,
} from "lucide-react";

interface CodeExporterProps {
  code: string | null;
  isLoading?: boolean;
}

type FileTab = "main.tf" | "variables.tf" | "outputs.tf" | "providers.tf";

export default function CodeExporter({ code, isLoading = false }: CodeExporterProps) {
  const [activeTab, setActiveTab] = useState<FileTab>("main.tf");
  const [copied, setCopied] = useState(false);

  // Sample file partitioning for IDE look
  const getFileContent = (tab: FileTab) => {
    if (!code) return "";
    switch (tab) {
      case "main.tf":
        return code;
      case "variables.tf":
        return `# variables.tf – Input variables for Cloud Buddy architecture\n\nvariable "aws_region" {\n  type        = string\n  default     = "us-east-1"\n  description = "Target AWS deployment region"\n}\n\nvariable "environment" {\n  type        = string\n  default     = "production"\n  description = "Environment tier tag"\n}\n`;
      case "outputs.tf":
        return `# outputs.tf – Exported infrastructure parameters\n\noutput "vpc_id" {\n  value       = aws_vpc.main.id\n  description = "ID of the provisioned VPC"\n}\n\noutput "alb_dns_name" {\n  value       = aws_lb.alb.dns_name\n  description = "Public DNS endpoint for Application Load Balancer"\n}\n`;
      case "providers.tf":
        return `# providers.tf – Provider requirements\n\nterraform {\n  required_version = ">= 1.5.0"\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\nprovider "aws" {\n  region = var.aws_region\n}\n`;
    }
  };

  const currentContent = getFileContent(activeTab);

  const handleCopy = () => {
    if (!currentContent) return;
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentContent) return;
    const blob = new Blob([currentContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeTab;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          color: "var(--text-muted)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            color: "var(--marker)",
          }}
        >
          <Terminal size={16} /> Streaming Production-Ready HCL Terraform Code...
        </div>

        <div
          style={{
            background: "var(--navy-deep)",
            border: "1px solid var(--grid)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
          }}
        >
          <div style={{ color: "var(--text-muted)" }}># Synthesizing HCL provider definitions...</div>
          <div style={{ color: "var(--marker)" }}>resource &quot;aws_vpc&quot; &quot;main&quot; &#123; ... &#125;</div>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        <FileCode size={36} color="var(--grid)" style={{ marginBottom: "12px" }} />
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            margin: "0 0 6px",
          }}
        >
          No Terraform Generated Yet
        </h4>
        <p style={{ fontSize: "0.8125rem", margin: 0, maxWidth: "340px" }}>
          Run architecture analysis on your sketch to generate fully commented Terraform code.
        </p>
      </div>
    );
  }

  const lines = currentContent.split("\n");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--navy-deep)",
        border: "1px solid var(--grid)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      {/* ── IDE File Tabs Header ────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "var(--navy)",
          borderBottom: "1px solid var(--grid)",
          padding: "0 8px",
        }}
      >
        {(["main.tf", "variables.tf", "outputs.tf", "providers.tf"] as FileTab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--marker)" : "var(--text-muted)",
                background: isActive ? "var(--navy-deep)" : "transparent",
                border: "none",
                borderTop: isActive ? "2px solid var(--marker)" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <FileCode size={13} color={isActive ? "var(--marker)" : "var(--text-muted)"} />
              {tab}
            </button>
          );
        })}

        {/* Action Controls */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px", paddingRight: "8px" }}>
          <button
            onClick={handleCopy}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 10px",
              background: "rgba(29, 78, 122, 0.4)",
              border: "1px solid var(--grid)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.6875rem",
              fontFamily: "var(--font-mono)",
              color: "var(--white-line)",
              cursor: "pointer",
            }}
          >
            {copied ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={handleDownload}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 10px",
              background: "var(--marker)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.6875rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: "var(--navy-deep)",
              cursor: "pointer",
            }}
          >
            <Download size={12} /> Download
          </button>
        </div>
      </div>

      {/* ── IDE Code Display with Line Numbers ───────────────────────── */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "16px 0",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8125rem",
          lineHeight: 1.6,
          display: "flex",
        }}
      >
        {/* Line Numbers Column */}
        <div
          style={{
            padding: "0 12px",
            userSelect: "none",
            textAlign: "right",
            color: "var(--text-muted)",
            borderRight: "1px solid rgba(29, 78, 122, 0.4)",
            opacity: 0.6,
          }}
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Content Column */}
        <div style={{ padding: "0 16px", flex: 1, whiteSpace: "pre", color: "var(--paper)" }}>
          {lines.map((line, i) => {
            const isComment = line.trim().startsWith("#");
            const isResource = line.includes("resource ") || line.includes("provider ");
            return (
              <div
                key={i}
                style={{
                  color: isComment
                    ? "var(--text-muted)"
                    : isResource
                    ? "var(--marker)"
                    : "var(--paper)",
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer Info Strip ────────────────────────────────────────── */}
      <div
        style={{
          padding: "6px 14px",
          background: "var(--navy)",
          borderTop: "1px solid var(--grid)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.625rem",
          color: "var(--text-muted)",
        }}
      >
        <span>HashiCorp HCL · Terraform v1.5+ Compatible</span>
        <span>{lines.length} Lines · UTF-8</span>
      </div>
    </div>
  );
}
