# 🎓 Product Requirement Document (PRD): Berojgar Engineer Club (BEC)

> **Version:** 1.0.0  
> **Status:** Product specification — partially implemented  
> **Author:** DeepMind Agentic Engineering & Product Team  
> **Last Updated:** September 2026  
> **Target Audience:** Product Managers, Full-Stack Engineers, AI Specialists, Community Managers  

---

## Implementation Snapshot (September 2026)

This document describes the intended product, not a release checklist. The current repository implements the Berojgar Score, text-based PDF resume audit, Daily Grind, Real-World DSA Lab, roadmap, Firebase-backed community surfaces, and the FastAPI assessment scorer.

The following are still planned and must not be presented as live: OpenRouter multi-model AI routing, the AI Coach, WebRTC mock interviews, college/company/hackathon hubs, project showcase, direct corporate hiring, and the database/Redis integrations described below. The resume audit currently performs deterministic document-content analysis and does not transmit candidates' resumes to a third-party model.

Production API rate limits use Upstash Redis only when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured; local development uses an in-memory fallback. Judge0's public endpoint is a development fallback, not a production SLA.

---

## 1. Executive Summary & Mission Statement

**Berojgar Engineer Club (BEC)** is a gamified, AI-powered career elevation platform designed specifically for Indian engineering students. Traditional career portals provide generic advice, unverified placement statistics, and polished marketing copy that fails to address the root causes of unemployment among fresh engineering graduates. 

BEC replaces passive advice with **brutal honesty, data-backed skill audits, real-world DSA problem solving, AI resume roasting, peer referral marketplaces, and active gamification**.

### Motto & Core Belief
> *"Sikhenge • Banayenge • Badlenge"*  
> *(Learn • Build • Transform)*

---

## 2. Product Vision & Key Objectives

### 2.1 Vision
To become India's primary candidate readiness platform—transforming engineering undergraduates from unready graduates ("Berojgar") into highly employable, industry-ready Software Development Engineers (SDEs), Product Engineers, and Tech Founders.

### 2.2 Core Strategic Goals
1. **Diagnostic Accuracy:** Provide a 100% objective, algorithmically calculated employability score (**Berojgar Score™**) based on recruiter screening checkpoints.
2. **Actionable AI Feedback:** Deliver real-time, low-latency resume audits and 24/7 technical interview coaching using state-of-the-art Large Language Models.
3. **Practical Skill Proof:** Bridge the gap between abstract algorithmic competitive programming and real-world software architecture using production-level engineering challenges.
4. **Community Access:** Democratize off-campus referrals, hackathon team formation, and peer study groups for students in Tier-2, Tier-3, and regional state universities.
5. **Gamification & Engagement:** Drive daily coding discipline through login streaks, level perks, verifiable certificates, and transparent leaderboards.

---

## 3. Target Audience & User Personas

| Persona | Academic Background | Primary Pain Points | Key Platform Feature Used |
| :--- | :--- | :--- | :--- |
| **Tier-3 Challenger** | 3rd/4th Year B.Tech (State Univ / Private College) | Zero campus placement visits, weak resume bullets, no recruiter visibility. | Berojgar Score™, Referral Marketplace, AI Resume Roast |
| **Tier-1/2 SDE Aspirant** | 2nd/3rd Year B.Tech (IIT, NIT, IIIT, BITS) | High competition for top CTC offers (Google, Amazon, Quant firms). | Real-World DSA Lab, AI Mock Interviewer, Leaderboard |
| **Non-CS / ECE / Core Student** | 3rd/4th Year B.Tech (ECE, Mech, Civil) | Transitioning to Tech/IT without formal CS background or guidance. | Daily Grind, Study Groups, Company CTC Breakdown |
| **Verified SDE Alumni / Referrer** | SDE-1 / SDE-2 at MAANG / Top Unicorns | Wants to give back to junior community and find talent without spam. | Referral Marketplace, Offer Wall Proof |

---

## 4. System Architecture & Tech Stack

BEC currently combines a Next.js 16 App Router frontend with a Python FastAPI assessment service, Judge0 code execution, and Firebase Cloud Firestore persistence. OpenRouter routing and the other services in this section are planned requirements, not current integrations.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               NEXT.JS 16 FRONTEND                                │
│   App Router • TypeScript • Tailwind CSS v4 • Framer Motion • TanStack Query v5    │
└────────┬───────────────────────┬────────────────────────┬───────────────────────┬┘
         │                       │                        │                       │
         ▼                       ▼                        ▼                       ▼
┌─────────────────┐    ┌───────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ PYTHON FASTAPI  │    │  OPENROUTER AI    │    │   JUDGE0 CODE    │    │ FIREBASE CLOUD   │
│ BACKEND ENGINE  │    │   MULTI-MODEL     │    │   EXECUTION      │    │ FIRESTORE DB     │
│ (Py3.11/Pydantic)    │ (Gemini/Llama/DS) │    │ (Python/C++/Java)│    │ (User Profiles)  │
└─────────────────┘    └───────────────────┘    └──────────────────┘    └──────────────────┘
```

### 4.1 Frontend Specification
- **Framework:** Next.js 16.2.11 (App Router, Turbopack enabled)
- **Language:** TypeScript 5.x
- **Styling:** Vanilla CSS / Tailwind CSS v4 (`@tailwindcss/postcss`) with custom CSS Variables
- **Animations:** Framer Motion 12.x
- **State Management & Data Fetching:** TanStack React Query v5 + Custom `useLocalStorage` hooks
- **UI Components & Icons:** Lucide React 1.26+, Recharts 3.10+, Custom UI Primitives (Button, Badge, Skeleton, Input, Select, Progress)
- **Export & Canvas Rendering:** `html-to-image` 1.11+ for official certificate PNG generation

### 4.2 Backend Specification
- **Framework:** FastAPI (Python 3.11+)
- **Data Validation:** Pydantic v2 schemas (`AssessmentPayload`, `AssessmentResponse`, `ResumeRoastPayload`, `ResumeRoastResponse`)
- **Server:** Uvicorn ASGI server running on port `8000`
- **Resilience Architecture:** Next.js API route proxies attempt primary execution via FastAPI at `FASTAPI_BACKEND_URL` (`http://localhost:8000`). If FastAPI is offline or unreachable, API routes seamlessly fall back to built-in TypeScript engines without user disruption.

### 4.3 Planned AI Engine & Multi-Model Fallback Chain
- **Provider:** OpenRouter AI API
- **Primary Paid Models:** `google/gemini-2.0-flash-001`, `meta-llama/llama-3.3-70b-instruct`, `anthropic/claude-3-haiku`
- **Free Fallback Endpoints:** `google/gemini-2.0-flash-exp:free`, `meta-llama/llama-3.3-70b-instruct:free`, `deepseek/deepseek-r1:free`, `mistralai/mistral-7b-instruct:free`, `qwen/qwen-2.5-coder-32b-instruct:free`, `openrouter/free`
- **Execution Strategy:** Sequential fallback retry with 5-second per-candidate timeout. Static fallback response returned if all endpoints fail.

### 4.4 Code Execution Engine (Judge0 Sandbox)
- **API Integration:** RapidAPI Judge0 (Paid tier) primary -> Public CE Judge0 (`https://ce.judge0.com`) fallback
- **Supported Languages:**
  1. Python 3 (ID: 71)
  2. C++ (GCC 9.2.0, ID: 54)
  3. Java (OpenJDK 13, ID: 62)
  4. JavaScript (Node.js 12, ID: 63)
  5. Go (Go 1.13, ID: 60)
- **Safety Controls:** CPU time limit: 5s, Memory limit: 128 MB, Max code payload guard: 50 KB.

### 4.5 Persistence & Authentication
- **Authentication Providers:** Firebase Authentication (Google OAuth, GitHub OAuth, Email/Password, Anonymous/Guest mode)
- **Database:** Firebase Cloud Firestore (`db`) for real-time document synchronization:
  - `users/{uid}`: Profile metadata, total XP, streak, berojgarScore, ATS scores
  - `users/{uid}/assessments`: Historical assessment submissions
  - `users/{uid}/daily_challenges`: Daily problem submission logs
  - `users/{uid}/ai_chats`: AI mentor interaction logs
  - `users/{uid}/resumes`: Resume roast history
  - `community_referrals`: Global peer referral listings and requests
  - `community_offers`: Verifiable offer proof wall posts
- **Client Storage:** LocalStorage backup fallback (`bec_user_xp_v1`, `bec_assessment_v1`).

### 4.6 Rate Limiting & Edge Safety
`src/lib/rate-limiter.ts` uses Upstash Redis for cross-instance limits when configured, with an in-memory local-development fallback:
- **Assessment Scoring:** 30 requests per 5 minutes per IP
- **Resume Roast:** 20 requests per 5 minutes per IP
- **Code Execution:** 20 submissions per 1 minute per IP (Max 50 KB source size)

---

## 5. Detailed Functional Specifications & Feature Modules

---

### Module 1: Berojgar Score™ Reality Check (`/assessment` & `/score`)

#### Overview
A 10-step diagnostic assessment algorithm that measures recruiter-facing parameters to generate an objective employability score out of 100, custom roasts, risk indexes, and actionable roadmaps.

#### Input Fields
1. **College:** Free text / dropdown selection
2. **Branch:** Computer Science, IT, ECE, EE, Mechanical, Civil, AI/ML, Data Science, Other
3. **Year of Study:** 1st, 2nd, 3rd, 4th/Final Year
4. **CGPA:** Numeric float scale (0.0 - 10.0)
5. **Projects:** Count of completed projects (0 - 10+)
6. **Internships:** Count of industrial/tech internships (0 - 5+)
7. **GitHub Presence:** Public activity proof (`"yes"`, `"low"`, `"no"`)
8. **LinkedIn Hygiene:** Profile optimization proof (`"yes"`, `"no"`)
9. **DSA Confidence:** Self-rated rating scale (1 - 10)
10. **Communication & Interview Prep:** Confidence scale (1 - 10)
11. **Target Company:** Free text (e.g. Google, Amazon, TCS Digital)
12. **Top Project / Paper:** Description of primary build (optional)
13. **Key Achievement:** Hackathon / Contest distinction (optional)
14. **Interview Confidence:** Scale 1 - 10 (optional)
15. **Target Role:** SDE, Fullstack, Frontend, Backend, AI Engineer (optional)

#### Authoritative Scoring Engine Formula (`backend/services/engine.py` & `src/app/api/assessment/route.ts`)
```python
raw_score = (
    cgpa * 6 +
    projects * 7 +
    internships * 9 +
    dsa * 5 +
    communication * 5 +
    (6 if github == "yes" else 0) +
    (5 if linkedin == "yes" else 0) -
    (8 if year == "1" else 0)
)
score = clamp(raw_score / 4.2, min=0, max=100)
```

#### Output Metrics & Results Page (`/score`)
- **Berojgar Score™ (0-100):** Visual gauge & progress ring
- **Risk Level:** `HIGH` (<45), `MEDIUM` (45-69), `LOW` (70+)
- **Brutal Roast Line:** Humorous yet honest evaluation
- **Dimensional Breakdown:**
  - *DSA Consistency Score* (0-100)
  - *Project Depth & Proof Score* (0-100)
  - *Resume & Internship Proof Score* (0-100)
  - *Interview Readiness Score* (0-100)
- **Strengths & Weaknesses List:** Dynamic bullets based on input
- **Placement Probability %:** Estimated algorithmically (`score + 8`)
- **Salary Prediction (LPA):** Estimated starting CTC (`3.0 + score / 12.0`)
- **Career Archetype:** `"Builder"` (>75), `"Rising Candidate"` (55-75), `"Potential Underused"` (<55)
- **Berojgari Certificate Component (`BerojgariCertificate`):** Custom canvas layout with official branding logo, date, student details, and download button (`html-to-image`)
- **Viral Share Panel (`SharePanel`):** One-click copy/share to WhatsApp, Twitter, LinkedIn, Reddit with dynamic share text (`"I scored {score}/100 on Berojgar Engineer Club! Can you beat me?"`).

---

### Module 2: AI Resume Roast (`/resume`)

#### Overview
An automated ATS (Applicant Tracking System) scanner and AI roaster that highlights resume formatting errors, buzzword overuses, and weak project bullets.

#### Key Features
- **File Upload / Drag & Drop Interface:** Accepts PDF/DOCX files or text input
- **ATS Score Engine:** 0-100 score calculated by filename parsing, section structure, and keyword density
- **Recruiter Feedback & Fixes:**
  - Enforces Google X-Y-Z formula: *"Accomplished [X] as measured by [Y] by doing [Z]"*
  - Recommends placing Technical Skills section above Education for freshers
  - Demands public GitHub & deployed links alongside project titles
- **Firestore Integration:** Automatically logs ATS score to user's profile (`saveResumeRoast`).

---

### Module 4: Daily Grind & Streaks (`/daily-challenge`)

#### Overview
A multi-domain daily practice portal designed to build consistent coding habits (`🔥` streaks) and award user XP.

#### Challenge Categories
1. **Daily DSA Problem:**
   - Full-featured code editor with syntax highlighting
   - Multi-language support (Python 3, C++, Java, JS, Go)
   - Real-time compilation and execution via Judge0
   - Automated evaluation against Public & Hidden test cases
   - Post-solution complexity breakdown (Time & Space complexity analysis)
2. **Aptitude MCQ:** Quantitative & verbal reasoning practice
3. **SQL MCQ:** Relational query filtering, joins, and aggregations
4. **CS Fundamentals MCQ:** Operating Systems, DBMS, Networks, System Design
5. **AI MCQ:** Transformers, Self-Attention mechanisms, and LLM fundamentals

#### Reward Mechanism
- **XP Reward:** +50 XP per completed challenge
- **Streak Tracking:** Consecutive daily logins increment streak counter. Firestore persistence via `saveDailyChallenge`.

---

### Module 5: Real-World DSA Lab (`/real-world-dsa` & `/real-world-dsa/[slug]`)

#### Overview
A specialized lab showing how Data Structures and Algorithms power large-scale commercial software architectures.

#### Curated Challenge Catalogue

| ID | Title | Category | DSA Concept | Real-World Context |
| :--- | :--- | :--- | :--- | :--- |
| `rwdsa-1` | **Food Delivery Rider Assignment** | Logistics & Dispatch | Min-Heap / Priority Queue | Swiggy/Zomato rider dispatch optimization in O(1) peek time. |
| `rwdsa-2` | **Pharmacy Medicine Search** | E-Commerce & Retail | Hash Table / HashMap | 1mg/Apollo instant stock & price lookup in O(1) time. |
| `rwdsa-3` | **Navigation & Route Finder** | Maps & Routing | Graph + Dijkstra's Algorithm | Google Maps/Rapido shortest time route computation. |
| `rwdsa-4` | **Autocomplete Search Suggestions** | Search & NLP | Trie (Prefix Tree) | Google/Amazon search box prefix autocomplete in O(L) time. |
| `rwdsa-5` | **Recently Viewed Products** | System Design & Memory | LRU Cache (List + HashMap) | Flipkart/Amazon bounded memory recent product cache. |

#### Challenge Detail Features
- Complete starter code pre-written in 5 languages (Python, C++, Java, JS, Go)
- Judge0 code submission engine
- Verification against edge cases
- Comprehensive architectural post-solution explanations.

---

### Module 6: Gamification, XP & Achievement Engine (`/leaderboard`, `/achievements`, `/profile`)

#### XP Levels & Tiers

| Level | Min XP | Max XP | Title | Unlocked Level Perk |
| :---: | :---: | :---: | :--- | :--- |
| **1** | 0 | 499 | Freshly Berojgar | Official Reality Check & Berojgar Score Certificate |
| **2** | 500 | 1,499 | Code Curious | Unlimited AI Resume Roasting & ATS Hints |
| **3** | 1,500 | 2,999 | Side Project Guy | Unlimited 24/7 AI Career Coach Access |
| **4** | 3,000 | 5,999 | Interview Ready | Priority Recruiter Spotlight on Hiring Board |
| **5** | 6,000 | 9,999 | Almost There | BEC Verified Placement Gold Badge |
| **6** | 10,000+ | Infinity | Placement Slayer | Lifetime Founders & SDE Alumni Club Access |

#### Badges & Rarity Matrix

| Badge ID | Name | Description | Emoji | Rarity | XP Reward |
| :--- | :--- | :--- | :---: | :--- | :---: |
| `first-blood` | First Blood | Completed first assessment | ⚡ | Common | 50 |
| `resume-warrior` | Resume Warrior | Uploaded resume for AI roast | 📄 | Common | 75 |
| `dsa-hero` | DSA Hero | Rated DSA confidence > 7/10 | 🧠 | Rare | 100 |
| `github-beast` | GitHub Beast | Connected public GitHub | 🐙 | Rare | 100 |
| `placement-slayer` | Placement Slayer | Employability score > 80 | 🔥 | Epic | 200 |
| `night-coder` | Night Coder | Completed assessment after 11 PM | 🌙 | Rare | 75 |
| `streak-7` | Week Warrior | 7-day login streak | 📆 | Rare | 150 |
| `streak-30` | 100-Day Club | 30-day login streak | 🏅 | Legendary | 500 |
| `top-1-percent` | Top 1% | Employability score > 90 | 👑 | Legendary | 300 |
| `referral-king` | Referral King | Referred 3+ friends to BEC | 🤝 | Epic | 250 |
| `interview-master` | Interview Master | Completed mock interview session | 🎤 | Epic | 150 |
| `overachiever` | Overachiever | Score > 75 AND ATS Resume > 70 | 🚀 | Legendary | 350 |

---

### Module 7: College Rankings & Hub (`/colleges`)

#### Overview
A university analytics module comparing official NIRF engineering rankings against BEC's real student employability metrics (**Berojgar Rank**).

#### Tracked Institutions
- **IIT Madras** (NIRF #1, Avg Package 26.8 LPA)
- **IIT Delhi** (NIRF #2, Avg Package 24.6 LPA)
- **IIT Bombay** (NIRF #3, Avg Package 25.2 LPA)
- **IIT Kanpur** (NIRF #4, Avg Package 22.8 LPA)
- **IIT Kharagpur** (NIRF #5, Avg Package 22.1 LPA)
- **NIT Trichy** (NIRF #9, Avg Package 20.4 LPA)
- **BITS Pilani** (NIRF #15, Avg Package 21.8 LPA)
- **VIT Vellore** (NIRF #11, Avg Package 9.8 LPA)
- **Brainware University** (NIRF #42 Regional Powerhouse, Avg Package 7.2 LPA)

#### Key Data Elements
- Placement Rate %, Average Salary LPA, Active Student Count
- Average Resume Score & Interview Success Rate %
- GitHub Activity Volume (Public commits & repos count)
- Top Performers list & recent campus offers feed.

---

### Module 8: Company Hub & CTC Breakdown (`/companies`)

#### Overview
Detailed hiring breakdowns for major tech recruiters in India, demystifying compensation structures, OA patterns, and interview rounds.

#### Covered Enterprises
1. **Amazon:** Base ₹16.5L, Total CTC ₹34L. Focus: 16 Leadership Principles (STAR method), Graph BFS/DFS, Heaps.
2. **Infosys:** Base ₹4.0L, Total CTC ₹9.5L (Specialist Programmer). Focus: HackWithInfy, SQL Joins, DBMS.
3. **Concentrix:** Base ₹4.5L, Total CTC ₹8.5L. Focus: Linux, Web, Customer Engineering, Scripting.
4. **IBM:** Base ₹7.5L, Total CTC ₹14.5L. Focus: Cognitive Ability Games, HackerRank DSA, Cloud/AI.
5. **OpenAI:** Base ₹45.0L, Total CTC ₹1.1 Cr. Focus: CUDA/C++, PyTorch, Distributed KV Cache, Transformers.
6. **Google:** Base ₹18.0L, Total CTC ₹42L. Focus: Google X-Y-Z resume formula, LeetCode Hard DSA, Googleyness.
7. **Microsoft:** Base ₹16.0L, Total CTC ₹38L. Focus: Codility test, Low-Level Design (LLD), OOP principles.

---

### Module 9: Referral Queue & Match Engine (`/referrals`)

#### Overview
An honest candidate intake flow allowing engineering students to submit their profile details once to join the Referral Queue and be matched as the network of verified working professionals grows.

#### Workflow
1. **Intake Form:** Students submit Name, College, Branch & Year, GitHub Profile URL (validated format), Resume Link (Google Drive / Notion / PDF), optional Target Company, and optional 150-character Pitch.
2. **Post-Submit Confirmation:** Clear, honest feedback informing students that they are in the queue and will be notified upon a match.
3. **Queue Status Monitor:** Students track their honest queue submission status (*In Queue* / *Matched*).
4. **Firestore & Local Sync:** Requests logged into `community_referrals` collection and local persistence (`bec_referral_queue_v1`).

---

### Module 10: Hackathons & Team Finder Hub (`/hackathons`)

#### Overview
A discovery engine for active national hackathons featuring a dedicated student teammate recruitment board.

#### Featured Hackathons
- **Smart India Hackathon 2026** (Govt of India, ₹1,00,000 per problem statement)
- **ETHIndia 2026** (Devfolio, $100,000 Web3 prize pool)
- **Google Girl Hackathon 2026** (Google India, PPIs & Pixel rewards)

#### Teammate Finder Capabilities
- Post team requests detailing required roles (e.g. Node.js Backend, Flutter Dev, AI Specialist)
- Project pitch summary and direct contact details.

---

### Module 11: Memes, Stories & Placement Tea (`/memes`)

#### Overview
A community engagement feed combining engineering humor, viral student memes, and transparent placement experience stories.

#### Sub-Components
- **Engineering Meme Feed:** Post, like, comment, and share memes across Placement, Coding, Exam, Hostel, and Confession categories.
- **Anonymous Placement Stories:** Honest candidate experiences categorized under *Ghosted by HR*, *Offer Revoked*, *TCS Digital Success*, and *Funny Stories*. Includes custom emoji reactions (`😭`, `💀`, `🚀`, `🤡`, `👏`).

---

### Module 12: Offer Wall & Placement Proof (`/offer-wall`)

#### Overview
A wall of community placement celebrations providing verified proof of salary offers, prep timelines, and recommended study resources.

#### Displayed Proof Attributes
- Student name, college, branch, company logo, role title, package LPA
- Preparation time (months) & journey narrative
- Resources used (e.g. *BEC Daily DSA Challenge*, *Striver A2Z Sheet*, *NeetCode 150*)
- Congratulations counter and candidate QA thread.

---

### Module 13: Peer Study Groups (`/study-groups`)

#### Overview
Peer learning rooms enabling real-time collaboration for competitive exams and tech interviews.

#### Rooms
- **DSA Grind 75 & Striver A2Z**
- **GATE CSE 2027 Aspirants**
- **Google & MAANG Interview Squad**

#### Features
- Active voice user counters
- Shared study resources (PDFs, Google Drives, Cheat sheets)
- Live chat discussions and scheduled mock contests.

---

### Module 14: Campus Ambassador Portal (`/ambassador`)

#### Overview
A student leader portal rewarding campus representatives for organizing outreach, DSA leagues, and user onboarding.

---

### Module 15: UX Layout & Design System

#### Design Aesthetic Principles
- **Style:** High-contrast, modern editorial typography paired with glassmorphism overlays and vibrant yellow/purple accents (`#ffc700`, `#9333ea`).
- **Font Stack:** Clean Sans-serif font hierarchy paired with crisp Monospace metadata text.
- **Branded Skeleton Splash Screen (`SplashScreen`):** Displays a wireframe layout overlay with an animated progress bar and official `berojgar-logo.png` logo on initial application load.
- **Site Header (`SiteHeader`):** Sticky responsive navbar with multi-level dropdowns (Practice, Community, More), Notification Center drawer, and Auth Modal integration.
- **Site Footer (`SiteFooter`):** Comprehensive footer with primary navigation links, social channel badges (Reddit, Instagram, WhatsApp Channel, LinkedIn), and legal pages (Privacy Policy, Terms of Service, Pricing, About).

---

## 6. Data Schemas & API Integration Matrix

### 6.1 Core API Routes Matrix

| Route Endpoint | Method | Rate Limit | Primary Engine | Fallback Engine | Description |
| :--- | :---: | :--- | :--- | :--- | :--- |
| `/api/assessment` | `POST` | 30 / 5 min | FastAPI (`/api/v1/assessment/score`) | Pure TypeScript Engine | Calculates Berojgar Score™, roasts, probability, and salary prediction. |
| `/api/resume-roast` | `POST` | 20 / 5 min | FastAPI (`/api/v1/resume/roast`) | Pure TypeScript Engine | Evaluates ATS compatibility score and recruiter improvements. |
| `/api/code-execution`| `POST` | 20 / 1 min | RapidAPI Judge0 Sandbox | Public CE Judge0 Engine | Compiles and executes code against test cases in 5 languages. |

---

## 7. Non-Functional Requirements (NFRs)

1. **Performance & Speed:**
   - Next.js initial page load under 1.2s.
   - Code execution response under 3.0s.
2. **Reliability & Availability:**
   - 100% API availability via seamless TypeScript fallbacks if Python backend or AI endpoints fail.
3. **Accessibility & Responsive Layout:**
   - Fully responsive layout across Mobile (320px+), Tablet, and Desktop (1360px+).
   - High color contrast ratio adhering to Web Content Accessibility Guidelines (WCAG AA).
4. **Data Security & Privacy:**
   - Zero exposure of sensitive environment keys in client bundles.
   - Firestore security rules restricting user document mutations to authenticated UIDs.

---

## 8. Installation & Developer Setup

### Prerequisites
- Node.js v18.x+
- npm v9.x+
- Python 3.10+ (for FastAPI backend)

### 1. Frontend Setup
```bash
# Clone project repository
git clone https://github.com/your-username/berojgar-engineer.git
cd "berojgar engineer"

# Install Node dependencies
npm install

# Run Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in browser.

### 2. Backend Setup (Optional FastAPI Server)
```bash
# Create and activate Python virtual environment
python3 -m venv backend/.venv
source backend/.venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Start Uvicorn FastAPI server
PYTHONPATH=. uvicorn backend.main:app --reload --port 8000
```
Interactive API docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 9. Future Product Roadmap

- **Phase 1 (Q4 2026):** Real-time WebRTC Peer Mock Interview Video Rooms.
- **Phase 2 (Q1 2027):** Automated GitHub Repo Inspector evaluating code quality & AST complexity.
- **Phase 3 (Q2 2027):** Direct Corporate Hiring Portal connecting Tier-1 startups directly with top Leaderboard candidates.

---
*End of Product Requirement Document (PRD.md)*
