import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/constants";

function TwitterIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function InstagramIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" rx="0.5" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 mb-16 w-full space-y-12">
      {/* 1. Main Footer Link Card */}
      <div className="mx-auto max-w-[1360px] rounded-none border border-[#c8c8d0] bg-white p-8 md:p-12 shadow-xs">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="inline-block group">
              <img
                src="/berojgar-logo.png"
                alt="Berojgar Engineer Club Logo"
                className="h-11 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <p className="text-xs text-muted/80 leading-relaxed max-w-sm font-medium">
              <strong className="text-foreground">Hire Me &bull; Sikhenge &bull; Banayenge &bull; Badlenge.</strong> BEC empowers engineering students to transform raw preparation into clear, measurable career success.
            </p>
            <div className="flex items-center gap-4 text-muted/70">
              <a
                href="https://x.com/berojgarclub"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-150"
              >
                <TwitterIcon size={16} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-150"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-150"
              >
                <LinkedinIcon size={16} />
              </a>
              <a
                href={SOCIAL_LINKS.reddit}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-150"
              >
                <GithubIcon size={16} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-3 gap-4 md:col-span-3">
            {/* Column 1 */}
            <div>
              <h4 className="text-xs font-bold text-foreground mb-3.5">Product</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/ambassador" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    Ambassadors
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-xs font-bold text-foreground mb-3.5">Resources</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/real-world-dsa" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    DSA Lab
                  </Link>
                </li>
                <li>
                  <Link href="/resume" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    Resume Roast
                  </Link>
                </li>
                <li>
                  <Link href="/ai-coach" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    AI Coach
                  </Link>
                </li>
                <li>
                  <Link href="/daily-challenge" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    Daily Challenge
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-xs font-bold text-foreground mb-3.5">Company</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Giant Brand Watermark Banner (AFTER the main footer card) */}
      <div className="mx-auto max-w-5xl flex items-center justify-center gap-4 select-none py-6 border-b border-border/40">
        <img
          src="/berojgar-logo.png"
          alt="Berojgar Logo"
          className="h-24 md:h-32 w-auto object-contain opacity-30 select-none pointer-events-none"
        />
      </div>

      {/* 3. Bottom Bar (Copyright & Legal) */}
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 px-4 text-muted/60 text-xs">
        <p className="flex items-center gap-2 select-none">
          <span>&copy; {new Date().getFullYear()}</span>
          <img
            src="/berojgar-logo.png"
            alt="Berojgar Engineer Club Logo"
            className="h-5 w-auto object-contain inline-block select-none pointer-events-none"
          />
          <span>BEC. All rights reserved.</span>
        </p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
            Terms of Service
          </Link>
          <button className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
            Cookie Settings
          </button>
        </div>
      </div>
    </footer>
  );
}

