import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
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

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Pricing</h1>
        <p className="mt-1.5 text-sm text-muted">
          Start free. Upgrade when you need to get serious.
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

        {/* Premium */}
        <div className="rounded-[12px] border border-foreground p-6 space-y-5 relative">
          <Badge variant="dark" className="absolute top-4 right-4">Popular</Badge>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Premium</p>
            <p className="font-mono text-4xl font-bold text-foreground">₹199</p>
            <p className="mt-1 text-xs text-muted">per month, cancel anytime.</p>
          </div>
          <ul className="space-y-2.5">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                <Check size={13} className="text-success shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button variant="dark" size="md" className="w-full">
            Upgrade to Premium
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
