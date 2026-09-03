import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limiter";

// Judge0 endpoints in priority order:
// 1. Self-hosted or RapidAPI key (paid, reliable)
// 2. Public CE endpoint (free, rate-limited - dev/demo fallback)
const JUDGE0_RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";

async function executeOnJudge0(
  source_code: string,
  language_id: number,
  stdin: string,
  endpoint: string,
  headers: Record<string, string>
) {
  const res = await fetch(`${endpoint}/submissions/?base64_encoded=false&wait=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({
      source_code,
      language_id,
      stdin: stdin || "",
      cpu_time_limit: 5,
      memory_limit: 128000,
    }),
    signal: AbortSignal.timeout(12000), // 12s timeout
  });
  return res;
}

export async function POST(req: Request) {
  try {
    // ── Rate Limit: 20 code executions per IP per minute ────────────────
    const ip = getClientIP(req);
    const rateLimit = checkRateLimit(`code-exec:${ip}`, { limit: 20, windowMs: 60_000 });
    if (!rateLimit.success) {
      const retryAfterSec = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many submissions. Please wait before running code again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSec),
            "X-RateLimit-Limit": "20",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.resetAt),
          },
        }
      );
    }

    const { source_code, language_id, stdin } = await req.json();

    if (!source_code || !language_id) {
      return NextResponse.json(
        { error: "Source code and language_id are required." },
        { status: 400 }
      );
    }

    // ── Code size guard: max 50 KB ────────────────────────────────
    if (source_code.length > 50_000) {
      return NextResponse.json(
        { error: "Source code exceeds maximum allowed size (50 KB)." },
        { status: 400 }
      );
    }

    const rapidApiKey = process.env.JUDGE0_RAPIDAPI_KEY;

    let result: any = null;
    let usedEndpoint = "";

    // 1. Try RapidAPI Judge0 (paid, reliable) if key is configured
    if (rapidApiKey) {
      try {
        const res = await executeOnJudge0(
          source_code,
          Number(language_id),
          stdin,
          `https://${JUDGE0_RAPIDAPI_HOST}`,
          {
            "X-RapidAPI-Host": JUDGE0_RAPIDAPI_HOST,
            "X-RapidAPI-Key": rapidApiKey,
          }
        );

        if (res.ok) {
          result = await res.json();
          usedEndpoint = "rapidapi-judge0";
        } else {
          const errText = await res.text();
          console.warn("RapidAPI Judge0 failed:", errText);
        }
      } catch (err) {
        console.warn("RapidAPI Judge0 fetch error:", err);
      }
    }

    // 2. Fallback to public CE endpoint (dev/demo only)
    if (!result) {
      try {
        const res = await executeOnJudge0(
          source_code,
          Number(language_id),
          stdin,
          "https://ce.judge0.com",
          {}
        );

        if (res.ok) {
          result = await res.json();
          usedEndpoint = "judge0-ce-public";
        } else {
          const errText = await res.text();
          console.warn("Judge0 public CE fallback failed:", errText);
          return NextResponse.json(
            { error: "Code execution service unavailable. Please try again.", details: errText },
            { status: 503 }
          );
        }
      } catch (err: any) {
        console.error("Judge0 public CE fallback error:", err);
        return NextResponse.json(
          { error: "Code execution service timed out. Please try again." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      message: result.message,
      exit_code: result.exit_code,
      time: result.time,
      memory: result.memory,
      status: result.status,
      _endpoint: usedEndpoint,
    });
  } catch (error: any) {
    console.error("Code execution API route error:", error);
    return NextResponse.json(
      { error: "Internal server error during code execution." },
      { status: 500 }
    );
  }
}
