import { RealWorldDSAChallenge } from "./real-world-dsa-data";

export interface CFProblem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  rating?: number;
  tags: string[];
}

export interface CFProblemStatistics {
  contestId: number;
  index: string;
  solvedCount: number;
}

export interface CFResponse {
  status: string;
  comment?: string;
  result?: {
    problems: CFProblem[];
    problemStatistics: CFProblemStatistics[];
  };
}

export async function fetchProblemset(): Promise<CFResponse> {
  const response = await fetch("https://codeforces.com/api/problemset.problems");
  if (!response.ok) {
    throw new Error(`Codeforces API error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

function mapTagsToCategory(tags: string[]): string {
  const tagMap: Record<string, string> = {
    "graphs": "Maps & Routing",
    "shortest paths": "Maps & Routing",
    "binary search": "Search & NLP",
    "string suffix structures": "Search & NLP",
    "strings": "Search & NLP",
    "dp": "System Design & Memory",
    "greedy": "Logistics & Dispatch",
    "data structures": "System Design & Memory",
  };

  for (const tag of tags) {
    if (tagMap[tag]) {
      return tagMap[tag];
    }
  }
  return "Algorithms & Problem Solving"; // default
}

export function normalizeProblem(
  cfProblem: CFProblem,
  stats?: CFProblemStatistics
): RealWorldDSAChallenge {
  let difficulty: "Easy" | "Medium" | "Hard" = "Hard";
  const rating = cfProblem.rating || 1500;
  
  if (rating <= 1200) {
    difficulty = "Easy";
  } else if (rating <= 1600) {
    difficulty = "Medium";
  }

  return {
    id: `CF-${cfProblem.contestId}${cfProblem.index}`,
    slug: `cf-${cfProblem.contestId}-${cfProblem.index.toLowerCase()}`, // we will treat Codeforces differently in the UI
    title: cfProblem.name,
    shortDescription: `Codeforces problem rated ${rating}`,
    category: mapTagsToCategory(cfProblem.tags),
    dsaConcept: cfProblem.tags.length > 0 ? cfProblem.tags.join(", ") : "Logic",
    difficulty,
    source: "codeforces",
    url: `https://codeforces.com/problemset/problem/${cfProblem.contestId}/${cfProblem.index}`,
    rating: cfProblem.rating,
    tags: cfProblem.tags,
    solvedCount: stats?.solvedCount || 0,
  };
}
