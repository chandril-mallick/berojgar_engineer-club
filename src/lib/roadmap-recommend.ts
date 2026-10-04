import type { ScoreResult } from "@/types";

export type Dimension = "dsa" | "projects" | "resume" | "interview" | "general";

export function getWeakestDimension(score: ScoreResult | null): Dimension {
  if (!score) return "general";

  // Use breakdown if available
  if (score.breakdown) {
    const { dsa, projects, resume, interview } = score.breakdown;
    const minScore = Math.min(dsa, projects, resume, interview);
    if (minScore === dsa) return "dsa";
    if (minScore === projects) return "projects";
    if (minScore === resume) return "resume";
    if (minScore === interview) return "interview";
  }

  // Fallback to biggestGap matching
  const gap = (score.biggestGap || "").toLowerCase();
  if (gap.includes("dsa") || gap.includes("algorithm")) return "dsa";
  if (gap.includes("project") || gap.includes("portfolio")) return "projects";
  if (gap.includes("resume") || gap.includes("profile")) return "resume";
  if (gap.includes("interview") || gap.includes("communication")) return "interview";
  
  // Fallback to weaknesses array matching
  if (score.weaknesses && score.weaknesses.length > 0) {
     const w = score.weaknesses.join(" ").toLowerCase();
     if (w.includes("dsa")) return "dsa";
     if (w.includes("project")) return "projects";
     if (w.includes("resume") || w.includes("ats")) return "resume";
     if (w.includes("interview")) return "interview";
  }

  return "general";
}

export function recommendTrack(score: ScoreResult | null): { trackId: string | null; reason: string | null; weakestDimension: Dimension } {
  if (!score) {
    return { trackId: null, reason: null, weakestDimension: "general" };
  }

  const dim = getWeakestDimension(score);
  
  if (dim === "dsa") {
    return { trackId: "90-day-sde", reason: "Your DSA foundation is your lowest dimension — start here.", weakestDimension: dim };
  }
  if (dim === "projects") {
    return { trackId: "fullstack-web", reason: "Your Project depth is your lowest dimension — build proof of work here.", weakestDimension: dim };
  }
  if (dim === "resume" || dim === "interview") {
    return { trackId: "company-speedrun", reason: "Your Resume/Interview readiness is lowest — target specific companies here.", weakestDimension: dim };
  }

  return { trackId: "90-day-sde", reason: "Let's build your fundamentals first.", weakestDimension: dim };
}
