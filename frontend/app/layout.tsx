import type { Metadata } from "next";
import { Work_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

/* ── Font Configuration ──────────────────────────────────────────────── */

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
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
    <html lang="en" className={`${workSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body style={{ fontFamily: "var(--font-work-sans), 'Work Sans', system-ui, sans-serif" }}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
