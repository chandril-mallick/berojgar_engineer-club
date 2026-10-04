import { BadgeDefinition, UserXP } from "@/types";

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: "first-blood",
    name: "BEC Reality Check Slayer",
    description: "Completed your first brutal Berojgar Score diagnostic assessment.",
    emoji: "⚡",
    xpReward: 50,
    rarity: "common",
    category: "Assessment",
    perk: "Unlocks official career readiness report & cert generator.",
  },
  {
    id: "resume-warrior",
    name: "AI Resume Roast Survivor",
    description: "Uploaded your resume for AI roasting & ATS gap analysis.",
    emoji: "📄",
    xpReward: 75,
    rarity: "common",
    category: "Resume & Profile",
    perk: "Unlocks unlimited AI resume roasting & ATS optimization hints.",
  },
  {
    id: "dsa-hero",
    name: "Algorithm Architect",
    description: "Achieved DSA confidence score above 7/10 or solved 5+ real-world DSA labs.",
    emoji: "🧠",
    xpReward: 100,
    rarity: "rare",
    category: "DSA Lab",
    perk: "Unlocks advanced real-world system design lab scenarios.",
  },
  {
    id: "github-beast",
    name: "GitHub Proof Beast",
    description: "Connected verified GitHub profile with live repository proof.",
    emoji: "🐙",
    xpReward: 100,
    rarity: "rare",
    category: "Resume & Profile",
    perk: "Pinned profile on BEC verified developer directory for partner startups.",
  },
  {
    id: "placement-slayer",
    name: "Placement Slayer 80+",
    description: "Achieved a Berojgar Employability Score above 80/100.",
    emoji: "🔥",
    xpReward: 200,
    rarity: "epic",
    category: "Assessment",
    perk: "Direct referral queue priority & recruiter spotlight pin.",
  },
  {
    id: "night-coder",
    name: "Midnight Grind Legend",
    description: "Completed technical assessments or labs late past 11 PM.",
    emoji: "🌙",
    xpReward: 75,
    rarity: "rare",
    category: "Streaks",
    perk: "Exclusive Midnight Coder profile badge seal & nocturnal XP bonus.",
  },
  {
    id: "streak-7",
    name: "7-Day Grind Warrior",
    description: "Maintained a continuous 7-day daily grind streak.",
    emoji: "📆",
    xpReward: 150,
    rarity: "rare",
    category: "Streaks",
    perk: "+150 XP bonus & weekly streak multiplier bonus.",
  },
  {
    id: "streak-30",
    name: "30-Day Placement Titan",
    description: "Maintained a brutal 30-day daily grind streak.",
    emoji: "🏅",
    xpReward: 500,
    rarity: "legendary",
    category: "Streaks",
    perk: "+500 XP bonus & 30-Day Titan hall-of-fame placement.",
  },
  {
    id: "top-1-percent",
    name: "Top 1% Career Readiness",
    description: "Achieved an elite Berojgar Score above 90/100.",
    emoji: "👑",
    xpReward: 300,
    rarity: "legendary",
    category: "Assessment",
    perk: "Direct 1-on-1 SDE alumni referral & Founder office hours.",
  },
  {
    id: "referral-king",
    name: "Referral Network Legend",
    description: "Referred 3+ engineering peers to Berojgar Engineer Club.",
    emoji: "🤝",
    xpReward: 250,
    rarity: "epic",
    category: "Community",
    perk: "Top-tier priority placement referral queue status.",
  },
  {
    id: "interview-master",
    name: "STAR Mock Interviewer",
    description: "Completed a technical mock interview session with feedback.",
    emoji: "🎤",
    xpReward: 150,
    rarity: "epic",
    category: "Community",
    perk: "Access to AI Mock Technical Interviewer & behavioral drills.",
  },
  {
    id: "overachiever",
    name: "BEC Verified Slayer",
    description: "Score > 75 AND Resume ATS > 70 — complete recruiter magnet.",
    emoji: "🚀",
    xpReward: 350,
    rarity: "legendary",
    category: "Assessment",
    perk: "Gold Verified Seal on profile, card & certificate.",
  },
];

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return ALL_BADGES.find((b) => b.id === id);
}

export const RARITY_COLORS: Record<BadgeDefinition["rarity"], string> = {
  common: "text-slate-600 bg-slate-100 border-slate-300",
  rare: "text-[#0284c7] bg-sky-50 border-sky-300",
  epic: "text-[#9333ea] bg-purple-50 border-purple-300",
  legendary: "text-[#d97706] bg-amber-50 border-amber-300",
};

export function checkNewAchievements(
  userXP: UserXP,
  context: {
    score?: number;
    atsScore?: number;
    dsa?: number;
    hasGithub?: boolean;
  },
): string[] {
  const already = new Set(userXP.earnedBadgeIds);
  const newlyUnlocked: string[] = [];

  const unlock = (id: string) => {
    if (!already.has(id)) newlyUnlocked.push(id);
  };

  // Assessment done
  if (context.score !== undefined) unlock("first-blood");
  if ((context.score ?? 0) > 80) unlock("placement-slayer");
  if ((context.score ?? 0) > 90) unlock("top-1-percent");
  if ((context.dsa ?? 0) > 7) unlock("dsa-hero");

  // Night coder
  const hour = new Date().getHours();
  if (hour >= 23 || hour < 3) unlock("night-coder");

  // Resume
  if (context.atsScore !== undefined) unlock("resume-warrior");

  // Overachiever
  if ((context.score ?? 0) > 75 && (context.atsScore ?? 0) > 70) unlock("overachiever");

  // GitHub
  if (context.hasGithub) unlock("github-beast");

  // Streak
  if (userXP.streak >= 7) unlock("streak-7");
  if (userXP.streak >= 30) unlock("streak-30");

  return newlyUnlocked;
}
