import { type LucideIcon, Target, Code2, Building2, Brain, Combine } from "lucide-react";

export interface RoadmapTask {
  id: string;
  text: string;
  link?: string;
  linkText?: string;
  targets: string[]; // e.g. ["dsa"], ["projects"], ["resume"], ["interview"]
}

export interface RoadmapStep {
  id: string;
  title: string;
  duration: string;
  tag: string;
  description: string;
  tasks: RoadmapTask[];
  proTip: string;
}

export interface RoadmapTrack {
  id: string;
  name: string;
  badge: string;
  icon: LucideIcon;
  description: string;
  targetRole: string;
  estimatedDuration: string;
  steps: RoadmapStep[];
}

export const ROADMAP_TRACKS: RoadmapTrack[] = [
  {
    id: "90-day-sde",
    name: "90-Day Placement Masterplan",
    badge: "Most Popular",
    icon: Target,
    description: "Brutal, zero-fluff 3-month action plan engineered for Tier-3 students to crack product SDE roles.",
    targetRole: "SDE-1 / Frontend / Backend Engineer",
    estimatedDuration: "12 Weeks (15-20 hrs/week)",
    steps: [
      {
        id: "step-1-dsa",
        title: "Phase 1: Core Problem Solving & DSA Sprints",
        duration: "Weeks 1 - 4",
        tag: "Foundation",
        description: "Master high-yield DSA patterns asked in 80%+ technical screening tests.",
        tasks: [
          { id: "task-dsa-1", text: "Master Arrays & HashMaps (Two Pointers, Sliding Window, Prefix Sum)", link: "/real-world-dsa", linkText: "Practice in Lab", targets: ["dsa"] },
          { id: "task-dsa-2", text: "Solve 25 High-Frequency Medium DSA problems independently", targets: ["dsa"] },
          { id: "task-dsa-3", text: "Master Trees & Graphs (BFS/DFS traversal patterns)", link: "/daily-challenge", linkText: "Daily Grind", targets: ["dsa"] },
          { id: "task-dsa-4", text: "Time & Space complexity analysis for every solution (Big-O)", targets: ["dsa", "interview"] },
        ],
        proTip: "Do not watch 3-hour video tutorials without coding. Write code on paper or IDE within 20 mins."
      },
      {
        id: "step-2-project",
        title: "Phase 2: Production-Grade Project & GitHub Proof",
        duration: "Weeks 5 - 8",
        tag: "Proof of Work",
        description: "Build 1 non-generic, full-stack application that recruiters can actually test live.",
        tasks: [
          { id: "task-proj-1", text: "Ship a full-stack project with Auth, DB, and live API endpoints", targets: ["projects"] },
          { id: "task-proj-2", text: "Deploy live demo on Vercel/Render with custom domain or HTTPS", targets: ["projects"] },
          { id: "task-proj-3", text: "Write impressive GitHub README with Architecture Diagram & Setup Guide", targets: ["projects"] },
          { id: "task-proj-4", text: "Record 90-second video demo walk-through for LinkedIn", targets: ["projects", "resume"] },
        ],
        proTip: "Avoid generic Todo Apps or Weather Apps. Build tools that solve real problems (e.g. queue managers, analytics dashboards)."
      },
      {
        id: "step-3-resume",
        title: "Phase 3: Resume Roast & ATS System Optimization",
        duration: "Weeks 9 - 10",
        tag: "Packaging",
        description: "Transform your resume into a recruiter magnet scoring 85+ on ATS metrics.",
        tasks: [
          { id: "task-res-1", text: "Run BEC AI Resume Roast & fix all flagged high-risk issues", link: "/resume", linkText: "Roast Resume", targets: ["resume"] },
          { id: "task-res-2", text: "Format bullets using X-Y-Z formula: Accomplished [X] measured by [Y] using [Z]", targets: ["resume"] },
          { id: "task-res-3", text: "Ensure single-page clean Single-Column layout (no double columns)", targets: ["resume"] },
          { id: "task-res-4", text: "Hyperlink live GitHub repos and live project URLs directly", targets: ["resume", "projects"] },
        ],
        proTip: "Recruiters spend only 6 seconds on initial scanning. Keep metrics bold and quantifiable."
      },
      {
        id: "step-4-interviews",
        title: "Phase 4: Cold Outreach & Mock Interview Velocity",
        duration: "Weeks 11 - 12",
        tag: "Conversion",
        description: "Convert preparation into interview calls via targeted reachouts & STAR storytelling.",
        tasks: [
          { id: "task-int-1", text: "Prepare 5 STAR stories for behavioral & leadership rounds", targets: ["interview"] },
          { id: "task-int-2", text: "Send 10 targeted referral requests daily to SDE-1 alumni on LinkedIn", link: "/referrals", linkText: "Referral Queue", targets: ["interview"] },
          { id: "task-int-3", text: "Conduct 3 mock technical interviews with peer feedback", targets: ["interview"] },
          { id: "task-int-4", text: "Maintain daily application tracking sheet (Applied, Follow-up, Interview)", targets: ["resume", "interview"] },
        ],
        proTip: "Never send generic 'Hi sir give referral' messages. Send a 3-line pitch + live link + job ID."
      }
    ]
  },
  {
    id: "fullstack-web",
    name: "Full-Stack Web Architecture Track",
    badge: "High Demand",
    icon: Code2,
    description: "Complete blueprint to become a production-ready Full Stack Engineer building modern web apps.",
    targetRole: "Frontend / Full-Stack Engineer (React, Node, Next.js)",
    estimatedDuration: "14 Weeks",
    steps: [
      {
        id: "fs-1",
        title: "Level 1: Modern Web Core & TypeScript Mastery",
        duration: "Weeks 1 - 3",
        tag: "Frontend Core",
        description: "Master modern HTML5, CSS layout engines, JavaScript ES6+ & strict TypeScript types.",
        tasks: [
          { id: "fs-task-1", text: "Deep dive into JS Async/Await, Event Loop, Closures, and Promises", targets: ["dsa", "interview"] },
          { id: "fs-task-2", text: "Convert JS codebase to strict TypeScript with interfaces & generics", targets: ["projects"] },
          { id: "fs-task-3", text: "Master TailwindCSS responsive layouts & modern CSS grid/flexbox", targets: ["projects"] },
        ],
        proTip: "TypeScript is standard in product teams. Avoid `any` types at all costs."
      },
      {
        id: "fs-2",
        title: "Level 2: Next.js App Router & Full Stack Data Layer",
        duration: "Weeks 4 - 8",
        tag: "Framework & DB",
        description: "Build high-performance web apps with Server Components, Server Actions, & Relational DBs.",
        tasks: [
          { id: "fs-task-4", text: "Master Next.js App Router, Server Components, and API Routes", targets: ["projects"] },
          { id: "fs-task-5", text: "Design Relational Schema in PostgreSQL using Prisma/Drizzle ORM", targets: ["projects"] },
          { id: "fs-task-6", text: "Implement OAuth2 & JWT Session Authentication securely", targets: ["projects"] },
        ],
        proTip: "Understand client vs server component boundaries in Next.js to avoid bundle size bloat."
      },
      {
        id: "fs-3",
        title: "Level 3: Scalability, Caching & DevOps",
        duration: "Weeks 9 - 14",
        tag: "Production Ready",
        description: "Scale applications with Redis caching, WebSockets, Docker, and CI/CD pipelines.",
        tasks: [
          { id: "fs-task-7", text: "Add Redis layer for rate-limiting and query result caching", targets: ["projects"] },
          { id: "fs-task-8", text: "Containerize application using Docker multi-stage builds", targets: ["projects"] },
          { id: "fs-task-9", text: "Set up automated GitHub Actions workflow for linting, testing & deployment", targets: ["projects"] },
        ],
        proTip: "Deploying a containerized app demonstrates mid-level engineering maturity to hiring managers."
      }
    ]
  },
  {
    id: "company-speedrun",
    name: "Target Company Playbooks",
    badge: "Company Specific",
    icon: Building2,
    description: "Tailored preparation strategies for Tier-1 Product Tech, High-Growth Startups & IT Services.",
    targetRole: "Amazon, Swiggy, Razorpay, Infosys SP, TCS Digital",
    estimatedDuration: "4 - 8 Weeks",
    steps: [
      {
        id: "comp-1",
        title: "Tier-1 Product Giants (Amazon, Swiggy, Flipkart)",
        duration: "4 - 6 Weeks",
        tag: "Product Tech",
        description: "Focused strategy for heavy DSA screenings, System Design basics, & STAR interviews.",
        tasks: [
          { id: "comp-task-1", text: "Solve Top 50 Amazon/Swiggy tagged DSA questions (PriorityQueue, Trees, BFS)", targets: ["dsa", "interview"] },
          { id: "comp-task-2", text: "Draft 2 STAR stories for each Leadership Principle (Customer Obsession, Ownership)", targets: ["interview", "resume"] },
          { id: "comp-task-3", text: "Study High Level Design basics: Load Balancers, Database Sharding, Caching", targets: ["interview", "projects"] },
        ],
        proTip: "At Amazon, behavioral questions carry equal weight as coding. Prepare structured STAR responses."
      },
      {
        id: "comp-2",
        title: "High-Growth Startups (Razorpay, Zerodha, CRED)",
        duration: "3 - 4 Weeks",
        tag: "Speed & Execution",
        description: "Cracking fast-paced startups where live execution & GitHub proof matter most.",
        tasks: [
          { id: "comp-task-4", text: "Build a mini project demonstrating clean architecture & unit tests", targets: ["projects"] },
          { id: "comp-task-5", text: "Practice machine coding rounds (build a feature live in 90 minutes)", targets: ["projects", "interview"] },
          { id: "comp-task-6", text: "Direct message CTOs / Tech Leads on X/LinkedIn with specific code feedback", targets: ["interview", "resume"] },
        ],
        proTip: "Startups care about how fast you ship high-quality code. Show live links and clean code repos."
      },
      {
        id: "comp-3",
        title: "Service Giants Premium Track (Infosys SP, TCS Digital, Wipro Turbo)",
        duration: "2 - 3 Weeks",
        tag: "Mass Recruiter Premium",
        description: "Target 7-10 LPA premium roles in service companies via special coding contests.",
        tasks: [
          { id: "comp-task-7", text: "Master SQL queries (Joins, Aggregations, Group By, Subqueries)", targets: ["dsa", "interview"] },
          { id: "comp-task-8", text: "Solve HackWithInfy / TCS CodeVita previous year advanced coding problems", targets: ["dsa"] },
          { id: "comp-task-9", text: "Brush up Core CS fundamentals (OOPs, DBMS, Operating Systems, Computer Networks)", targets: ["interview"] },
        ],
        proTip: "InfyTQ / HackWithInfy top performers skip standard rounds directly to 9.5 LPA SP interviews."
      }
    ]
  },
  {
    id: "ai-ml-track",
    name: "AI/ML Engineering Track",
    badge: "Trending",
    icon: Brain,
    description: "Go from pure math foundations to deploying GenAI models and MLOps pipelines.",
    targetRole: "ML Engineer / AI Researcher / Data Scientist",
    estimatedDuration: "16 Weeks",
    steps: [
      {
        id: "aiml-1",
        title: "Phase 1: Math Foundations & Core Python",
        duration: "Weeks 1 - 4",
        tag: "Math & Code",
        description: "Build intuition for Linear Algebra, Calculus, and Data Manipulation.",
        tasks: [
          { id: "aiml-task-1", text: "Master Python data manipulation (NumPy, Pandas vectorized operations)", targets: ["dsa"] },
          { id: "aiml-task-2", text: "Study Linear Algebra (Matrices, Eigenvalues, SVD) & Multivariable Calculus", targets: ["dsa"] },
          { id: "aiml-task-3", text: "Understand Probability, Bayes Theorem, and Statistical Distributions", targets: ["dsa", "interview"] }
        ],
        proTip: "Don't just use standard libraries blindly. Try writing simple matrix multiplication from scratch to build intuition."
      },
      {
        id: "aiml-2",
        title: "Phase 2: Machine Learning & Deep Learning (PyTorch)",
        duration: "Weeks 5 - 10",
        tag: "Model Training",
        description: "Train classic ML models and transition into Deep Neural Networks.",
        tasks: [
          { id: "aiml-task-4", text: "Build regression/classification models using Scikit-Learn", targets: ["projects"] },
          { id: "aiml-task-5", text: "Master PyTorch basics (Tensors, Autograd, Custom Datasets)", targets: ["projects"] },
          { id: "aiml-task-6", text: "Train a CNN from scratch on a custom image dataset", targets: ["projects"] }
        ],
        proTip: "PyTorch is the industry standard for ML research and GenAI. Invest deeply in understanding its computation graphs."
      },
      {
        id: "aiml-3",
        title: "Phase 3: GenAI, LLMs, and RAG",
        duration: "Weeks 11 - 14",
        tag: "Cutting Edge",
        description: "Work with foundation models, vector databases, and prompt engineering.",
        tasks: [
          { id: "aiml-task-7", text: "Build a full RAG (Retrieval-Augmented Generation) pipeline using LangChain/LlamaIndex", targets: ["projects", "interview"] },
          { id: "aiml-task-8", text: "Finetune a small LLM (e.g. LLaMA 3 8B) using LoRA / QLoRA on a custom dataset", targets: ["projects"] },
          { id: "aiml-task-9", text: "Deploy an API that serves your LLM securely", targets: ["projects", "resume"] }
        ],
        proTip: "RAG is the most highly demanded GenAI skill right now. Build one that parses PDFs or GitHub repos."
      }
    ]
  },
  {
    id: "core-to-it",
    name: "Core to IT Switch (ECE/Mech/Civil)",
    badge: "Career Switch",
    icon: Combine,
    description: "The pragmatic path for non-CS students to break into software engineering.",
    targetRole: "Software Engineer (Career Switcher)",
    estimatedDuration: "12 Weeks",
    steps: [
      {
        id: "c2it-1",
        title: "Phase 1: CS Fundamentals Crash Course",
        duration: "Weeks 1 - 3",
        tag: "Catch-Up",
        description: "Bridge the academic gap by learning exactly what CS students study in 4 years.",
        tasks: [
          { id: "c2it-task-1", text: "Pick one language (C++ or Java) and master its OOP concepts", targets: ["dsa", "interview"] },
          { id: "c2it-task-2", text: "Study core OS concepts (Processes, Threads, Deadlocks) and DBMS (SQL, Normalization)", targets: ["interview"] },
          { id: "c2it-task-3", text: "Understand HTTP, DNS, and basic Computer Networks", targets: ["interview"] }
        ],
        proTip: "Interviewers will grill you on CS fundamentals to check if you are a 'real' software engineer. Do not skip this."
      },
      {
        id: "c2it-2",
        title: "Phase 2: DSA Essentials for Interviews",
        duration: "Weeks 4 - 8",
        tag: "Coding Tests",
        description: "Clear technical screening rounds by mastering standard algorithms.",
        tasks: [
          { id: "c2it-task-4", text: "Master Arrays, Strings, and Hashing patterns", link: "/real-world-dsa", linkText: "DSA Lab", targets: ["dsa"] },
          { id: "c2it-task-5", text: "Learn Linked Lists, Stacks, and Queues", link: "/daily-challenge", linkText: "Daily Grind", targets: ["dsa"] },
          { id: "c2it-task-6", text: "Solve top 50 interview coding problems on standard platforms", targets: ["dsa", "interview"] }
        ],
        proTip: "You don't need Competitive Programming. You need to confidently solve standard medium-level questions."
      },
      {
        id: "c2it-3",
        title: "Phase 3: Domain Project & Resume Translation",
        duration: "Weeks 9 - 12",
        tag: "Packaging",
        description: "Reframe your non-CS background as an asset, not a liability.",
        tasks: [
          { id: "c2it-task-7", text: "Build ONE robust full-stack project (avoid generic clones)", targets: ["projects"] },
          { id: "c2it-task-8", text: "Reframe core projects for IT: Focus on data analysis, modeling, or automation", link: "/resume", linkText: "Resume Tool", targets: ["resume"] },
          { id: "c2it-task-9", text: "Prepare an answer for 'Why do you want to switch to IT?'", targets: ["interview"] }
        ],
        proTip: "If you did a Mechanical project using MATLAB, reframe it on your resume as 'Data Simulation and Modeling using scripts'."
      }
    ]
  }
];
