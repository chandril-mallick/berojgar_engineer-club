import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { analyzeResumeText } from "@/lib/resume-analysis";
import { checkRateLimit, getClientIP } from "@/lib/rate-limiter";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_RESUME_CHARS = 50_000;

async function extractResumeText(file: File): Promise<string> {
  if (file.size === 0) throw new Error("The uploaded file is empty.");
  if (file.size > MAX_FILE_BYTES) throw new Error("Resume files must be 5 MB or smaller.");

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) throw new Error("Upload a PDF resume.");

  const parser = new PDFParse({ data: new Uint8Array(await file.arrayBuffer()) });
  try {
    const result = await parser.getText();
    return result.text.replace(/\s+/g, " ").trim().slice(0, MAX_RESUME_CHARS);
  } finally {
    await parser.destroy();
  }
}

export async function POST(req: Request) {
  const ip = getClientIP(req);
  const rateLimit = await checkRateLimit(`resume-roast:${ip}`, { limit: 20, windowMs: 5 * 60_000 });
  if (!rateLimit.success) {
    const retryAfterSec = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many resume audits. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
        },
      }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("resume");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A PDF resume is required." }, { status: 400 });
    }

    const text = await extractResumeText(file);
    if (text.length < 80) {
      return NextResponse.json(
        { error: "We could not extract enough text from this PDF. Please upload a text-based PDF rather than a scanned image." },
        { status: 422 }
      );
    }

    return NextResponse.json({ ...analyzeResumeText(text), _source: "document-content" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to read this resume.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
