"use client";

import React from "react";

interface CloudBuddyLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function CloudBuddyLogo({
  size = 40,
  showText = false,
  className = "",
}: CloudBuddyLogoProps) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 0 12px rgba(56, 189, 248, 0.45))",
          transition: "transform 0.3s ease",
        }}
      >
        <defs>
          {/* Cloud Body Gradient */}
          <linearGradient id="cloudBodyGrad" x1="15" y1="15" x2="105" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Left Blue Arm Gradient */}
          <linearGradient id="leftArmGrad" x1="10" y1="35" x2="30" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Right Gold Hand Gradient */}
          <linearGradient id="rightHandGrad" x1="90" y1="30" x2="110" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Glossy White Highlight */}
          <linearGradient id="glossGrad" x1="40" y1="20" x2="40" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Left Arm & Waving Hand (Blue) ───────────── */}
        <g id="left-arm">
          <path
            d="M 30 50 C 20 45, 14 36, 12 38 C 10 40, 16 48, 26 56"
            fill="url(#leftArmGrad)"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 12 36 C 8 32, 10 26, 14 30 C 16 26, 20 28, 18 33 C 20 31, 23 35, 20 38 Z"
            fill="url(#leftArmGrad)"
            stroke="#0284c7"
            strokeWidth="1.5"
          />
        </g>

        {/* ── Right Arm & Waving Hand (Gold/Yellow) ───── */}
        <g id="right-arm">
          <path
            d="M 90 50 C 100 45, 106 36, 108 38 C 110 40, 104 48, 94 56"
            fill="url(#rightHandGrad)"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 108 36 C 112 32, 110 26, 106 30 C 104 26, 100 28, 102 33 C 100 31, 97 35, 100 38 Z"
            fill="url(#rightHandGrad)"
            stroke="#d97706"
            strokeWidth="1.5"
          />
        </g>

        {/* ── Fluffy Cloud Body ──────────────────────── */}
        <path
          d="
            M 35 68
            C 22 68, 18 56, 24 46
            C 20 34, 32 24, 44 26
            C 50 16, 68 14, 78 22
            C 88 16, 100 26, 96 38
            C 104 46, 100 64, 85 68
            C 78 74, 42 74, 35 68 Z
          "
          fill="url(#cloudBodyGrad)"
          stroke="#0284c7"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* ── Glossy Highlights on Lobes ──────────────── */}
        <path
          d="M 42 30 C 46 24, 56 20, 64 21"
          stroke="url(#glossGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 28 42 C 30 36, 35 32, 40 32"
          stroke="url(#glossGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* ── Cute Eyes ───────────────────────────────── */}
        <circle cx="48" cy="46" r="4.5" fill="#0f172a" />
        <circle cx="49.5" cy="44.5" r="1.5" fill="#ffffff" />

        <circle cx="72" cy="46" r="4.5" fill="#0f172a" />
        <circle cx="73.5" cy="44.5" r="1.5" fill="#ffffff" />

        {/* ── Friendly Golden Smile ────────────────────── */}
        <path
          d="M 53 53 Q 60 61 67 53"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "1.125rem",
              fontWeight: 800,
              color: "#f8fafc",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            Cloud <span style={{ color: "#38bdf8" }}>Buddy</span>
          </span>
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 500,
              color: "#94a3b8",
              letterSpacing: "0.02em",
            }}
          >
            Your Friendly Cloud Companion
          </span>
        </div>
      )}
    </div>
  );
}
