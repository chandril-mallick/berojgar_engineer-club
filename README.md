# Berojgar Engineer Club (BEC)

> From Berojgar to Employable.

BEC is a career-readiness web app for Indian engineering students. It combines a diagnostic score, document-based resume feedback, practice tools, and community features.

## What is implemented

- **Berojgar Score** (`/assessment`, `/score`): a validated 10-step assessment with identical first-year scoring in the Next.js fallback and FastAPI engine.
- **Resume Roast** (`/resume`): extracts and audits the actual text in a text-based PDF (up to 5 MB). It does not send the resume to a third-party AI provider.
- **Practice**: a Daily Grind, Real-World DSA Lab with Judge0 execution, and a placement roadmap.
- **Community**: referrals, study groups, memes and stories, offer wall, ambassadors, leaderboard, achievements, profile, and dashboard.
- **Persistence**: Firebase Auth and Firestore when configured, with browser storage used for local progress where appropriate.

Routes and features not listed above are not currently shipped. In particular, the PRD's college/company/hackathon hubs, project showcase, AI Coach, and OpenRouter model integration remain planned work.

## Architecture

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion.
- FastAPI/Pydantic score service, used by the assessment route with a TypeScript fallback.
- Firebase Authentication and Firestore.
- Judge0 for code execution: RapidAPI is used when configured; the public Judge0 CE endpoint is a development fallback.
- Upstash Redis rate limiting in deployed environments when its REST credentials are configured. Local development uses an in-memory fallback.

## Setup

Requirements: Node.js 20.9+ and npm. Python 3.10+ is needed only for the optional FastAPI service.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To run the optional scoring service:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
PYTHONPATH=. uvicorn backend.main:app --reload --port 8000
```

## Configuration

Copy `.env.example` to `.env.local` and set only the integrations you use.

- Firebase values are required for real authentication and Firestore persistence.
- `FASTAPI_BACKEND_URL` enables the Python assessment scorer; the app remains available if it is offline.
- `JUDGE0_RAPIDAPI_KEY` enables the paid Judge0 endpoint.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` enable durable, cross-instance rate limits in production.

## Quality checks

```bash
npx tsc --noEmit --incremental false
npm run lint
npm run build
```
