export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";
export type XPAction =
  | "assessment_complete"
  | "resume_upload"
  | "daily_login"
  | "challenge_complete"
  | "github_connect"
  | "linkedin_connect"
  | "mock_interview"
  | "referral"
  | "resume_improved";

export interface AssessmentInput {
  college: string;
  branch: string;
  year: string;
  cgpa: number;
  projects: number;
  internships: number;
  github: string;
  linkedin: string;
  dsa: number;
  communication: number;
  targetCompany: string;
  topProject?: string;
  keyAchievement?: string;
  interviewConfidence?: number;
  targetRole?: string;
}

export interface ScoreResult {
  score: number;
  riskLevel: RiskLevel;
  roast: string;
  strengths: string[];
  weaknesses: string[];
  placementProbability?: number;
  salaryPredictionLpa?: number;
  careerType: string;
  breakdown?: {
    dsa: number;
    projects: number;
    resume: number;
    interview: number;
  };
  biggestGap?: string;
  strongestArea?: string;
  summaryExplanation?: string;
}

export interface ResumeRoastResult {
  atsScore: number;
  roastLine: string;
  improvements: string[];
  analysisSummary?: string;
  analyzedWords?: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  xpReward: number;
  rarity: BadgeRarity;
  perk?: string;
  category?: string;
}

export interface XPHistoryItem {
  id: string;
  action: XPAction | string;
  title: string;
  xp: number;
  timestamp: string;
}

export interface UserXP {
  total: number;
  streak: number;
  lastLoginDate: string; // YYYY-MM-DD
  earnedBadgeIds: string[];
  completedChallengeIds: string[];
  claimedPerkIds?: string[];
  history?: XPHistoryItem[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  college: string;
  branch: string;
  state: string;
  year: string;
  score: number;
  projects: number;
  xp: number;
  offer: string | null;
  badgeIds: string[];
  avatarColor: string;
  avatarUrl?: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: "dsa" | "project" | "interview" | "networking" | "resume";
}

export interface SocialProofEntry {
  name: string;
  college?: string;
  branch?: string;
  beforeScore: number;
  afterScore: number;
  company: string;
  role: string;
  avatarUrl?: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  college: string;
  title: string;
  replies: number;
  timeAgo: string;
  tag: string;
}
