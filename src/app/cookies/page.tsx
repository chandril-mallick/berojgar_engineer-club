"use client";
// Not legal advice. Have a lawyer review before launch.

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsentRecord, acceptAll, rejectNonEssential, setConsentRecord, ConsentCategory } from "@/lib/cookie-consent";
import type { ConsentRecord } from "@/lib/cookie-consent";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeading, Eyebrow } from "@/components/shared/section-heading";

// ─── All localStorage keys the platform sets — verified from source ───────────
const STORAGE_KEYS = [
  {
    key: "bec-cookie-consent",
    category: "Strictly Necessary",
    purpose: "Stores your cookie preference choice (version + timestamp). Without this, the consent banner would appear on every page load.",
    expires: "Persistent (browser localStorage — until cleared or you change your preference)",
  },
  {
    key: "bec-user-xp",
    category: "Functional",
    purpose: "Your total XP, current streak, earned badges, and daily login timestamp. Powering the XP bar and badge grid in your dashboard.",
    expires: "Persistent (localStorage)",
  },
  {
    key: "bec-score-result",
    category: "Functional",
    purpose: "Your most recent Berojgar Score and sub-scores so the dashboard can show them without re-running the assessment.",
    expires: "Persistent (localStorage)",
  },
  {
    key: "bec-assessment-input",
    category: "Functional",
    purpose: "Your raw assessment answers so they can be pre-filled if you retake the assessment.",
    expires: "Persistent (localStorage)",
  },
  {
    key: "bec-assessment-xp-awarded",
    category: "Functional",
    purpose: "A flag to prevent awarding XP twice for the same assessment session.",
    expires: "Persistent (localStorage)",
  },
  {
    key: "bec-resume-score",
    category: "Functional",
    purpose: "Your most recent ATS score from the resume roast tool.",
    expires: "Persistent (localStorage)",
  },
  {
    key: "bec-resume-xp-awarded",
    category: "Functional",
    purpose: "A flag to prevent awarding XP twice for the same resume roast session.",
    expires: "Persistent (localStorage)",
  },
  {
    key: "bec-roadmap-completed-tasks",
    category: "Functional",
    purpose: "Which roadmap tasks you have marked complete.",
    expires: "Persistent (localStorage)",
  },
  {
    key: "bec-rwdsa-completed",
    category: "Functional",
    purpose: "Which Real-World DSA Lab problems you have solved.",
    expires: "Persistent (localStorage)",
  },
  {
    key: "bec-rwdsa-history-{problemId}",
    category: "Functional",
    purpose: "Your code run history for each individual DSA problem.",
    expires: "Persistent (localStorage)",
  },
  {
    key: "bec-challenge-{YYYY-MM-DD}",
    category: "Functional",
    purpose: "A flag per calendar day recording whether you completed that day's challenge.",
    expires: "Cleared when you clear browser storage; one key per day",
  },
  {
    key: "bec-community-user-memes",
    category: "Functional",
    purpose: "Cache of memes you have uploaded in the community Meme Feed.",
    expires: "Persistent (localStorage)",
  },
  {
    key: "bec_referral_queue_v1",
    category: "Functional",
    purpose: "Offline queue of referral requests pending sync to Firestore when connectivity returns.",
    expires: "Cleared once successfully synced",
  },
  {
    key: "bec-user-tasks-{uid}",
    category: "Functional",
    purpose: "Local cache of your to-do tasks, used as a fallback when Firestore is unreachable.",
    expires: "Updated on every Firestore sync",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Strictly Necessary": "bg-foreground text-white",
  "Functional": "bg-amber-100 text-amber-900 border border-amber-300",
  "Analytics": "bg-blue-50 text-blue-800 border border-blue-200",
};

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${
        checked ? "border-foreground bg-foreground" : "border-border bg-border"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function CookiesPage() {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const record = getConsentRecord();
    setConsent(record);
    if (record) {
      setFunctional(record.categories.functional);
      setAnalytics(record.categories.analytics);
    }
  }, []);

  function handleSave() {
    setConsentRecord({ functional, analytics } as Record<ConsentCategory, boolean>);
    setConsent(getConsentRecord());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleAcceptAll() {
    acceptAll();
    setFunctional(true);
    setAnalytics(true);
    setConsent(getConsentRecord());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleRejectAll() {
    rejectNonEssential();
    setFunctional(false);
    setAnalytics(false);
    setConsent(getConsentRecord());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <PageContainer size="narrow">
      <div className="border-b border-border pb-6">
        <Eyebrow>Legal</Eyebrow>
        <PageHeading>Cookie Settings</PageHeading>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          We believe you should know exactly what your browser stores on behalf of this platform —
          and you should be in control of it. This page explains every storage key the app sets and
          lets you change your preferences at any time.
        </p>
        <p className="mt-3 text-xs text-muted">
          We don&apos;t use tracking cookies, ad networks, or third-party analytics pixels.
          All storage is either essential for the app to work or functional to preserve your
          progress across sessions.
        </p>
      </div>

      {/* ── Preference Controls ── */}
      <section className="space-y-5">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Your Preferences</h2>

        {consent && (
          <div className="rounded-none border border-border bg-surface px-4 py-3 text-xs text-muted">
            Last updated: {new Date(consent.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
          </div>
        )}

        <div className="space-y-4 divide-y divide-border border border-border">
          {/* Strictly Necessary */}
          <div className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Strictly Necessary</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Firebase auth session tokens, your consent choice. These are required for the site
                to function — they cannot be disabled without breaking the service.
              </p>
            </div>
            <div className="shrink-0 pt-0.5">
              <Toggle checked={true} disabled />
            </div>
          </div>

          {/* Functional */}
          <div className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Functional</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Saves your XP, streak, Berojgar Score, roadmap progress, DSA completions, and
                daily challenge state in your browser. Disabling this means your progress is lost
                when you close the tab (Firestore sync still works if you&apos;re logged in).
              </p>
            </div>
            <div className="shrink-0 pt-0.5">
              <Toggle checked={functional} onChange={setFunctional} />
            </div>
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Analytics</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                <span className="font-medium text-foreground">Not in use yet.</span> No analytics
                provider is connected. Enabling or disabling this toggle currently does nothing —
                this category is a placeholder for future integration. We will update this page and
                re-ask for consent before activating any analytics.
              </p>
            </div>
            <div className="shrink-0 pt-0.5">
              <Toggle checked={analytics} onChange={setAnalytics} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSave}
            className="rounded-none border border-foreground bg-foreground px-5 py-2 text-xs font-bold text-white hover:opacity-80 transition-opacity"
          >
            {saved ? "✓ Saved" : "Save preferences"}
          </button>
          <button
            onClick={handleAcceptAll}
            className="rounded-none border border-border px-5 py-2 text-xs font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Accept all
          </button>
          <button
            onClick={handleRejectAll}
            className="rounded-none border border-border px-5 py-2 text-xs font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Reject non-essential
          </button>
        </div>
      </section>

      {/* ── What We Store ── */}
      <section className="space-y-5">
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
            What We Store — Full List
          </h2>
          <p className="text-xs text-muted mt-1">
            Every localStorage key the platform sets, verified from source code.
            No HTTP cookies with tracking data are set.
          </p>
        </div>

        <div className="space-y-3">
          {STORAGE_KEYS.map((item) => (
            <div
              key={item.key}
              className="rounded-none border border-border bg-white p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <code className="text-xs font-mono font-bold text-foreground bg-surface px-2 py-0.5 border border-border">
                  {item.key}
                </code>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 ${CATEGORY_COLORS[item.category] ?? ""}`}
                >
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{item.purpose}</p>
              <p className="text-[10px] text-muted/70 font-mono">Retention: {item.expires}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Firebase Auth Note ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Firebase Auth Session</h2>
        <p className="text-xs text-muted leading-relaxed">
          Firebase Authentication manages your login session using{" "}
          <code className="font-mono text-[11px] bg-surface border border-border px-1">IndexedDB</code>{" "}
          and <code className="font-mono text-[11px] bg-surface border border-border px-1">localStorage</code>{" "}
          under the prefix <code className="font-mono text-[11px] bg-surface border border-border px-1">firebase:*</code>.
          These are strictly necessary and are governed by{" "}
          <a
            href="https://firebase.google.com/support/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-70"
          >
            Google&apos;s Firebase Privacy Policy
          </a>
          . Logging out clears your session token.
        </p>
      </section>

      {/* ── Questions ── */}
      <section className="border-t border-border pt-8 space-y-2">
        <p className="text-xs text-muted">
          Questions about how your data is handled?{" "}
          <a
            href="mailto:support@berojgar-engineer.club"
            className="text-foreground underline underline-offset-2 hover:opacity-70"
          >
            support@berojgar-engineer.club
          </a>
        </p>
        <p className="text-xs text-muted">
          <Link href="/privacy" className="text-foreground underline underline-offset-2 hover:opacity-70">
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="text-foreground underline underline-offset-2 hover:opacity-70">
            Terms of Service
          </Link>
        </p>
      </section>
    </PageContainer>
  );
}
