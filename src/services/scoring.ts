import { AssessmentInput, ResumeRoastResult, ScoreResult } from "@/types";

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function calculateBerojgarScore(payload: AssessmentInput): ScoreResult {
  const cgpaBoost = payload.cgpa * 6;
  const projectsBoost = payload.projects * 7;
  const internshipsBoost = payload.internships * 9;
  const dsaBoost = payload.dsa * 5;
  const communicationBoost = payload.communication * 5;
  const socialBoost =
    (payload.github === "yes" ? 6 : 0) + (payload.linkedin === "yes" ? 5 : 0);

  const rawScore =
    cgpaBoost +
    projectsBoost +
    internshipsBoost +
    dsaBoost +
    communicationBoost +
    socialBoost -
    (payload.year === "1" ? 8 : 0);

  const score = clamp(Math.round(rawScore / 4.2));
  const riskLevel = score < 45 ? "HIGH" : score < 70 ? "MEDIUM" : "LOW";

  const roastMap: Record<string, string> = {
    HIGH: "You are currently more prepared for watching placement reels than cracking interviews.",
    MEDIUM: "You are one focused sprint away from becoming HR's favorite candidate.",
    LOW: "Dangerously employable. Your relatives might stop asking \"job kab?\".",
  };

  return {
    score,
    riskLevel,
    roast: roastMap[riskLevel],
    strengths: [
      payload.projects > 1 ? "Hands-on project exposure" : "Starting to build project momentum",
      payload.communication > 6 ? "Good communication baseline" : "Willingness to improve communication",
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
  };
}

export function generateResumeRoast(fileName: string): ResumeRoastResult {
  const normalized = fileName.toLowerCase();
  const hasFinal = normalized.includes("final");
  const hasResume = normalized.includes("resume");
  const atsScore = clamp((hasResume ? 55 : 45) + (hasFinal ? 10 : 0));

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
