import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";
import Link from "next/link";

const FREE_FEATURES = [
  "One Berojgar Score™",
  "One AI Resume Roast",
  "Basic roadmap",
  "Dashboard access",
];

const PREMIUM_FEATURES = [
  "Unlimited resume roasts",
  "AI mock interviews",
  "Company-specific prep",
  "Priority support",
  "Score history tracking",
  "LinkedIn audit tool",
];

// Task B: The Pro tier is advertised here but payment integration does not yet
// exist in this repository. The CTA is therefore disabled and the card is
// clearly marked "Coming Soon" so no user can be misled into expecting a
// working checkout flow.
//
// TODO: Integrate a payment provider before enabling the upgrade button.
//       Planned provider: Razorpay (Indian cards/UPI) — see issue #XX.

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Pricing</h1>
        <p className="mt-1.5 text-sm text-muted">
          Start free. Pro tier is coming soon — join the waitlist.
        </p>
      </div>

      {/* Plans */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Free */}
        <div className="rounded-[12px] border border-border p-6 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Free</p>
            <p className="font-mono text-4xl font-bold text-foreground">₹0</p>
            <p className="mt-1 text-xs text-muted">Always free, no card needed.</p>
          </div>
          <ul className="space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                <Check size={13} className="text-success shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/assessment" className="block">
            <Button variant="ghost" size="md" className="w-full">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Premium — Task B: no payment integration exists yet; CTA disabled */}
        <div className="rounded-[12px] border border-border p-6 space-y-5 relative opacity-80">
          {/* "Coming Soon" replaces the old "Popular" badge */}
          <Badge variant="dark" className="absolute top-4 right-4 flex items-center gap-1">
            <Clock size={10} /> Coming Soon
          </Badge>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Premium</p>
            <p className="font-mono text-4xl font-bold text-foreground">₹199</p>
            <p className="mt-1 text-xs text-muted">per month — payment integration in progress.</p>
          </div>
          <ul className="space-y-2.5">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/60">
                <Check size={13} className="text-muted shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {/* Button is intentionally disabled — no checkout flow exists yet */}
          <Button
            variant="dark"
            size="md"
            className="w-full opacity-50 cursor-not-allowed"
            disabled
            aria-disabled="true"
            title="Payment integration coming soon"
          >
            Upgrade to Premium — Coming Soon
          </Button>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* FAQ-style footer */}
      <p className="text-xs text-muted text-center">
        Questions? Reach us at{" "}
        <a href="mailto:hello@berojgar-engineer.club" className="text-foreground hover:underline">
          hello@berojgar-engineer.club
        </a>
      </p>
    </div>
  );
}
