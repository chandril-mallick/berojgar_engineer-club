import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limiter";

// Primary models (non-free, reliable) - used when OPENROUTER_API_KEY is a paid/upgraded key
const PRIMARY_MODELS = [
  "google/gemini-2.0-flash-001",
  "meta-llama/llama-3.3-70b-instruct",
  "anthropic/claude-3-haiku",
];

// Free-tier fallback models (may have rate limits / latency)
const FREE_FALLBACK_MODELS = [
  "openrouter/free", // Universal wildcard routing (automatically picks an active free model)
  "google/gemma-2-9b-it:free",
  "meta-llama/llama-3-8b-instruct:free",
];

export async function POST(req: Request) {
  try {
    // ── Rate Limit: 10 AI requests per IP per minute ────────────────────
    const ip = getClientIP(req);
    const rateLimit = checkRateLimit(`ai-coach:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!rateLimit.success) {
      const retryAfterSec = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many requests. Please wait before sending another message." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSec),
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.resetAt),
          },
        }
      );
    }

    const { prompt, mode } = await req.json();

    // ── Prompt length guard: max 2000 characters ────────────────────────
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }
    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt is too long. Please keep it under 2000 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("Missing OPENROUTER_API_KEY in environment variables.");
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const systemPrompts: Record<string, string> = {
      assessment:
        "You are the Berojgar Score AI Assessor powered by NVIDIA Nemotron & Llama 3.3. Given an engineering student's profile (College, Branch, Year, CGPA, Projects, Internships, GitHub, LinkedIn, DSA, Target Company, Top Project/Research Paper, Key Achievement), generate a 2-sentence brutally honest, funny, yet encouraging placement roast referencing their specific projects/achievements (like IEEE papers, ML models, or shipped apps). Focus on their single primary headline for recruiters.",
      coach:
        "You are the 24/7 AI Career Coach at Berojgar Engineer Club (BEC). Provide brutally honest, highly practical career advice for engineering students targeting top Tech & Startup roles.",
      resume:
        "You are the ATS Resume Roaster at Berojgar Engineer Club. Roast the user's resume bullets with constructive humor, Google X-Y-Z formula recommendations, and ATS keyword optimization.",
      interview:
        "You are an SDE Technical Interviewer at Berojgar Engineer Club. Conduct mock DSA & System Design drills. Provide hints, complexity analysis, and STAR method feedback.",
      negotiate:
        "You are an SDE Salary & Offer Negotiator at Berojgar Engineer Club. Help engineering grads negotiate base salary, joining bonuses, and draft HR counter-offer emails.",
    };

    const systemInstruction =
      systemPrompts[mode] || systemPrompts.coach;

    let reply = "";
    let usedModel = "";

    // Build model list: PRIMARY first (if paid key configured), then free fallbacks
    const isPaidKey = process.env.OPENROUTER_TIER === "paid";
    const orderedModels = isPaidKey
      ? [...PRIMARY_MODELS, ...FREE_FALLBACK_MODELS]
      : FREE_FALLBACK_MODELS;

    // Multi-model retry with per-request timeout
    for (const modelCandidate of orderedModels) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "https://berojgarengineer.club",
            "X-Title": "Berojgar Engineer Club",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelCandidate,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
          signal: AbortSignal.timeout(10000), // 10s per model attempt
        });

        if (res.ok) {
          const data = await res.json();
          const candidateReply = data.choices?.[0]?.message?.content;
          if (candidateReply) {
            reply = candidateReply;
            usedModel = modelCandidate;
            break;
          }
        } else {
          const errText = await res.text();
          // Skip to next model on rate-limit (429)
          if (res.status === 429) {
            console.warn(`Rate limited on ${modelCandidate}, trying next model.`);
            continue;
          }
          console.warn(`OpenRouter model ${modelCandidate} failed (${res.status}):`, errText);
        }
      } catch (err) {
        console.warn(`Fetch error / timeout for model ${modelCandidate}:`, err);
      }
    }

    // Graceful Fallback if all API models fail
    if (!reply) {
      reply =
        "Chief AI Assessor: Your credentials show high potential! Keep building real-world projects, solving DSA daily challenges on BEC, and sharpening your resume ATS bullets.";
      usedModel = "fallback-static";
    }

    return NextResponse.json({ reply, model: usedModel });
  } catch (error: any) {
    console.error("AI Coach route error:", error);
    return NextResponse.json({
      reply: "BEC AI Coach: Keep grinding! Build projects, solve daily DSA drills, and get your resume audited.",
      model: "fallback-ai",
    });
  }
}
