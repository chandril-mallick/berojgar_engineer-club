import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/constants";
import { MessageSquare, MessageCircle } from "lucide-react";

function InstagramIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
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

function LinkedinIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
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
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Free vs Pro" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-black/10 shadow-xs shrink-0 bg-white p-[1px]">
            {/* eslint-disable-next-next/no-img-element */}
            <img
              src="/berojgar-logo.png"
              alt="Berojgar Engineer Club Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Berojgar Engineer Club</p>
            <p className="text-xs text-muted">India&apos;s most brutally honest career platform.</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-border bg-muted-bg px-2.5 py-1 text-xs font-medium text-foreground hover:bg-[#0A66C2] hover:text-white transition-all duration-150"
            title="Follow us on LinkedIn"
          >
            <LinkedinIcon size={13} className="text-[#0A66C2]" />
            <span>LinkedIn</span>
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-border bg-muted-bg px-2.5 py-1 text-xs font-medium text-foreground hover:bg-black hover:text-white transition-all duration-150"
            title="Follow us on Instagram"
          >
            <InstagramIcon size={13} className="text-[#E4405F]" />
            <span>Instagram</span>
          </a>
          <a
            href={SOCIAL_LINKS.reddit}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-border bg-muted-bg px-2.5 py-1 text-xs font-medium text-foreground hover:bg-black hover:text-white transition-all duration-150"
            title="Join our Reddit Subreddit"
          >
            <MessageSquare size={13} className="text-[#FF4500]" />
            <span>Reddit</span>
          </a>
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-border bg-muted-bg px-2.5 py-1 text-xs font-medium text-foreground hover:bg-black hover:text-white transition-all duration-150"
            title="Join WhatsApp Channel"
          >
            <MessageCircle size={13} className="text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
        </div>

        <div className="flex flex-col md:items-end gap-2">
          <nav className="flex flex-wrap items-center gap-4">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted hover:text-foreground transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-muted">© {new Date().getFullYear()} BEC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
