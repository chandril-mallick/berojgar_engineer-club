import { ResumeRoastResult } from "@/types";

const SECTION_PATTERNS = [
  ["contact details", /(?:linkedin\.com|github\.com|@|\+?\d[\d\s()-]{8,})/i],
  ["education", /\beducation\b|\bb\.?tech\b|\bb\.?e\b|\bcgpa\b/i],
  ["technical skills", /\b(?:technical\s+)?skills\b|\btechnologies\b|\blanguages\b/i],
  ["projects", /\bprojects?\b|\bexperience\b|\bwork history\b/i],
] as const;

const ACTION_VERBS = /\b(?:built|developed|designed|implemented|launched|improved|optimized|reduced|increased|automated|led|created|deployed)\b/gi;
const METRICS = /(?:\b\d+(?:\.\d+)?\s?(?:%|x|\+)|\b(?:increased|reduced|improved)\b[^.\n]{0,80}\b\d+)/gi;

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Analyze actual extracted resume text without sending candidate data to a third party. */
export function analyzeResumeText(text: string): ResumeRoastResult {
  const normalized = text.replace(/\s+/g, " ").trim();
  const wordCount = normalized ? normalized.split(" ").length : 0;
  const sectionCount = SECTION_PATTERNS.filter(([, pattern]) => pattern.test(normalized)).length;
  const actionVerbCount = (normalized.match(ACTION_VERBS) ?? []).length;
  const metricCount = (normalized.match(METRICS) ?? []).length;
  const hasGitHub = /github\.com\/[\w-]+/i.test(normalized);
  const hasLinkedIn = /linkedin\.com\/in\//i.test(normalized);
  const hasProjectLink = /https?:\/\/|\b(?:vercel|netlify|render)\.app\b/i.test(normalized);

  let score = 20;
  score += Math.min(sectionCount, 4) * 9;
  score += Math.min(actionVerbCount, 6) * 4;
  score += Math.min(metricCount, 5) * 5;
  score += hasGitHub ? 7 : 0;
  score += hasLinkedIn ? 5 : 0;
  score += hasProjectLink ? 6 : 0;
  score += wordCount >= 250 && wordCount <= 900 ? 6 : wordCount > 100 ? 2 : 0;

  const improvements: string[] = [];
  if (sectionCount < 4) improvements.push("Use clear headings for contact details, education, technical skills, and projects or experience.");
  if (metricCount < 2) improvements.push("Rewrite at least two bullets with measurable outcomes: users, latency, accuracy, revenue, or time saved.");
  if (actionVerbCount < 3) improvements.push("Lead project bullets with strong action verbs such as Built, Improved, Deployed, or Optimized.");
  if (!hasGitHub) improvements.push("Add a public GitHub link so recruiters can verify the code behind your projects.");
  if (!hasProjectLink) improvements.push("Add a deployed demo or portfolio URL beside your strongest project.");
  if (wordCount < 250) improvements.push("Add enough specific project and impact detail for a recruiter to assess your work.");
  if (wordCount > 900) improvements.push("Trim this to one focused page; prioritize recent, relevant work and measurable impact.");

  return {
    atsScore: clamp(score),
    roastLine:
      score < 55
        ? "Your resume has potential, but it is still making recruiters hunt for proof."
        : score < 75
          ? "The foundation is credible; now make the impact of each project impossible to miss."
          : "This is recruiter-readable. Keep the proof sharp and the claims specific.",
    improvements: improvements.slice(0, 5).length
      ? improvements.slice(0, 5)
      : ["Keep tailoring keywords and measurable outcomes to the role you are applying for."],
    analysisSummary: `Reviewed ${wordCount} words across ${sectionCount} core resume sections.`,
    analyzedWords: wordCount,
  };
}
