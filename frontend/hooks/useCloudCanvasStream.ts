"use client";

import { useState, useCallback, useRef } from "react";

/* ── Types ────────────────────────────────────────────────────────────── */

export interface DetectedComponent {
  name: string;
  service: string;
  notes?: string | null;
}

export interface CritiqueData {
  summary: string;
  findings: Array<{
    title: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    description: string;
    recommendation: string;
  }>;
  score: number;
}

export interface StreamState {
  /** True while connected to the SSE stream. */
  isStreaming: boolean;
  /** The cloud provider echoed back by the API. */
  activeProvider: string | null;
  /** The model name echoed back in the metadata event. */
  activeModel: string | null;
  /** Parsed critique object (populated on "critique" event). */
  critiqueData: CritiqueData | null;
  /** Raw critique markdown assembled from the parsed data. */
  critiqueText: string | null;
  /** Components detected in the sketch. */
  detectedComponents: DetectedComponent[];
  /** Mermaid.js flowchart code (populated on "mermaid" event). */
  mermaidCode: string | null;
  /** Terraform HCL code (populated on "terraform" event). */
  terraformCode: string | null;
  /** Error message if something went wrong. */
  error: string | null;
  /** True after the stream has completed successfully. */
  isComplete: boolean;
}

interface UseCloudCanvasStreamReturn extends StreamState {
  /** Trigger analysis. Returns void — state updates drive the UI. */
  startAnalysis: (
    imageFile: File,
    complianceDoc: File | null,
    cloudProvider: string,
  ) => Promise<void>;
  /** Abort the current stream. */
  abort: () => void;
  /** Reset all state back to initial. */
  reset: () => void;
}

/* ── Initial State ────────────────────────────────────────────────────── */

const INITIAL_STATE: StreamState = {
  isStreaming: false,
  activeProvider: null,
  activeModel: null,
  critiqueData: null,
  critiqueText: null,
  detectedComponents: [],
  mermaidCode: null,
  terraformCode: null,
  error: null,
  isComplete: false,
};

/* ── Helpers ──────────────────────────────────────────────────────────── */

/**
 * Convert the structured critique JSON into a rich Markdown string
 * suitable for `react-markdown`.
 */
function critiqueToMarkdown(
  critique: CritiqueData,
  components: DetectedComponent[],
): string {
  const lines: string[] = [];

  // Score badge
  const scoreEmoji =
    critique.score >= 80 ? "🟢" : critique.score >= 50 ? "🟡" : "🔴";
  lines.push(`## ${scoreEmoji} Architecture Score: ${critique.score}/100\n`);

  // Summary
  lines.push(critique.summary);
  lines.push("");

  // Detected components
  if (components.length > 0) {
    lines.push("### 🧩 Detected Components\n");
    lines.push("| Component | Cloud Service | Notes |");
    lines.push("|-----------|--------------|-------|");
    for (const c of components) {
      lines.push(`| ${c.name} | \`${c.service}\` | ${c.notes || "—"} |`);
    }
    lines.push("");
  }

  // Findings
  if (critique.findings.length > 0) {
    lines.push("### 🔍 Findings\n");
    const severityIcons: Record<string, string> = {
      critical: "🔴",
      high: "🟠",
      medium: "🟡",
      low: "🔵",
      info: "ℹ️",
    };

    for (const f of critique.findings) {
      const icon = severityIcons[f.severity] || "⚪";
      lines.push(
        `#### ${icon} ${f.title}  \n**Severity:** \`${f.severity.toUpperCase()}\`\n`,
      );
      lines.push(f.description);
      lines.push("");
      lines.push(`> **💡 Recommendation:** ${f.recommendation}`);
      lines.push("\n---\n");
    }
  }

  return lines.join("\n");
}

/* ── SSE Line Parser ─────────────────────────────────────────────────── */

interface ParsedSSEEvent {
  event: string;
  data: string;
}

/**
 * Incrementally parse an SSE text buffer into discrete events.
 * Returns [parsedEvents, remainingBuffer].
 *
 * SSE format:
 *   event: <type>\n
 *   data: <json>\n
 *   \n  ← blank line terminates event
 */
function parseSSEBuffer(buffer: string): [ParsedSSEEvent[], string] {
  const events: ParsedSSEEvent[] = [];
  // Split on double-newline (event boundary)
  const blocks = buffer.split("\n\n");
  // The last block may be incomplete
  const remaining = blocks.pop() || "";

  for (const block of blocks) {
    if (!block.trim()) continue;
    let event = "";
    let data = "";

    for (const line of block.split("\n")) {
      if (line.startsWith("event: ")) {
        event = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        data = line.slice(6);
      }
    }

    if (event && data) {
      events.push({ event, data });
    }
  }

  return [events, remaining];
}

/* ── Hook ─────────────────────────────────────────────────────────────── */

export function useCloudCanvasStream(): UseCloudCanvasStreamReturn {
  const [state, setState] = useState<StreamState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  /* ── Reset ──────────────────────────────────────────────────────── */

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setState(INITIAL_STATE);
  }, []);

  /* ── Abort ──────────────────────────────────────────────────────── */

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setState((s) => ({ ...s, isStreaming: false, error: "Analysis aborted." }));
  }, []);

  /* ── Start Analysis ─────────────────────────────────────────────── */

  const startAnalysis = useCallback(
    async (
      imageFile: File,
      complianceDoc: File | null,
      cloudProvider: string,
    ) => {
      // Abort any in-flight request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // Reset state for new analysis
      setState({
        ...INITIAL_STATE,
        isStreaming: true,
      });

      try {
        // ── Build FormData ─────────────────────────────────────
        const formData = new FormData();
        formData.append("image_file", imageFile);
        if (complianceDoc) {
          formData.append("compliance_doc", complianceDoc);
        }
        formData.append("cloud_provider", cloudProvider);

        // ── Fetch with streaming ───────────────────────────────
        const response = await fetch(
          "http://localhost:8000/api/v1/analyze",
          {
            method: "POST",
            body: formData,
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(
            `Server responded with ${response.status}: ${errorText}`,
          );
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Response body is not readable");

        const decoder = new TextDecoder();
        let sseBuffer = "";

        // ── Streaming read loop ────────────────────────────────
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          sseBuffer += decoder.decode(value, { stream: true });
          const [events, remaining] = parseSSEBuffer(sseBuffer);
          sseBuffer = remaining;

          for (const evt of events) {
            try {
              const payload = JSON.parse(evt.data);

              switch (evt.event) {
                case "metadata":
                  setState((s) => ({
                    ...s,
                    activeProvider: payload.cloud_provider || null,
                    activeModel: payload.model || null,
                  }));
                  break;

                case "critique": {
                  const critique = payload.critique as CritiqueData;
                  const components = (payload.detected_components ||
                    []) as DetectedComponent[];
                  const markdown = critiqueToMarkdown(critique, components);
                  setState((s) => ({
                    ...s,
                    critiqueData: critique,
                    critiqueText: markdown,
                    detectedComponents: components,
                  }));
                  break;
                }

                case "mermaid":
                  setState((s) => ({
                    ...s,
                    mermaidCode: payload.mermaid_code || null,
                  }));
                  break;

                case "terraform":
                  setState((s) => ({
                    ...s,
                    terraformCode: payload.terraform_code || null,
                  }));
                  break;

                case "done":
                  setState((s) => ({
                    ...s,
                    isStreaming: false,
                    isComplete: true,
                  }));
                  break;

                case "error":
                  setState((s) => ({
                    ...s,
                    isStreaming: false,
                    error: payload.error || "Unknown analysis error",
                  }));
                  break;
              }
            } catch {
              // JSON fragmentation — wait for next chunk to complete the payload
              sseBuffer = `event: ${evt.event}\ndata: ${evt.data}\n\n` + sseBuffer;
            }
          }
        }

        // If we exited the loop without a "done" event, mark as complete
        setState((s) => {
          if (s.isStreaming) {
            return { ...s, isStreaming: false, isComplete: true };
          }
          return s;
        });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // User-triggered abort — already handled
          return;
        }
        const message =
          err instanceof Error ? err.message : "Connection to CloudBuddy API failed";
        setState((s) => ({
          ...s,
          isStreaming: false,
          error: message,
        }));
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    },
    [],
  );

  return {
    ...state,
    startAnalysis,
    abort,
    reset,
  };
}
