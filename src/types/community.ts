export type CollegeType = "IIT" | "NIT" | "IIIT" | "Government" | "Private" | "University";

export interface CollegeStudent {
  id: string;
  name: string;
  avatarColor: string;
  branch: string;
  year: string;
  score: number;
  xp: number;
  placedCompany?: string;
  githubUser?: string;
}

export interface CollegeOffer {
  id: string;
  studentName: string;
  company: string;
  logo: string;
  role: string;
  packageLpa: number;
  branch: string;
  date: string;
}

export interface CollegeEvent {
  id: string;
  title: string;
  date: string;
  type: "Hackathon" | "Placement Drive" | "Tech Fest" | "AMA" | "Workshop";
  organizer: string;
}

export interface CollegeRankEntry {
  id: string;
  name: string;
  state: string;
  city: string;
  type: CollegeType;
  logoEmoji: string;
  shortCode?: string;
  badgeColor?: string;
  overallRank: number;
  nirfRank: number;
  avgBerojgarScore: number;
  placementRate: number; // percentage e.g. 88
  avgPackageLpa: number; // LPA e.g. 14.5
  activeMembers: number;
  avgResumeScore: number;
  interviewSuccessRate: number; // percentage
  codingChallengeScore: number;
  description: string;
  website: string;
  topPerformers: CollegeStudent[];
  recentOffers: CollegeOffer[];
  upcomingEvents: CollegeEvent[];
  githubActivityCount: number;
}

export interface CompanyPrepInfo {
  id: string;
  slug: string;
  name: string;
  logo: string;
  logoUrl?: string;
  badgeColor?: string;
  category: "MAANG / Big Tech" | "AI & Frontier Labs" | "Global Tech Giant" | "Product Unicorn" | "IT Services / Consulting" | "FinTech / High Frequency";
  difficulty: "Easy" | "Medium" | "Hard" | "Brutal";
  avgSalaryLpa: {
    base: number;
    totalCtc: number;
  };
  hiringProcess: {
    step: number;
    title: string;
    description: string;
  }[];
  interviewRounds: {
    name: string;
    focus: string;
    duration: string;
  }[];
  faqs: { question: string; answer: string }[];
  oaQuestions: {
    title: string;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
    frequency: string;
  }[];
  resumeTips: string[];
  recentExperiencesCount: number;
  openPositionsCount: number;
  requiredSkills: string[];
  preparationRoadmap: string[];
}

export interface HackathonTeamRequest {
  id: string;
  authorName: string;
  college: string;
  rolesNeeded: string[];
  pitch: string;
  contact: string;
}

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  logoEmoji: string;
  mode: "Online" | "Offline" | "Hybrid";
  location: string;
  tags: string[]; // AI, Blockchain, Cyber Security, Open Source, Flutter, Web
  prizeMoney: string;
  registrationDeadline: string; // YYYY-MM-DD
  startDate: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  registeredCount: number;
  overview: string;
  timeline: { date: string; title: string }[];
  prizes: { rank: string; amount: string }[];
  resources: { name: string; url: string }[];
  previousWinners: { teamName: string; project: string; year: string }[];
  teamRequests: HackathonTeamRequest[];
  discussions: { author: string; text: string; timeAgo: string }[];
}

export interface ReferralListing {
  id: string;
  referrerName: string;
  company: string;
  role: string;
  experienceYears: number;
  avatarColor: string;
  availableLimitMonthly: number;
  usedThisMonth: number;
  preferredSkills: string[];
  notes: string;
}

export interface StudentReferralRequest {
  id: string;
  listingId: string;
  company: string;
  role: string;
  studentName: string;
  college: string;
  branch: string;
  cgpa: number;
  resumeUrl: string;
  portfolioUrl: string;
  message: string;
  status: "Pending" | "Accepted" | "Rejected" | "Completed";
  updatedAt: string;
}

export interface MemeItem {
  id: string;
  author: string;
  college: string;
  avatarColor: string;
  caption: string;
  imageUrl?: string;
  category: "Placement" | "Coding" | "Exam" | "Hostel" | "Interview" | "Internship" | "Confession";
  likes: number;
  commentsCount: number;
  shares: number;
  timeAgo: string;
  isConfession?: boolean;
  comments?: { id: string; author: string; text: string; timeAgo: string }[];
}

export interface AnonymousPlacementStory {
  id: string;
  category: "Placement Experience" | "Interview Experience" | "Ghosted by HR" | "Offer Revoked" | "Dream Job" | "Rejected Story" | "Funny Story" | "Lessons Learned";
  title: string;
  content: string;
  company: string;
  branch: string;
  role: string;
  college: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Brutal";
  upvotes: number;
  reactions: {
    cry: number;
    skull: number;
    rocket: number;
    clown: number;
    clap: number;
  };
  commentsCount: number;
  timeAgo: string;
}

export interface OfferWallPost {
  id: string;
  studentName: string;
  avatarColor: string;
  college: string;
  branch: string;
  company: string;
  logo: string;
  role: string;
  packageLpa: number;
  offerDate: string;
  prepTimeMonths: number;
  journey: string;
  resourcesUsed: string[];
  resumeHighlights: string[];
  congratulationsCount: number;
  questionsCount: number;
}

export interface InterviewQuestion {
  id: string;
  company: string;
  role: string;
  roundType: "Coding" | "HR" | "Technical" | "System Design" | "OA";
  title: string;
  description: string;
  codeSnippet?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeTakenMinutes: number;
  outcome: "Selected" | "Rejected" | "Waiting";
  submittedTime: string;
}

export interface DailyChallengeSet {
  date: string;
  dsa: {
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
    codeTemplate: string;
    starterCode?: Record<number, string>;
    testCases: { input: string; output: string }[];
    solutionExplanation: string;
  };
  aptitude: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  sql: {
    question: string;
    schema: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  csMcq: {
    question: string;
    subject: "OS" | "DBMS" | "Computer Networks" | "System Design";
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  aiMcq: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ProjectShowcaseItem {
  id: string;
  authorName: string;
  authorCollege: string;
  avatarColor: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  techStack: string[];
  likes: number;
  forks: number;
  commentsCount: number;
  timeAgo: string;
}

export interface OpenSourceRepo {
  id: string;
  name: string;
  owner: string;
  language: "Python" | "JavaScript" | "Java" | "React" | "Next.js" | "Flutter" | "Rust" | "Go";
  description: string;
  stars: number;
  goodFirstIssues: number;
  badgeReward: string;
  repoUrl: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  category: "GATE CSE" | "DSA Preparation" | "Google Interview" | "Flutter" | "React" | "Machine Learning" | "System Design" | "Operating Systems";
  emoji: string;
  description: string;
  membersCount: number;
  activeVoiceUsers: number;
  discussions: { author: string; text: string; timeAgo: string }[];
  resources: { title: string; link: string; type: string }[];
  upcomingEvents: { title: string; time: string }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "rank" | "referral" | "score" | "hackathon" | "job" | "badge";
  timeAgo: string;
  read: boolean;
  link?: string;
}
