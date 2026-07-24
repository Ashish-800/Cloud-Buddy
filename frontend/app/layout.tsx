import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cloud Buddy — Sketch it. Learn it. Ship it.",
  description:
    "Upload a hand-drawn cloud architecture sketch → Get an instant architectural critique, interactive Mermaid diagram, and production-ready Terraform code — powered by Gemma 4 Multimodal.",
  keywords: [
    "cloud architecture",
    "system design",
    "terraform",
    "AWS",
    "GCP",
    "Azure",
    "gemma",
    "AI tutor",
    "infrastructure as code",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
