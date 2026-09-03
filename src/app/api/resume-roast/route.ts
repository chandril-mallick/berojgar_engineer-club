import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limiter";
import { ResumeRoastResult } from "@/types";

// ── Fallback: pure-TS resume roast (mirrors Python engine.py) ────────────
function roastFallback(fileName: string): ResumeRoastResult {
  const normalized = fileName.toLowerCase();
  const hasFinal = normalized.includes("final");
  const hasResume = normalized.includes("resume");
  const atsScore = Math.max(0, Math.min(100, (hasResume ? 55 : 45) + (hasFinal ? 10 : 0)));

  return {
    atsScore,
    roastLine:
      atsScore < 60
        ? "Your resume has survived four years without learning formatting."
        : "Your resume is decent, but HR still wants receipts, not vibes.",
    improvements: [
      "Add measurable outcomes for each project (numbers > adjectives).",
      "Move technical skills above education for fresher screening speed.",
      "Use one clean font pair and consistent bullet spacing.",
      "Add GitHub + deployed links beside each featured project.",
    ],
  };
}

export async function POST(req: Request) {
  // ── Rate limit: 20 roasts per IP per 5 minutes ───────────────────────────
  const ip = getClientIP(req);
  const rateLimit = checkRateLimit(`resume-roast:${ip}`, { limit: 20, windowMs: 5 * 60_000 });
  if (!rateLimit.success) {
    const retryAfterSec = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many resume uploads. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": "20",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let fileName: string;
  try {
    const body = await req.json();
    fileName = body.file_name ?? body.fileName ?? "";
    if (!fileName) throw new Error("missing file_name");
  } catch {
    return NextResponse.json({ error: "file_name is required." }, { status: 400 });
  }

  const backendUrl = process.env.FASTAPI_BACKEND_URL ?? "http://localhost:8000";

  // ── Attempt 1: Python FastAPI (authoritative) ─────────────────────────────
  try {
    const res = await fetch(`${backendUrl}/api/v1/resume/roast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_name: fileName }),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      const result: ResumeRoastResult = {
        atsScore: data.ats_score,
        roastLine: data.roast_line,
        improvements: data.improvements,
      };
      return NextResponse.json({ ...result, _source: "fastapi" });
    }

    const errText = await res.text();
    console.warn(`FastAPI resume roast failed (${res.status}):`, errText);
  } catch (err) {
    console.warn("FastAPI backend unreachable, falling back to TS roast:", err);
  }

  // ── Attempt 2: TypeScript fallback ────────────────────────────────────────
  const result = roastFallback(fileName);
  return NextResponse.json({ ...result, _source: "ts-fallback" });
}
