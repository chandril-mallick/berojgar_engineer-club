"use server";

import fs from "fs";
import path from "path";
import { RealWorldDSAChallenge, REAL_WORLD_DSA_CHALLENGES } from "@/lib/real-world-dsa-data";

export async function getDSAChallenges(): Promise<RealWorldDSAChallenge[]> {
  try {
    const CACHE_FILE = path.join(process.cwd(), "codeforces_cache.json");
    if (fs.existsSync(CACHE_FILE)) {
      const fileContent = fs.readFileSync(CACHE_FILE, "utf-8");
      const codeforcesQuestions: RealWorldDSAChallenge[] = JSON.parse(fileContent);
      
      // Merge with static dataset. Codeforces first!
      return [...codeforcesQuestions, ...REAL_WORLD_DSA_CHALLENGES];
    }
  } catch (e) {
    console.error("Failed to read Codeforces cache", e);
  }

  // Fallback to static
  return REAL_WORLD_DSA_CHALLENGES;
}
