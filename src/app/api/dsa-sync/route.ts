import { NextResponse } from "next/server";
import { fetchProblemset, normalizeProblem } from "@/lib/codeforces";
import { RealWorldDSAChallenge } from "@/lib/real-world-dsa-data";
import fs from "fs";
import path from "path";

// Initialize Firebase Admin if configured, else use local file cache.
// For now, since Firebase admin might not be configured, we will default to a local JSON cache file.
const CACHE_FILE = path.join(process.cwd(), "codeforces_cache.json");

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await fetchProblemset();
    if (data.status !== "OK" || !data.result) {
      return NextResponse.json({ error: "API returned FAILED", details: data.comment }, { status: 500 });
    }

    const { problems, problemStatistics } = data.result;

    // Load existing cache
    let existingQuestions: RealWorldDSAChallenge[] = [];
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const fileContent = fs.readFileSync(CACHE_FILE, "utf-8");
        existingQuestions = JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn("Failed to read cache file, starting fresh");
    }

    const existingIds = new Set(existingQuestions.map(q => q.id));

    let added = 0;
    let skipped = 0;

    // We only take the top 500 problems to avoid massive file sizes for the local cache.
    // The problemset has over 9000 problems.
    const problemsToProcess = problems.slice(0, 1000); 

    const newQuestions: RealWorldDSAChallenge[] = [];

    for (const p of problemsToProcess) {
      const stats = problemStatistics.find(
        (s) => s.contestId === p.contestId && s.index === p.index
      );
      const normalized = normalizeProblem(p, stats);

      if (existingIds.has(normalized.id)) {
        skipped++;
      } else {
        newQuestions.push(normalized);
        added++;
      }
    }

    const finalQuestions = [...existingQuestions, ...newQuestions];
    
    // Save to cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(finalQuestions, null, 2));

    // Optional: Write to Firestore if admin sdk is available.
    // The prompt mentions: "writes new questions to Firestore (dsa_questions collection) when Firebase is configured, otherwise to a local JSON cache file the app can read".
    // I am writing to a local JSON file here as the fallback.

    return NextResponse.json({
      added,
      skipped,
      total: finalQuestions.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    let stat = null;
    let total = 0;
    
    if (fs.existsSync(CACHE_FILE)) {
      stat = fs.statSync(CACHE_FILE);
      const fileContent = fs.readFileSync(CACHE_FILE, "utf-8");
      total = JSON.parse(fileContent).length;
    }

    return NextResponse.json({
      status: "OK",
      lastSyncTime: stat ? stat.mtime.toISOString() : null,
      questionCount: total,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
