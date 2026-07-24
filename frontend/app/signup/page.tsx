"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════════
   Cloud Buddy — Signup Page
   Engineering-drawing themed signup card on blueprint background.
   ═══════════════════════════════════════════════════════════════════════ */

import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
            role: form.role,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      setSuccess(true);
      setTimeout(() => router.push("/workbench"), 1500);
    } catch (err: any) {
      const msg = err?.message || "Something went wrong. Please try again.";
      if (msg.toLowerCase().includes("rate limit")) {
        setError(
          "Email rate limit exceeded. To disable email verification during testing: Go to Supabase Dashboard -> Authentication -> Providers -> Email -> Disable 'Confirm email'."
        );
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="blueprint-bg">
      {/* ── Back to Landing ─────────────────────────────────────────── */}
      <Link href="/" className="back-link">
        ← Back
      </Link>

      <div className="signup-shell">
        <div className="signup-card">
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="signup-header">
            <div className="eyebrow mono">Create account</div>
            <h2>Start your first drawing.</h2>
            <p>Free while in beta — your sketches, scores, and history saved from day one.</p>
          </div>

          {/* ── Form ───────────────────────────────────────────────── */}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ada Lovelace"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ada@university.edu"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="field">
              <label htmlFor="role">I&apos;m signing up as</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option>Student</option>
                <option>Educator</option>
                <option>Engineer / practitioner</option>
                <option>Team / enterprise</option>
              </select>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  marginBottom: 12,
                  background: "#fef2f2",
                  border: "1px solid #fca5a5",
                  color: "#991b1b",
                  fontSize: "13px",
                  borderRadius: 2,
                }}
              >
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div
                style={{
                  padding: "10px 14px",
                  marginBottom: 12,
                  background: "#ecfdf5",
                  border: "1px solid #6ee7b7",
                  color: "#065f46",
                  fontSize: "13px",
                  borderRadius: 2,
                }}
              >
                Account created! Redirecting to workbench…
              </div>
            )}

            <button
              type="submit"
              className="signup-submit"
              disabled={isSubmitting || success}
            >
              {isSubmitting ? "Creating account…" : success ? "✓ Created!" : "Create account →"}
            </button>

            <div className="signup-alt">
              Already have an account?{" "}
              <Link href="/workbench">Log in</Link>
            </div>
          </form>

          {/* ── Drawing footer stamp ───────────────────────────────── */}
          <div className="signup-footer-block">
            <span>DWG NO. CB-002</span>
            <span>SHEET 1 OF 1</span>
            <span>REV A</span>
          </div>
        </div>
      </div>
    </div>
  );
}
