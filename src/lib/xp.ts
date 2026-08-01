import { XPAction, UserXP, XPHistoryItem } from "@/types";

export const XP_REWARDS: Record<XPAction, number> = {
  assessment_complete: 75,
  resume_upload: 100,
  daily_login: 20,
  challenge_complete: 50,
  github_connect: 100,
  linkedin_connect: 75,
  mock_interview: 150,
  referral: 300,
  resume_improved: 200,
};

export const XP_LEVELS = [
  { level: 1, min: 0, max: 499, title: "Freshly Berojgar" },
  { level: 2, min: 500, max: 1499, title: "Code Curious" },
  { level: 3, min: 1500, max: 2999, title: "Side Project Guy" },
  { level: 4, min: 3000, max: 5999, title: "Interview Ready" },
  { level: 5, min: 6000, max: 9999, title: "Almost There" },
  { level: 6, min: 10000, max: Infinity, title: "Placement Slayer" },
];

export interface LevelPerk {
  id: string;
  levelRequired: number;
  title: string;
  description: string;
  emoji: string;
  code?: string;
}

export const LEVEL_PERKS: LevelPerk[] = [
  {
    id: "perk-level-1",
    levelRequired: 1,
    title: "Official Reality Check Access",
    description: "Full diagnostic assessment & Berojgar Score certificate generator.",
    emoji: "🎓",
    code: "BEC-WELCOME-2026",
  },
  {
    id: "perk-level-2",
    levelRequired: 2,
    title: "NVIDIA Nemotron Custom Roast",
    description: "Unlimited AI resume roasting and ATS optimization hints.",
    emoji: "🔥",
    code: "ROAST-MASTER-70B",
  },
  {
    id: "perk-level-3",
    levelRequired: 3,
    title: "24/7 AI Career Coach Unlimited",
    description: "Unlimited 1-on-1 interview prep & negotiation queries.",
    emoji: "⚡",
    code: "COACH-VIP-UNLIMITED",
  },
  {
    id: "perk-level-4",
    levelRequired: 4,
    title: "Priority Recruiter Spotlight",
    description: "Your profile pinned on the BEC Hiring Partners Board for partner startups.",
    emoji: "🚀",
    code: "RECRUITER-SPOTLIGHT-PASSH",
  },
  {
    id: "perk-level-5",
    levelRequired: 5,
    title: "BEC Verified Placement Badge",
    description: "Gold verified seal on your profile & certificate.",
    emoji: "👑",
    code: "VERIFIED-SLAYER-2026",
  },
  {
    id: "perk-level-6",
    levelRequired: 6,
    title: "Lifetime Founders & SDE Alumni Club",
    description: "Direct referral access to tier-1 tech alumni & founders network.",
    emoji: "🏆",
    code: "ALUMNI-FOUNDER-LEGEND",
  },
];

export const DEFAULT_USER_XP: UserXP = {
  total: 0,
  streak: 0,
  lastLoginDate: "",
  earnedBadgeIds: [],
  completedChallengeIds: [],
  claimedPerkIds: [],
  history: [
    {
      id: "hist-init",
      action: "daily_login",
      title: "Joined Berojgar Engineer Club",
      xp: 20,
      timestamp: "Just now",
    },
  ],
};

export function getLevelInfo(xp: number) {
  return (
    XP_LEVELS.find((l) => xp >= l.min && xp <= l.max) ??
    XP_LEVELS[XP_LEVELS.length - 1]
  );
}

export function getLevelProgress(xp: number): number {
  const level = getLevelInfo(xp);
  if (level.max === Infinity) return 100;
  const range = level.max - level.min;
  const progress = xp - level.min;
  return Math.round((progress / range) * 100);
}

export function awardXP(action: XPAction, currentXP: UserXP, titleOverride?: string): UserXP {
  const earned = XP_REWARDS[action] || 50;
  const formattedActionTitle =
    titleOverride ||
    action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const newHistoryItem: XPHistoryItem = {
    id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action,
    title: formattedActionTitle,
    xp: earned,
    timestamp: "Just now",
  };

  const existingHistory = currentXP.history || [];

  return {
    ...currentXP,
    total: currentXP.total + earned,
    history: [newHistoryItem, ...existingHistory].slice(0, 30),
  };
}

export function processLogin(currentXP: UserXP): { xp: UserXP; streakBroken: boolean; awardedXP: number } {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  const alreadyLoggedIn = currentXP.lastLoginDate === today;
  if (alreadyLoggedIn) return { xp: currentXP, streakBroken: false, awardedXP: 0 };

  const isConsecutive = currentXP.lastLoginDate === yesterday;
  const newStreak = isConsecutive ? currentXP.streak + 1 : 1;
  const earnedXP = XP_REWARDS.daily_login;

  const newHistoryItem: XPHistoryItem = {
    id: `hist-login-${Date.now()}`,
    action: "daily_login",
    title: `Daily Check-In (Day ${newStreak} Streak)`,
    xp: earnedXP,
    timestamp: "Just now",
  };

  const existingHistory = currentXP.history || [];

  return {
    xp: {
      ...currentXP,
      total: currentXP.total + earnedXP,
      streak: newStreak,
      lastLoginDate: today,
      history: [newHistoryItem, ...existingHistory].slice(0, 30),
    },
    streakBroken: !isConsecutive && currentXP.streak > 0,
    awardedXP: earnedXP,
  };
}

export function claimPerk(perkId: string, currentXP: UserXP): UserXP {
  const alreadyClaimed = (currentXP.claimedPerkIds || []).includes(perkId);
  if (alreadyClaimed) return currentXP;

  return {
    ...currentXP,
    claimedPerkIds: [...(currentXP.claimedPerkIds || []), perkId],
  };
}
