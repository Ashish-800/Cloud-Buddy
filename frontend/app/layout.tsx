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
  title: "CloudBuddy — AI System Design Tutor",
  description:
    "Convert hand-drawn cloud architecture sketches into clean digital diagrams, architectural critiques, and HashiCorp Terraform code — powered by Gemma 4 Multimodal.",
  keywords: [
    "cloud architecture",
    "system design",
    "terraform",
    "AWS",
    "GCP",
    "Azure",
    "gemma",
    "AI tutor",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body style={{ backgroundColor: "#090d16", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
