/**
 * scoring.ts — client-side service for assessment and resume roast.
 *
 * These functions call the Next.js proxy API routes, which in turn:
 *   1. Try the Python FastAPI backend at FASTAPI_BACKEND_URL (authoritative)
 *   2. Fall back to built-in TypeScript scoring if FastAPI is unreachable
 *
 * Single source of truth for scoring logic: backend/services/engine.py
 * The TS fallback in the API routes is kept in sync as a resilience layer only.
 */

import { AssessmentInput, ResumeRoastResult, ScoreResult } from "@/types";

/**
 * Calculate the Berojgar Score for a student profile.
 * Calls /api/assessment (proxy → FastAPI → TS fallback).
 */
export async function calculateBerojgarScore(
  payload: AssessmentInput
): Promise<ScoreResult> {
  const res = await fetch("/api/assessment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Assessment API error ${res.status}`);
  }

  return res.json() as Promise<ScoreResult>;
}

/**
 * Generate a resume roast from text extracted from an uploaded PDF.
 */
export async function generateResumeRoast(
  file: File
): Promise<ResumeRoastResult> {
  const formData = new FormData();
  formData.append("resume", file);
  const res = await fetch("/api/resume-roast", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Resume roast API error ${res.status}`);
  }

  return res.json() as Promise<ResumeRoastResult>;
}
