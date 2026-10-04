// Not legal advice. Have a lawyer review before launch.
import Link from "next/link";

const LAST_UPDATED = "[PLACEHOLDER: insert date, e.g. October 2026]";
const LEGAL_ENTITY = "[PLACEHOLDER: legal entity name, e.g. BEC Technologies Pvt. Ltd.]";
const REGISTERED_ADDRESS = "[PLACEHOLDER: registered address]";
const GRIEVANCE_OFFICER_NAME = "[PLACEHOLDER: Grievance Officer name]";
const GRIEVANCE_OFFICER_EMAIL = "[PLACEHOLDER: grievance officer email]";
const JURISDICTION = "[PLACEHOLDER: city/state, e.g. Kolkata, West Bengal]";

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

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 py-4">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-1">Legal</p>
        <h1 className="font-heading text-2xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-xs text-muted">
          Last updated: <Placeholder text={LAST_UPDATED} />
        </p>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Berojgar Engineer Club (&quot;BEC&quot;, &quot;we&quot;, &quot;our&quot;) is a career-readiness platform for
          Indian engineering students. This policy explains what data we collect, why, and what
          your rights are — written in plain language, not legalese.
        </p>
        <div className="mt-4 rounded-none border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <strong>Note for operator:</strong> Yellow-highlighted values like{" "}
          <Placeholder text="[PLACEHOLDER]" /> must be filled in before launch. See the full
          placeholder list in the PR description.
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="rounded-none border border-border bg-surface p-5">
        <p className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Contents</p>
        <ol className="space-y-1.5 text-xs text-muted list-decimal list-inside">
          {[
            ["who-we-are", "Who we are"],
            ["data-collected", "What data we collect"],
            ["not-collected", "What we do NOT do"],
            ["third-parties", "Third-party services"],
            ["retention", "Data retention"],
            ["your-rights", "Your rights (including DPDP Act 2023)"],
            ["children", "Children's privacy"],
            ["security", "Security"],
            ["changes", "Changes to this policy"],
            ["contact", "Contact & grievance officer"],
          ].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="hover:text-foreground underline underline-offset-2">
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1. Who we are */}
      <Section id="who-we-are" title="1. Who we are">
        <p>
          Berojgar Engineer Club is operated by{" "}
          <Placeholder text={LEGAL_ENTITY} /> with a registered address at{" "}
          <Placeholder text={REGISTERED_ADDRESS} />.
        </p>
        <p>
          For privacy inquiries, email us at{" "}
          <a href="mailto:support@berojgar-engineer.club" className="text-foreground underline">
            support@berojgar-engineer.club
          </a>
          .
        </p>
      </Section>

      {/* 2. What data we collect */}
      <Section id="data-collected" title="2. What data we collect">
        <p>We collect only what we need to run the platform.</p>

        <div className="space-y-4">
          <div>
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Account data (Firebase Auth)</p>
            <p>
              When you sign in with Google or GitHub OAuth, Firebase provides us with your name,
              email address, and profile photo. If you use email/password sign-up, we receive your
              email address and a salted hash of your password (stored by Firebase — we never see
              the raw password). Guest sign-in creates an anonymous account with no personal
              identifiers.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Assessment inputs</p>
            <p>
              When you take the Berojgar Score assessment, you provide information about your
              engineering branch, college, CGPA, year of study, project count, GitHub activity,
              DSA practice, communication skills, internships, and target companies. This data is
              processed locally in your browser (for the score calculation) and saved to your
              Firestore account document if you are logged in.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Resume text (local only)</p>
            <p>
              The resume roast tool extracts text from your PDF using the{" "}
              <code className="font-mono text-xs bg-surface border border-border px-1">pdf-parse</code>{" "}
              library. This extraction happens entirely within the Next.js API route on our server —
              the raw PDF text is processed and then discarded. We store only the resulting ATS
              score and feedback summary in Firestore, not your full resume text.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Code submissions (DSA Lab)</p>
            <p>
              When you submit code in the Real-World DSA Lab, the source code and language are sent
              to Judge0 (a third-party code execution sandbox) for running. Judge0 receives your
              code and the stdin input; it returns stdout/stderr output. We do not permanently store
              your code submissions on our own servers beyond your run history in localStorage.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">IP addresses (rate limiting)</p>
            <p>
              Each request to our API routes passes through a rate limiter. Your IP address is used
              as the rate-limit key and is stored transiently in Upstash Redis with a short TTL
              (typically 1–15 minutes). We do not build profiles from IP data.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Browser storage (localStorage)</p>
            <p>
              We store your XP, streak, badge state, daily challenge completion, roadmap progress,
              and score results in your browser&apos;s localStorage. This data never leaves your device
              unless you are signed in (in which case Firestore holds a synced copy). See the{" "}
              <Link href="/cookies" className="text-foreground underline">Cookie Settings</Link>{" "}
              page for the full list.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Community content</p>
            <p>
              If you post in community features (offer wall, referral marketplace, meme feed), the
              content you submit is stored in Firestore and visible to other signed-in users. Do
              not post personally sensitive information in public community areas.
            </p>
          </div>
        </div>
      </Section>

      {/* 3. What we do NOT do */}
      <Section id="not-collected" title="3. What we do NOT do">
        <ul className="space-y-2 list-none pl-0">
          {[
            "We do not sell your personal data to anyone.",
            "We do not send your resume text to any third-party AI or language model.",
            "We do not use tracking cookies, ad networks, or behavioural advertising pixels.",
            "We do not knowingly collect data from users under 18.",
            "We do not make employment decisions based on your Berojgar Score — it is an advisory tool only.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-success mt-1 shrink-0">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. Third-party services */}
      <Section id="third-parties" title="4. Third-party services">
        <p>We use a small set of infrastructure providers. Each receives only the data necessary for its function.</p>
        <div className="space-y-3">
          {[
            {
              name: "Firebase (Google LLC)",
              what: "Authentication (login sessions) and Firestore (user profile, assessment history, community content).",
              link: "https://firebase.google.com/support/privacy",
              linkLabel: "Firebase Privacy Policy",
            },
            {
              name: "Judge0 / RapidAPI",
              what: "Remote code execution for the DSA Lab. Your source code and stdin are sent to Judge0 for execution; output is returned and displayed. Judge0 is a sandboxed environment.",
              link: "https://judge0.com/privacy",
              linkLabel: "Judge0 Privacy Policy",
            },
            {
              name: "Upstash",
              what: "Redis-backed rate limiting for our API routes. Your IP address is stored with a short TTL for request throttling only.",
              link: "https://upstash.com/trust/privacy.pdf",
              linkLabel: "Upstash Privacy Policy",
            },
            {
              name: "Vercel (deployment host)",
              what: "Hosts the Next.js application. Vercel may log request metadata (including IP) for infrastructure purposes.",
              link: "https://vercel.com/legal/privacy-policy",
              linkLabel: "Vercel Privacy Policy",
            },
          ].map((p) => (
            <div key={p.name} className="rounded-none border border-border p-4 space-y-1">
              <p className="text-xs font-bold text-foreground">{p.name}</p>
              <p className="text-xs">{p.what}</p>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-foreground underline hover:opacity-70"
              >
                {p.linkLabel} ↗
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Retention */}
      <Section id="retention" title="5. Data retention">
        <p>
          <strong className="text-foreground">Account &amp; profile data</strong> is retained
          until you delete your account. To request deletion, email{" "}
          <a href="mailto:support@berojgar-engineer.club" className="text-foreground underline">
            support@berojgar-engineer.club
          </a>{" "}
          from your registered address — we will process it within 30 days.
        </p>
        <p>
          <strong className="text-foreground">Assessment history</strong> is kept in Firestore
          alongside your profile. It is deleted when your account is deleted.
        </p>
        <p>
          <strong className="text-foreground">Rate-limit IP records</strong> in Upstash Redis
          expire automatically within the rate-limit window (maximum 15 minutes).
        </p>
        <p>
          <strong className="text-foreground">Browser localStorage</strong> data persists until
          you clear your browser storage or delete your account (we clear the Firestore mirror on
          account deletion; local data must be cleared manually from browser settings).
        </p>
        <p>
          <strong className="text-foreground">Resume PDF text</strong> is never stored — it is
          processed and discarded within the API request cycle.
        </p>
      </Section>

      {/* 6. Your rights */}
      <Section id="your-rights" title="6. Your rights (including India's DPDP Act 2023)">
        <p>
          India&apos;s{" "}
          <strong className="text-foreground">Digital Personal Data Protection (DPDP) Act 2023</strong>{" "}
          grants you the following rights as a Data Principal. We honour all of them:
        </p>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <strong className="text-foreground">Right to access</strong> — Request a copy of
            personal data we hold about you.
          </li>
          <li>
            <strong className="text-foreground">Right to correction</strong> — Update inaccurate
            data via your profile page or by emailing us.
          </li>
          <li>
            <strong className="text-foreground">Right to erasure</strong> — Request deletion of
            your account and associated personal data.
          </li>
          <li>
            <strong className="text-foreground">Right to grievance redressal</strong> — If you
            are unsatisfied with our response, escalate to our Grievance Officer (see §10).
          </li>
          <li>
            <strong className="text-foreground">Right to withdraw consent</strong> — You may
            withdraw optional consent (e.g. functional cookies) at any time via the{" "}
            <Link href="/cookies" className="text-foreground underline">Cookie Settings</Link> page.
          </li>
        </ul>
        <p>
          All requests should be emailed to{" "}
          <a href="mailto:support@berojgar-engineer.club" className="text-foreground underline">
            support@berojgar-engineer.club
          </a>
          . We will respond within 30 days.
        </p>
        <div className="rounded-none border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <strong>Operator note:</strong> The DPDP Act requires significant data fiduciaries to
          appoint a Data Protection Officer and publish their contact. Even if not yet a
          &quot;significant fiduciary&quot;, appoint a Grievance Officer immediately. Fill in{" "}
          <Placeholder text={GRIEVANCE_OFFICER_NAME} /> and{" "}
          <Placeholder text={GRIEVANCE_OFFICER_EMAIL} /> below before launch.
        </div>
      </Section>

      {/* 7. Children */}
      <Section id="children" title="7. Children's privacy">
        <p>
          Berojgar Engineer Club is intended for engineering students who are 18 years of age or
          older. We do not knowingly collect personal data from anyone under 18. If you believe a
          minor has created an account, please contact us at{" "}
          <a href="mailto:support@berojgar-engineer.club" className="text-foreground underline">
            support@berojgar-engineer.club
          </a>{" "}
          and we will delete the account promptly.
        </p>
      </Section>

      {/* 8. Security */}
      <Section id="security" title="8. Security">
        <p>
          We use Firebase Authentication (industry-standard OAuth 2.0 and password hashing) and
          Firestore (Google-managed encryption at rest and in transit). API endpoints are protected
          by rate limiting to prevent abuse.
        </p>
        <p>
          No system is 100% secure. If you discover a vulnerability, please report it
          responsibly to{" "}
          <a href="mailto:support@berojgar-engineer.club" className="text-foreground underline">
            support@berojgar-engineer.club
          </a>
          .
        </p>
      </Section>

      {/* 9. Changes */}
      <Section id="changes" title="9. Changes to this policy">
        <p>
          We may update this policy to reflect changes in the platform or law. For material
          changes, we will post a notice on the platform. The &quot;last updated&quot; date at the top of
          this page always reflects the current version.
        </p>
      </Section>

      {/* 10. Contact */}
      <Section id="contact" title="10. Contact & grievance officer">
        <p>
          For general privacy questions: email{" "}
          <a href="mailto:support@berojgar-engineer.club" className="text-foreground underline">
            support@berojgar-engineer.club
          </a>
          .
        </p>
        <div className="rounded-none border border-border bg-surface p-4 space-y-1 text-xs">
          <p className="font-bold text-foreground">Grievance Officer (DPDP Act 2023)</p>
          <p>Name: <Placeholder text={GRIEVANCE_OFFICER_NAME} /></p>
          <p>Email: <Placeholder text={GRIEVANCE_OFFICER_EMAIL} /></p>
          <p>Operator: <Placeholder text={LEGAL_ENTITY} /></p>
          <p>Registered address: <Placeholder text={REGISTERED_ADDRESS} /></p>
          <p>Jurisdiction: <Placeholder text={JURISDICTION} />, India</p>
        </div>
        <div className="pt-4 border-t border-border flex flex-wrap gap-4 text-xs">
          <Link href="/terms" className="text-foreground underline hover:opacity-70">Terms of Service</Link>
          <Link href="/cookies" className="text-foreground underline hover:opacity-70">Cookie Settings</Link>
        </div>
      </Section>
    </div>
  );
}
