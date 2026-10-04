import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIP } from "@/lib/rate-limiter";
import { AssessmentInput, ScoreResult } from "@/types";

const assessmentSchema = z.object({
  college: z.string().trim().min(1).max(120),
  branch: z.string().trim().min(1).max(80),
  year: z.string().trim().min(1).max(20),
  cgpa: z.number().finite().min(0).max(10),
  projects: z.number().int().min(0).max(10),
  internships: z.number().int().min(0).max(10),
  github: z.enum(["yes", "low", "no"]),
  linkedin: z.enum(["yes", "no"]),
  dsa: z.number().int().min(0).max(10),
  communication: z.number().int().min(0).max(10),
  targetCompany: z.string().trim().min(1).max(120),
  topProject: z.string().trim().max(500).optional(),
  keyAchievement: z.string().trim().max(500).optional(),
  interviewConfidence: z.number().int().min(0).max(10).optional(),
  targetRole: z.string().trim().max(120).optional(),
});

// ── Fallback: pure-TS scoring (mirrors Python engine.py exactly) ──────────
function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(Math.round(value), max));
}

function calculateScoreFallback(payload: AssessmentInput): ScoreResult {
  const raw =
    payload.cgpa * 6 +
    payload.projects * 7 +
    payload.internships * 9 +
    payload.dsa * 5 +
    payload.communication * 5 +
    (payload.github === "yes" ? 6 : 0) +
    (payload.linkedin === "yes" ? 5 : 0) -
    (payload.year === "1" ? 8 : 0);

  const score = clamp(raw / 4.2);
  const riskLevel = score < 45 ? "HIGH" : score < 70 ? "MEDIUM" : "LOW";

  const dsaScore = clamp(payload.dsa * 10);
  const projectsScore = clamp(payload.projects * 20 + (payload.github === "yes" || payload.github === "low" ? 20 : 0));
  const resumeScore = clamp(payload.cgpa * 6 + payload.internships * 15 + (payload.linkedin === "yes" ? 15 : 5));
  const interviewScore = clamp(((payload.interviewConfidence ?? payload.communication) * 6 + payload.communication * 4));

  const dimensions = [
    { name: "DSA consistency", score: dsaScore },
    { name: "Project depth & proof", score: projectsScore },
    { name: "Resume & Internship proof", score: resumeScore },
    { name: "Interview readiness", score: interviewScore },
  ].sort((a, b) => a.score - b.score);

  const biggestGap = dimensions[0].name;
  const strongestArea = dimensions[dimensions.length - 1].name;

  const roastMap: Record<string, string> = {
    HIGH: "You are currently more prepared for watching placement reels than cracking interviews.",
    MEDIUM: "You are one focused sprint away from becoming HR's favorite candidate.",
    LOW: "Dangerously employable. Your relatives might stop asking \"job kab?\".",
  };

  const summaryExplanation = score < 45
    ? "You have initial exposure, but your core technical and interview preparation needs immediate focused proof. Your biggest opportunity is converting what you've learned into visible, public evidence."
    : score < 70
    ? "You have decent building blocks, but your execution lacks consistent proof. Polishing your main project and practicing live interviews will unlock high-tier opportunities."
    : "Your profile is solid with good hands-on signals. Maintain consistent grind and refine your high-level system architectural pitch.";

  const fallbackResult: ScoreResult = {
    score,
    riskLevel: riskLevel as "HIGH" | "MEDIUM" | "LOW",
    roast: roastMap[riskLevel],
    strengths: [
      payload.projects > 1 ? "Hands-on project exposure" : "Starting to build project momentum",
      payload.communication > 6 ? "Willingness to improve communication" : "Clear communication baseline",
      payload.dsa > 6 ? "Solid DSA consistency" : "Early-stage DSA effort",
    ],
    weaknesses: [
      payload.internships < 1 ? "Internship credibility gap" : "Needs internship depth",
      payload.github === "no" ? "No public code proof on GitHub" : "GitHub quality can be improved",
      payload.linkedin === "no" ? "Low recruiter visibility on LinkedIn" : "LinkedIn profile optimization pending",
    ],
    placementProbability: clamp(score + 8),
    salaryPredictionLpa: Number((3 + score / 12).toFixed(1)),
    careerType: score > 75 ? "Builder" : score > 55 ? "Rising Candidate" : "Potential Underused",
    breakdown: {
      dsa: dsaScore,
      projects: projectsScore,
      resume: resumeScore,
      interview: interviewScore,
    },
    biggestGap,
    strongestArea,
    summaryExplanation,
  };

  return fallbackResult;
}

export async function POST(req: Request) {
  // ── Rate limit: 30 assessments per IP per 5 minutes ─────────────────────
  const ip = getClientIP(req);
  const rateLimit = await checkRateLimit(`assessment:${ip}`, { limit: 30, windowMs: 5 * 60_000 });
  if (!rateLimit.success) {
    const retryAfterSec = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many assessment requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": "30",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedPayload = assessmentSchema.safeParse(body);
  if (!parsedPayload.success) {
    return NextResponse.json({ error: "Invalid assessment fields." }, { status: 400 });
  }
  const payload: AssessmentInput = parsedPayload.data;

  const backendUrl = process.env.FASTAPI_BACKEND_URL ?? "http://localhost:8000";

  // ── Attempt 1: Python FastAPI (authoritative scoring engine) ─────────────
  try {
    const res = await fetch(`${backendUrl}/api/v1/assessment/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        college: payload.college,
        branch: payload.branch,
        year: payload.year,
        cgpa: payload.cgpa,
        projects: payload.projects,
        internships: payload.internships,
        github: payload.github,
        linkedin: payload.linkedin,
        dsa: payload.dsa,
        communication: payload.communication,
        target_company: payload.targetCompany,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      const tsFallback = calculateScoreFallback(payload);
      const result: ScoreResult = {
        score: data.score,
        riskLevel: data.risk_level,
        roast: data.roast,
        placementProbability: data.placement_probability,
        salaryPredictionLpa: data.salary_prediction_lpa,
        strengths: tsFallback.strengths,
        weaknesses: tsFallback.weaknesses,
        careerType: tsFallback.careerType,
        breakdown: tsFallback.breakdown,
        biggestGap: tsFallback.biggestGap,
        strongestArea: tsFallback.strongestArea,
        summaryExplanation: tsFallback.summaryExplanation,
      };
      return NextResponse.json({ ...result, _source: "fastapi" });
    }

  } catch {
    // FastAPI backend offline - fallback seamlessly to local TypeScript engine
  }

  // ── Attempt 2: TypeScript fallback scoring ───────────────────────────────
  const result = calculateScoreFallback(payload);
  return NextResponse.json({ ...result, _source: "ts-fallback" });
}
