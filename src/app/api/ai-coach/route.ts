import { NextResponse } from "next/server";

const FALLBACK_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemini-2.0-flash-lite-001",
  "deepseek/deepseek-r1:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
];

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();

    const apiKey =
      process.env.OPENROUTER_API_KEY ||
      "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";

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

    // Multi-model retry mechanism
    for (const modelCandidate of FALLBACK_MODELS) {
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
        });

        if (res.ok) {
          const data = await res.json();
          const candidateReply = data.choices?.[0]?.message?.content;
          if (candidateReply) {
            reply = candidateReply;
            usedModel = modelCandidate;
            break; // Success!
          }
        } else {
          const errText = await res.text();
          console.warn(`OpenRouter model ${modelCandidate} failed:`, errText);
        }
      } catch (err) {
        console.warn(`Fetch error for model ${modelCandidate}:`, err);
      }
    }

    // Graceful Fallback if all API models fail
    if (!reply) {
      reply =
        "Chief AI Assessor: Your credentials show high potential! Keep building real-world projects, solving DSA daily challenges on BEC, and sharpening your resume ATS bullets.";
      usedModel = "fallback-ai-assessor";
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
