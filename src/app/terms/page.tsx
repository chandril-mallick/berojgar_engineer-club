// Not legal advice. Have a lawyer review before launch.
import Link from "next/link";

const LAST_UPDATED = "[PLACEHOLDER: insert date, e.g. October 2026]";
const LEGAL_ENTITY = "[PLACEHOLDER: legal entity name, e.g. BEC Technologies Pvt. Ltd.]";
const REGISTERED_ADDRESS = "[PLACEHOLDER: registered address]";
const JURISDICTION = "[PLACEHOLDER: city/state, e.g. Kolkata, West Bengal]";
const GRIEVANCE_OFFICER_EMAIL = "[PLACEHOLDER: grievance officer email]";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3 scroll-mt-20">
      <h2 className="font-heading text-base font-bold text-foreground border-b border-border pb-2">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-muted leading-7">{children}</div>
    </section>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900 font-mono text-xs border border-amber-300">
      {text}
    </span>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 py-4">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-1">Legal</p>
        <h1 className="font-heading text-2xl font-bold text-foreground">Terms of Service</h1>
        <p className="mt-2 text-xs text-muted">
          Last updated: <Placeholder text={LAST_UPDATED} />
        </p>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Welcome to Berojgar Engineer Club (&quot;BEC&quot;, &quot;we&quot;, &quot;our&quot;). These Terms of Service
          govern your access to and use of our web application, tools, assessments, and community features.
        </p>
        <div className="mt-4 rounded-none border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <strong>Note for operator:</strong> Yellow-highlighted values like{" "}
          <Placeholder text="[PLACEHOLDER]" /> must be filled in before launch.
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="rounded-none border border-border bg-surface p-5">
        <p className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Contents</p>
        <ol className="space-y-1.5 text-xs text-muted list-decimal list-inside">
          {[
            ["acceptance", "1. Acceptance of terms"],
            ["disclaimer-advisory", "2. Berojgar Score™ advisory disclaimer"],
            ["account-terms", "3. Accounts & authentication"],
            ["acceptable-use", "4. Acceptable use & prohibited conduct"],
            ["community-rules", "5. Community & user-generated content"],
            ["ai-tools", "6. Automated tools & code execution"],
            ["pricing-terms", "7. Pricing & subscriptions"],
            ["intellectual-property", "8. Intellectual property"],
            ["termination", "9. Termination & account deletion"],
            ["limitation-liability", "10. Disclaimers & limitation of liability"],
            ["governing-law", "11. Governing law & dispute resolution"],
            ["contact", "12. Contact & legal notices"],
          ].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="hover:text-foreground underline underline-offset-2">
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1. Acceptance */}
      <Section id="acceptance" title="1. Acceptance of terms">
        <p>
          By creating an account, taking an assessment, or browsing Berojgar Engineer Club, you agree to
          be bound by these Terms of Service and our{" "}
          <Link href="/privacy" className="text-foreground underline">Privacy Policy</Link>. If you do not
          agree, do not access or use the platform.
        </p>
        <p>
          This service is operated by <Placeholder text={LEGAL_ENTITY} /> with registered address at{" "}
          <Placeholder text={REGISTERED_ADDRESS} />.
        </p>
      </Section>

      {/* 2. Advisory Disclaimer */}
      <Section id="disclaimer-advisory" title="2. Berojgar Score™ advisory disclaimer">
        <div className="rounded-none border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 space-y-2">
          <p className="font-bold uppercase tracking-wider text-[11px]">Important Career Disclaimer</p>
          <p>
            Berojgar Score™ and associated career readiness breakdowns are advisory estimates based on self-reported inputs and heuristic metrics. They do <strong>NOT</strong> constitute an employment guarantee, job offer, or official evaluation by any recruiter or company.
          </p>
        </div>
        <p>
          You remain solely responsible for your job application decisions, interview preparation, resume content, and career path. BEC accepts no liability for hiring decisions made by third-party recruiters or employers.
        </p>
      </Section>

      {/* 3. Account Terms */}
      <Section id="account-terms" title="3. Accounts & authentication">
        <p>
          You may access the platform via Google or GitHub OAuth, email registration, or guest mode.
          When creating an account, you agree to provide accurate self-reported assessment information.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your credentials and for all activities
          occurring under your account. Notify us immediately at{" "}
          <a href="mailto:support@berojgar-engineer.club" className="text-foreground underline">
            support@berojgar-engineer.club
          </a>{" "}
          if you suspect unauthorized access.
        </p>
      </Section>

      {/* 4. Acceptable Use */}
      <Section id="acceptable-use" title="4. Acceptable use & prohibited conduct">
        <p>When using Berojgar Engineer Club, you agree NOT to:</p>
        <ul className="space-y-2 list-disc pl-5">
          <li>Scrape, crawl, or automatically extract platform data or community postings without explicit permission.</li>
          <li>Submit malicious code, exploits, or infinite loops to the Real-World DSA Lab or Judge0 sandbox.</li>
          <li>Artificially inflate leaderboard standings, XP, or streak numbers via automated scripts or exploits.</li>
          <li>Harass, insult, or post hateful or defamatory content in community feeds (Offer Wall, Referral Marketplace, Meme Feed).</li>
          <li>Post fake job referrals, scam referral links, or deceptive employment opportunities.</li>
          <li>Attempt to reverse-engineer, decompile, or breach security or rate-limiting measures.</li>
        </ul>
      </Section>

      {/* 5. Community Rules */}
      <Section id="community-rules" title="5. Community & user-generated content">
        <p>
          Users may post in public community areas including the Offer Wall, Referral Marketplace, and Meme Feed.
          You retain ownership of content you post, but grant BEC a non-exclusive, worldwide, royalty-free license to render and display that content on the platform.
        </p>
        <p>
          We reserve the right (but have no obligation) to remove any user content that violates these terms, contains spam, or is deemed inappropriate by moderators.
        </p>
      </Section>

      {/* 6. AI Tools & Code Execution */}
      <Section id="ai-tools" title="6. Automated tools & code execution">
        <p>
          <strong className="text-foreground">Resume Roast:</strong> Automated feedback provided by our resume analysis engine is intended for guidance only. Resume formatting suggestions do not guarantee recruiter response rates.
        </p>
        <p>
          <strong className="text-foreground">DSA Execution:</strong> Code submitted in the Real-World DSA Lab is executed in isolated sandboxes (Judge0). Execution times, memory consumption, and judge results are subject to system capacity and sandbox constraints.
        </p>
      </Section>

      {/* 7. Pricing Terms */}
      <Section id="pricing-terms" title="7. Pricing & subscriptions">
        <p>
          Core features of Berojgar Engineer Club are currently free of charge. If premium tiers or paid features are introduced, pricing and payment terms will be clearly presented prior to purchase.
        </p>
        <p>
          No payment processing is active unless explicitly indicated on an official checkout flow.
        </p>
      </Section>

      {/* 8. Intellectual Property */}
      <Section id="intellectual-property" title="8. Intellectual property">
        <p>
          The Berojgar Engineer Club name, logo, Berojgar Score™ algorithm, design assets, and source code are the intellectual property of <Placeholder text={LEGAL_ENTITY} /> or its licensors. You may not use our branding without prior written consent.
        </p>
      </Section>

      {/* 9. Termination */}
      <Section id="termination" title="9. Termination & account deletion">
        <p>
          You may stop using the service at any time and request account deletion by emailing{" "}
          <a href="mailto:support@berojgar-engineer.club" className="text-foreground underline">
            support@berojgar-engineer.club
          </a>.
        </p>
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms or engage in abuse of platform infrastructure.
        </p>
      </Section>

      {/* 10. Limitation of Liability */}
      <Section id="limitation-liability" title="10. Disclaimers & limitation of liability">
        <p>
          THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, BEC DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          IN NO EVENT SHALL BEC OR ITS OPERATORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF OR INABILITY TO USE THE PLATFORM.
        </p>
      </Section>

      {/* 11. Governing Law */}
      <Section id="governing-law" title="11. Governing law & dispute resolution">
        <p>
          These Terms are governed by the laws of India. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of the courts located in <Placeholder text={JURISDICTION} />, India.
        </p>
      </Section>

      {/* 12. Contact */}
      <Section id="contact" title="12. Contact & legal notices">
        <p>
          For legal inquiries or terms questions, contact us at:
        </p>
        <div className="rounded-none border border-border bg-surface p-4 space-y-1 text-xs">
          <p className="font-bold text-foreground">Berojgar Engineer Club</p>
          <p>Email: <a href="mailto:support@berojgar-engineer.club" className="underline">support@berojgar-engineer.club</a></p>
          <p>Grievance Officer Email: <Placeholder text={GRIEVANCE_OFFICER_EMAIL} /></p>
          <p>Operator: <Placeholder text={LEGAL_ENTITY} /></p>
          <p>Registered Address: <Placeholder text={REGISTERED_ADDRESS} /></p>
        </div>
        <div className="pt-4 border-t border-border flex flex-wrap gap-4 text-xs">
          <Link href="/privacy" className="text-foreground underline hover:opacity-70">Privacy Policy</Link>
          <Link href="/cookies" className="text-foreground underline hover:opacity-70">Cookie Settings</Link>
        </div>
      </Section>
    </div>
  );
}
