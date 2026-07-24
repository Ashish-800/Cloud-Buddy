"use client";

import React from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════════
   Cloud Buddy — Landing Page
   Blueprint-themed marketing page with sketch-to-diagram morph hero,
   process strip, feature cards, test cases, and compliance callout.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Reusable SVG Components ─────────────────────────────────────────── */

function CloudBuddyLogo() {
  return (
    <svg className="logo-mark" viewBox="0 0 40 40" fill="none">
      <path
        d="M10 24C6 24 3 21 3 17.5C3 14 6 11 9.5 11C10.5 6 15 3 19.5 4C23.5 5 26 8.5 26 12C29.5 12 32 14.5 32 18C32 21.5 29.5 24 26 24H10Z"
        stroke="#EAF2FA" strokeWidth="1.8" fill="none"
      />
      <circle cx="14" cy="18" r="1.3" fill="#EAF2FA" />
      <circle cx="21" cy="18" r="1.3" fill="#EAF2FA" />
      <path d="M13 22C15 24 19 24 21 22" stroke="#E8871E" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SketchLayer() {
  return (
    <svg className="sketch-layer" viewBox="0 0 400 340">
      <rect x="20" y="20" width="360" height="300" fill="none" stroke="#7E93A8" strokeWidth="1" />
      <path d="M60 80 Q100 70 150 82 Q190 90 165 105 Q135 118 90 108 Q55 100 60 80 Z" fill="none" stroke="#EAF2FA" strokeWidth="2.2" />
      <text x="72" y="98" fill="#EAF2FA" fontFamily="JetBrains Mono" fontSize="11">ALB?</text>
      <path d="M220 70 Q265 62 300 78 Q320 88 290 102 Q255 112 225 98 Q210 88 220 70 Z" fill="none" stroke="#E8871E" strokeWidth="2.2" />
      <text x="232" y="90" fill="#E8871E" fontFamily="JetBrains Mono" fontSize="11">EC2 x2</text>
      <path d="M70 60 L280 85" stroke="#EAF2FA" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M100 200 Q150 188 200 205 Q225 215 195 228 Q160 238 120 226 Q95 216 100 200 Z" fill="none" stroke="#EAF2FA" strokeWidth="2.2" />
      <text x="118" y="216" fill="#EAF2FA" fontFamily="JetBrains Mono" fontSize="11">RDS??</text>
      <path d="M255 92 L165 205" stroke="#EAF2FA" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M300 220 Q340 212 355 232 Q362 248 335 250 Q310 250 302 235 Q298 226 300 220 Z" fill="none" stroke="#7E93A8" strokeWidth="2" />
      <text x="305" y="238" fill="#7E93A8" fontFamily="JetBrains Mono" fontSize="10">S3</text>
    </svg>
  );
}

function CleanLayer() {
  return (
    <svg className="clean-layer" viewBox="0 0 400 340">
      <rect x="20" y="20" width="360" height="300" fill="none" stroke="#1D4E7A" strokeWidth="1" />
      <rect x="55" y="55" width="120" height="46" fill="none" stroke="#EAF2FA" strokeWidth="1.5" />
      <text x="70" y="83" fill="#EAF2FA" fontFamily="JetBrains Mono" fontSize="11">ALB</text>
      <rect x="215" y="55" width="140" height="46" fill="none" stroke="#E8871E" strokeWidth="1.5" />
      <text x="228" y="83" fill="#E8871E" fontFamily="JetBrains Mono" fontSize="11">EC2 (Multi-AZ)</text>
      <line x1="175" y1="78" x2="215" y2="78" stroke="#EAF2FA" strokeWidth="1.2" />
      <rect x="95" y="190" width="150" height="46" fill="none" stroke="#EAF2FA" strokeWidth="1.5" />
      <text x="108" y="218" fill="#EAF2FA" fontFamily="JetBrains Mono" fontSize="11">RDS Primary/Standby</text>
      <line x1="270" y1="101" x2="170" y2="190" stroke="#EAF2FA" strokeWidth="1.2" />
      <rect x="290" y="200" width="70" height="46" fill="none" stroke="#7E93A8" strokeWidth="1.5" />
      <text x="308" y="228" fill="#7E93A8" fontFamily="JetBrains Mono" fontSize="11">S3</text>
      <line x1="350" y1="101" x2="325" y2="200" stroke="#7E93A8" strokeWidth="1.2" />
    </svg>
  );
}

/* ── Feature Card Icon Set ────────────────────────────────────────────── */

const featureIcons = {
  score: (
    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2" />
    </svg>
  ),
  streaming: (
    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 8v4l3 3M12 22a10 10 0 100-20 10 10 0 000 20z" />
    </svg>
  ),
  diagram: (
    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 9h18M8 4v16" />
    </svg>
  ),
  terraform: (
    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  compliance: (
    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z" />
    </svg>
  ),
  history: (
    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 3v18h18M7 14l4-4 3 3 5-6" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════════════════════
   Landing Page Component
   ═══════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="blueprint-bg">
      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="logo">
          <CloudBuddyLogo />
          <span className="logo-text">Cloud Buddy</span>
        </div>

        <div className="nav-links">
          <a href="#process">How it works</a>
          <a href="#features">Features</a>
          <a href="#cases">Test cases</a>
          <a href="#compliance">Compliance</a>
        </div>

        <Link href="/signup" className="btn btn-primary">
          Sign up — free
        </Link>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div>
          <div className="title-block" style={{ marginBottom: 26 }}>
            <div><span>Drawing No.</span>CB-001</div>
            <div><span>Scale</span>1:1</div>
            <div><span>Rev</span>A</div>
          </div>

          <div className="eyebrow">AI system design tutor</div>

          <h1 className="hero-title">
            Sketch it on a whiteboard.<br />
            Learn <em>why</em> it works.<br />
            Ship it as Terraform.
          </h1>

          <p className="hero-sub">
            Cloud Buddy reads your hand-drawn cloud architecture, teaches you
            what&apos;s wrong with it before it tells you what&apos;s right, and turns
            the final version into deployable infrastructure — powered by
            Gemma&nbsp;4&apos;s native multimodal reasoning.
          </p>

          <div className="hero-ctas">
            <Link href="/workbench" className="btn btn-primary">
              Upload your first sketch
            </Link>
            <a href="#process" className="btn btn-ghost">
              See how it works
            </a>
          </div>

          <div className="hero-note">{"// no credit card · works on any napkin sketch"}</div>
        </div>

        {/* Sketch ↔ Blueprint Morph */}
        <div className="morph-wrap">
          <SketchLayer />
          <CleanLayer />
          <div className="morph-label">{"// live sketch → validated diagram"}</div>
        </div>
      </section>

      {/* ── Process Strip ───────────────────────────────────────────── */}
      <section className="landing-section" id="process">
        <div className="section-head">
          <div className="section-label">The process</div>
          <div className="section-title">Three steps, in order — sketch, understand, ship.</div>
        </div>
        <div className="process">
          <div className="process-step">
            <div className="num">01 — UPLOAD</div>
            <h3>Snap your whiteboard</h3>
            <p>Photograph any sketch, however messy. Gemma 4&apos;s vision reads spatial relationships — what&apos;s inside a VPC, what talks to what.</p>
          </div>
          <div className="process-step">
            <div className="num">02 — UNDERSTAND</div>
            <h3>Get taught, not just graded</h3>
            <p>A scored critique across Security, Cost, and Resilience, plus follow-up questions that make you explain your own choices before seeing the fix.</p>
          </div>
          <div className="process-step">
            <div className="num">03 — SHIP</div>
            <h3>Walk away with real Terraform</h3>
            <p>Validated, provider-specific infrastructure-as-code for AWS, GCP, or Azure — streamed live as it&apos;s written.</p>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="landing-section" id="features">
        <div className="section-head">
          <div className="section-label">What&apos;s inside</div>
          <div className="section-title">Built for people who learn by building.</div>
        </div>
        <div className="features">
          <div className="card">
            {featureIcons.score}
            <h3>Architecture Score</h3>
            <p>0–100 rating across Security, Cost, and Fault Tolerance. Re-upload a revised sketch and watch the score move — progress you can actually see.</p>
          </div>
          <div className="card">
            {featureIcons.streaming}
            <h3>Real-time streaming</h3>
            <p>Watch critique, diagram, and code generate token by token over SSE — no infinite spinner, no black box.</p>
          </div>
          <div className="card">
            {featureIcons.diagram}
            <h3>Interactive diagram canvas</h3>
            <p>Your sketch, redrawn clean as a zoomable Mermaid.js diagram — the same architecture, finally legible.</p>
          </div>
          <div className="card">
            {featureIcons.terraform}
            <h3>Validated Terraform</h3>
            <p>Generated code is checked for syntax and schema validity before it&apos;s marked ready — not just handed over on faith.</p>
          </div>
          <div className="card">
            {featureIcons.compliance}
            <h3>Compliance injection</h3>
            <p>Upload a 100-page security policy PDF. Gemma cross-checks your architecture and generated code against it, in-context.</p>
          </div>
          <div className="card">
            {featureIcons.history}
            <h3>Session history</h3>
            <p>Every sketch, score, and revision saved to your account — so a semester of practice looks like a portfolio, not scattered screenshots.</p>
          </div>
        </div>
      </section>

      {/* ── Test Cases ──────────────────────────────────────────────── */}
      <section className="landing-section" id="cases">
        <div className="section-head">
          <div className="section-label">Proven on</div>
          <div className="section-title">Three architectural paradigms, not one lucky demo.</div>
        </div>
        <div className="cases">
          <div className="case">
            <div className="tag">Traditional networking</div>
            <h4>High-availability 3-tier web app</h4>
            <p>Multi-AZ EC2 behind an ALB, primary/standby RDS PostgreSQL, S3 for static assets.</p>
            <div className="stack">ALB · EC2 · RDS · S3</div>
          </div>
          <div className="case">
            <div className="tag">Zero-VPC</div>
            <h4>Serverless event-driven system</h4>
            <p>Fully decoupled microservices — no networking layer for Cloud Buddy to get wrong.</p>
            <div className="stack">API GW · Lambda · SQS · DynamoDB</div>
          </div>
          <div className="case">
            <div className="tag">High throughput</div>
            <h4>Real-time analytics pipeline</h4>
            <p>Streaming ingestion through to queryable, visualized data at scale.</p>
            <div className="stack">Kinesis · Glue · Athena · QuickSight</div>
          </div>
        </div>
      </section>

      {/* ── Compliance ──────────────────────────────────────────────── */}
      <section className="landing-section" id="compliance">
        <div className="compliance-grid">
          <div>
            <div className="section-label">Enterprise-grade, still educational</div>
            <h3>Your architecture, checked against your own rulebook.</h3>
            <p>
              Drop in a SOC2 policy, an internal security standard, or a
              professor&apos;s grading rubric — Gemma 4 holds it in its 256K context
              window and reasons against your sketch directly, not a generic checklist.
            </p>
            <ul>
              <li>Cross-references every generated resource against uploaded policy</li>
              <li>Flags violations inline in the critique, not buried in a report</li>
              <li>Works identically for a classroom rubric or a company&apos;s compliance doc</li>
            </ul>
          </div>

          <div className="score-mock">
            <div style={{ marginBottom: 14, color: "#7E93A8" }}>{"// architecture-score.log"}</div>
            <div className="score-row">
              <span>Security</span>
              <div className="bar"><span style={{ width: "62%" }} /></div>
              <span>62</span>
            </div>
            <div className="score-row">
              <span>Cost Optimization</span>
              <div className="bar"><span style={{ width: "81%" }} /></div>
              <span>81</span>
            </div>
            <div className="score-row">
              <span>Fault Tolerance</span>
              <div className="bar"><span style={{ width: "45%" }} /></div>
              <span>45</span>
            </div>
            <div className="score-row" style={{ borderTop: "1px solid var(--grid)", marginTop: 6, paddingTop: 12, color: "var(--marker)" }}>
              ⚠ single point of failure: NAT Gateway
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="mono" style={{ fontSize: 12, color: "#7E93A8" }}>
          © Cloud Buddy — Track 2, AI for Education
        </div>
        <div className="foot-links">
          <a href="#process">How it works</a>
          <a href="#compliance">Compliance</a>
          <Link href="/signup">Sign up</Link>
        </div>
      </footer>
    </div>
  );
}
