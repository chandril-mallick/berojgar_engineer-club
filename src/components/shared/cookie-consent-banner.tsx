"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getConsentRecord,
  acceptAll,
  rejectNonEssential,
  setConsentRecord,
  ConsentCategory,
} from "@/lib/cookie-consent";

type Panel = "banner" | "customize" | "hidden";

export function CookieConsentBanner() {
  const [panel, setPanel] = useState<Panel>("hidden");
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    // Show banner only if no valid consent record exists yet
    const existing = getConsentRecord();
    if (!existing) {
      setPanel("banner");
    }

    // Listen for external "open preferences" events (e.g. footer link)
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string | undefined;
      if (detail === "open-preferences") {
        const record = getConsentRecord();
        setFunctional(record?.categories.functional ?? true);
        setAnalytics(record?.categories.analytics ?? false);
        setPanel("customize");
      } else {
        // consent-updated: hide the banner
        setPanel("hidden");
      }
    };

    window.addEventListener("bec-consent-updated", handler);
    window.addEventListener("bec-open-preferences", handler);
    return () => {
      window.removeEventListener("bec-consent-updated", handler);
      window.removeEventListener("bec-open-preferences", handler);
    };
  }, []);

  function handleAcceptAll() {
    acceptAll();
    setPanel("hidden");
  }

  function handleRejectAll() {
    rejectNonEssential();
    setPanel("hidden");
  }

  function handleSavePreferences() {
    setConsentRecord({
      functional,
      analytics,
    } as Record<ConsentCategory, boolean>);
    setPanel("hidden");
  }

  if (panel === "hidden") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-none border border-[#c8c8d0] bg-white shadow-xl">
        {/* ── BANNER PANEL ── */}
        {panel === "banner" && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-foreground">🍪 This site uses cookies</p>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  We use strictly necessary storage (Firebase auth session, your XP &amp; progress) and
                  optional functional storage (theme, roadmap state). No tracking or ad cookies are
                  deployed.{" "}
                  <Link href="/cookies" className="text-foreground underline underline-offset-2 hover:opacity-70">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleAcceptAll}
                className="rounded-none border border-foreground bg-foreground px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-80"
              >
                Accept all
              </button>
              <button
                onClick={handleRejectAll}
                className="rounded-none border border-border px-4 py-2 text-xs font-bold text-foreground transition-colors hover:border-foreground/40"
              >
                Reject non-essential
              </button>
              <button
                onClick={() => {
                  const record = getConsentRecord();
                  setFunctional(record?.categories.functional ?? true);
                  setAnalytics(record?.categories.analytics ?? false);
                  setPanel("customize");
                }}
                className="rounded-none border border-border px-4 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                Customize
              </button>
            </div>
          </div>
        )}

        {/* ── CUSTOMIZE PANEL ── */}
        {panel === "customize" && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">Cookie Preferences</p>
              <Link
                href="/cookies"
                className="text-[11px] text-muted underline underline-offset-2 hover:text-foreground"
              >
                Full details →
              </Link>
            </div>

            <div className="space-y-3 divide-y divide-border">
              {/* Strictly Necessary — always on */}
              <div className="flex items-start justify-between gap-4 pt-3 first:pt-0">
                <div>
                  <p className="text-xs font-semibold text-foreground">Strictly Necessary</p>
                  <p className="text-[11px] text-muted mt-0.5">
                    Firebase auth session, consent choice. Cannot be disabled.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-bold text-white">
                  Always on
                </span>
              </div>

              {/* Functional */}
              <div className="flex items-start justify-between gap-4 pt-3">
                <div>
                  <p className="text-xs font-semibold text-foreground">Functional</p>
                  <p className="text-[11px] text-muted mt-0.5">
                    XP &amp; streak progress, roadmap state, assessment results, daily challenge
                    completion — all stored locally in your browser.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={functional}
                  onClick={() => setFunctional((v) => !v)}
                  className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition-colors ${
                    functional ? "border-foreground bg-foreground" : "border-border bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      functional ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 pt-3">
                <div>
                  <p className="text-xs font-semibold text-foreground">Analytics</p>
                  <p className="text-[11px] text-muted mt-0.5">
                    Not in use yet — enabling this does nothing until analytics is added to the
                    platform. No data is sent.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={analytics}
                  onClick={() => setAnalytics((v) => !v)}
                  className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition-colors ${
                    analytics ? "border-foreground bg-foreground" : "border-border bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      analytics ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleSavePreferences}
                className="rounded-none border border-foreground bg-foreground px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-80"
              >
                Save preferences
              </button>
              <button
                onClick={handleAcceptAll}
                className="rounded-none border border-border px-4 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                Accept all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
