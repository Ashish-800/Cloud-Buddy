import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* ── Font Configuration ──────────────────────────────────────────────── */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/* ── SEO Metadata ────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "CloudCanvas — AI System Design Tutor",
  description:
    "Upload a hand-drawn cloud architecture sketch and get an instant architectural critique, interactive Mermaid diagram, and production-ready Terraform code — powered by Gemma 4 Multimodal.",
  keywords: [
    "cloud architecture",
    "system design",
    "terraform",
    "AWS",
    "GCP",
    "Azure",
    "AI tutor",
    "Gemma 4",
  ],
};

/* ── Root Layout ─────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {/* Ambient background glow */}
        <div className="ambient-gradient" aria-hidden="true" />

        {/* App shell */}
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
