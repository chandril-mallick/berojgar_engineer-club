import { BadgeDefinition, UserXP } from "@/types";

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: "first-blood",
    name: "First Blood",
    description: "Completed your first reality check assessment.",
    emoji: "⚡",
    xpReward: 50,
    rarity: "common",
  },
  {
    id: "resume-warrior",
    name: "Resume Warrior",
    description: "Uploaded your resume for an AI roast.",
    emoji: "📄",
    xpReward: 75,
    rarity: "common",
  },
  {
    id: "dsa-hero",
    name: "DSA Hero",
    description: "Rated your DSA confidence above 7/10.",
    emoji: "🧠",
    xpReward: 100,
    rarity: "rare",
  },
  {
    id: "github-beast",
    name: "GitHub Beast",
    description: "Connected your GitHub profile.",
    emoji: "🐙",
    xpReward: 100,
    rarity: "rare",
  },
  {
    id: "placement-slayer",
    name: "Placement Slayer",
    description: "Achieved an employability score above 80.",
    emoji: "🔥",
    xpReward: 200,
    rarity: "epic",
  },
  {
    id: "night-coder",
    name: "Night Coder",
    description: "Completed the assessment after 11 PM.",
    emoji: "🌙",
    xpReward: 75,
    rarity: "rare",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintained a 7-day login streak.",
    emoji: "📆",
    xpReward: 150,
    rarity: "rare",
  },
  {
    id: "streak-30",
    name: "100-Day Club",
    description: "Maintained a 30-day login streak.",
    emoji: "🏅",
    xpReward: 500,
    rarity: "legendary",
  },
  {
    id: "top-1-percent",
    name: "Top 1%",
    description: "Scored above 90 — you absolute beast.",
    emoji: "👑",
    xpReward: 300,
    rarity: "legendary",
  },
  {
    id: "referral-king",
    name: "Referral King",
    description: "Referred 3+ friends to BEC.",
    emoji: "🤝",
    xpReward: 250,
    rarity: "epic",
  },
  {
    id: "interview-master",
    name: "Interview Master",
    description: "Completed a mock interview session.",
    emoji: "🎤",
    xpReward: 150,
    rarity: "epic",
  },
  {
    id: "overachiever",
    name: "Overachiever",
    description: "Score > 75 AND Resume ATS > 70. Recruiter's nightmare.",
    emoji: "🚀",
    xpReward: 350,
    rarity: "legendary",
  },
];

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return ALL_BADGES.find((b) => b.id === id);
}

export const RARITY_COLORS: Record<BadgeDefinition["rarity"], string> = {
  common: "text-muted bg-muted-bg",
  rare: "text-link bg-link/10",
  epic: "text-[#9333ea] bg-[#9333ea]/10",
  legendary: "text-brand bg-brand/15",
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
