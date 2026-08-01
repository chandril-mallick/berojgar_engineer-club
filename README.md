# 🎓 BEROJGAR ENGINEER CLUB (BEC)

> **From Berojgar to Employable.**
> *India's most brutally honest career platform for engineering students.*

---

## 🚀 Overview

**Berojgar Engineer Club** is a gamified, AI-powered career platform designed specifically for Indian engineering students. It replaces generic career advice with brutal honesty, data-backed skill audits, DSA streak tracking, mock interviews, placement trends, and community referrals.

---

## 🔥 Key Features

- **Berojgar Score™ Reality Check (`/assessment` & `/score`)**: 10-step assessment algorithm measuring your DSA prep, projects, GitHub presence, internships, and LinkedIn hygiene to give a brutally honest employability score out of 100 with a custom action plan.
- **AI Resume Roast (`/resume`)**: AI-powered resume analyzer that roasts weak project descriptions, outdated templates, and gives actionable fixes to pass recruiter screens.
- **AI Career Coach (`/ai-coach`)**: Instant 24/7 AI mentor for DSA roadmap advice, interview prep, and salary negotiation.
- **Colleges & Rankings (`/colleges`)**: Explore placement statistics, top recruiters, average CTCs, and student ratings across Indian engineering colleges.
- **Company Hub & CTC Breakdown (`/companies`)**: Detailed breakdown of hiring processes, interview rounds, and real compensation structures for tech giants & fast-growing startups.
- **Hackathons Hub (`/hackathons`)**: Discover active hackathons, team finders, prize pools, and deadline countdowns.
- **Peer Referrals Marketplace (`/referrals`)**: Connect with alumni and senior engineers for verified referral requests.
- **Daily Grind & Streaks (`/daily-challenge`)**: Solve daily DSA & dev problems to build coding streaks (`🔥`) and level up your XP.
- **Memes & Placement Tea (`/memes`)**: Engineering humor, placement season memes, and viral student stories.
- **Study Groups (`/study-groups`)**: Join peer learning rooms for LeetCode grinding, system design, and mock interviews.
- **Projects Showcase (`/projects`)**: Share live builds, receive peer code reviews, and showcase your portfolio.
- **Campus Ambassador Portal (`/ambassador`)**: Student leader rewards, referral tracking, and campus outreach.
- **Offer Wall (`/offer-wall`)**: Real placement proof and offer celebrations from community members.
- **Branded Skeleton Splash Screen**: High-performance animated splash screen featuring the official `berojgar-logo.png`.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Vanilla CSS / Tailwind CSS v4
- **Animations**: Framer Motion
- **State & Data**: TanStack Query (React Query) + LocalStorage Hooks
- **Icons & UI**: Lucide React, Recharts, Custom UI components

### Backend

- **Framework**: FastAPI (Python 3.11+)
- **Validation**: Pydantic v2
- **Server**: Uvicorn
- **Architecture**: Modular service layer for scoring engines and roast analyzers

---

## 📁 Repository Structure

```
berojgar-engineer/
├── public/
│   └── berojgar-logo.png       # Official circular branding logo
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── ai-coach/           # AI Career Coach page
│   │   ├── assessment/         # Berojgar Score™ quiz
│   │   ├── colleges/           # College rankings & search
│   │   ├── companies/          # Company hiring & CTC breakdowns
│   │   ├── daily-challenge/    # Daily DSA grind & streak system
│   │   ├── hackathons/         # Hackathon listings & filters
│   │   ├── leaderboard/        # Student XP leaderboard
│   │   ├── memes/              # Engineering meme feed
│   │   ├── projects/           # Student project showcase
│   │   ├── referrals/          # Referral marketplace
│   │   ├── resume/             # AI Resume roast
│   │   ├── study-groups/       # Peer study groups
│   │   └── layout.tsx          # Root layout with Header, Footer, Splash Screen
│   ├── components/
│   │   ├── community/          # Feature-specific interactive widgets
│   │   ├── layout/             # SiteHeader, SiteFooter, Navigation
│   │   ├── shared/             # Logo, SplashScreen, SharePanel, EngineerCard
│   │   └── ui/                 # Reusable UI primitives (Button, Badge, Skeleton)
│   ├── hooks/                  # Custom React hooks (useLocalStorage, etc.)
│   └── lib/                    # Constants, mock data, XP & achievement logic
└── backend/
    ├── api/                    # FastAPI route handlers
    ├── models/                 # Pydantic schemas
    ├── services/               # Scoring & resume roast logic
    ├── main.py                 # FastAPI application entry point
    └── requirements.txt        # Python dependencies
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Python**: 3.10+ (for backend API)

---

### 1. Frontend Setup

```bash
# Clone repository
git clone https://github.com/your-username/berojgar-engineer.git
cd "berojgar engineer"

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 2. Backend Setup (Optional API Server)

```bash
# Create and activate virtual environment
python3 -m venv backend/.venv
source backend/.venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt


cd "/Users/chandrilmallick/Downloads/berojgar engineer"
PYTHONPATH=. uvicorn backend.main:app --reload --port 8000
```

The API docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🌐 Community & Official Social Handles

Connect with the Berojgar Engineer Club community:

- **Reddit**: [r/BerojgarEngineerClub](https://www.reddit.com/r/BerojgarEngineerClub/)
- **Instagram**: [@berojgarengineerclub](https://www.instagram.com/berojgarengineerclub/)
- **WhatsApp Channel**: [Join Channel](https://whatsapp.com/channel/0029Vagowl0HwXb7IADdPJ3A)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
