import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { source_code, language_id, stdin } = await req.json();

    if (!source_code || !language_id) {
      return NextResponse.json(
        { error: "Source code and language_id are required." },
        { status: 400 }
      );
    }

    // Call Judge0 CE API Endpoint
    const res = await fetch("https://ce.judge0.com/submissions/?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code,
        language_id: Number(language_id),
        stdin: stdin || "",
        cpu_time_limit: 5,
        memory_limit: 128000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Judge0 CE API error response:", errText);
      return NextResponse.json({ error: "Judge0 execution error", details: errText }, { status: 500 });
    }

    const result = await res.json();

    return NextResponse.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      message: result.message,
      exit_code: result.exit_code,
      time: result.time,
      memory: result.memory,
      status: result.status,
    });
  } catch (error: any) {
    console.error("Code execution API route error:", error);
    return NextResponse.json(
      { error: "Internal server error during code execution." },
      { status: 500 }
    );
  }
}
