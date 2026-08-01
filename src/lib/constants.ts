export const PRIMARY_NAV_LINKS = [
  { href: "/assessment", label: "Reality Check" },
  { href: "/colleges", label: "Colleges" },
  { href: "/companies", label: "Companies" },
  { href: "/hackathons", label: "Hackathons" },
  { href: "/referrals", label: "Referrals" },
];

export const MORE_NAV_LINKS = [
  { href: "/tasks", label: "Task Manager", desc: "Engineering work & task tracker" },
  { href: "/projects", label: "Projects", desc: "Showcase & explore builds" },
  { href: "/daily-challenge", label: "Daily Grind", desc: "Daily DSA & dev tasks" },
  { href: "/study-groups", label: "Study Groups", desc: "Peer learning & group prep" },
  { href: "/memes", label: "Memes & Stories", desc: "Engineering humor & stories" },
  { href: "/leaderboard", label: "Leaderboard", desc: "Rankings & student XP" },
];

export const NAV_LINKS = [...PRIMARY_NAV_LINKS, ...MORE_NAV_LINKS];


export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/berojgar-engineer-club/",
  reddit: "https://www.reddit.com/r/BerojgarEngineerClub/",
  instagram: "https://www.instagram.com/berojgarengineerclub/",
  whatsapp: "https://whatsapp.com/channel/0029Vagowl0HwXb7IADdPJ3A",
};

export const VIRAL_LINES = [
  "I am only {score}% Berojgar 😂 Can you beat me?",
  "Reality check dropped: {score}/100. Recruiters, please hold your laughter.",
  "From sem break to career break? Not today. Berojgar Score: {score}/100.",
  "My HR interview chances: {score}%. Time to grind. berojgarengineer.club",
];

export const ROADMAP_ITEMS = [
  { title: "DSA Sprint", detail: "45 min/day for arrays, strings, trees." },
  { title: "Project Polish", detail: "Ship one end-to-end project in 21 days." },
  { title: "Interview English", detail: "Record mock intro daily for 7 days." },
  { title: "LinkedIn Hygiene", detail: "Rebuild headline + feature top project." },
];

export const PLACEMENT_TRENDS = [
  { day: "Mon", score: 38 },
  { day: "Tue", score: 44 },
  { day: "Wed", score: 49 },
  { day: "Thu", score: 58 },
  { day: "Fri", score: 62 },
  { day: "Sat", score: 66 },
  { day: "Sun", score: 71 },
];

export const WHY_REJECTED = [
  { no: "01", reason: "Resume looks like a government form from 2014." },
  { no: "02", reason: "GitHub profile last updated: 'before you were born'." },
  { no: "03", reason: "Projects listed but zero live links or demos." },
  { no: "04", reason: "DSA prep = watching 3-hour YouTube videos without practicing." },
  { no: "05", reason: "Introduction filled with generic buzzwords like 'passionate technology enthusiast' without proof." },
  { no: "06", reason: "CGPA 7.8 but zero problem-solving proof outside exams." },
];

export const FAQ_ITEMS = [
  {
    q: "Is this free?",
    a: "Yes. The reality check, resume roast, and basic roadmap are completely free. BEC Pro unlocks unlimited roasts, AI mock interviews, and company-specific prep.",
  },
  {
    q: "Do I need to create an account?",
    a: "Nope. Your assessment and score are saved locally. Create an account to unlock the leaderboard, XP system, badges, and community features.",
  },
  {
    q: "How accurate is the Berojgar Score?",
    a: "Brutally. The score weights DSA prep, projects, internships, GitHub presence, and LinkedIn visibility — the exact things recruiters check. It's not perfect, but it's more honest than your relatives.",
  },
  {
    q: "Can this get me a job?",
    a: "We can't place you. But we can tell you exactly what's stopping you from getting placed — and that's 80% of the battle.",
  },
];
