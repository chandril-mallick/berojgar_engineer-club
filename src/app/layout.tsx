import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SplashScreen } from "@/components/shared/splash-screen";

export const metadata: Metadata = {
  metadataBase: new URL("https://berojgarengineer.club"),

  // ── Core ────────────────────────────────────────────────────────────────
  title: {
    default: "Berojgar Engineer Club — India's Brutally Honest Career Platform",
    template: "%s — Berojgar Engineer Club",
  },
  description:
    "AI-powered career reality check for Indian engineering students. Get your Berojgar Score, solve real-world DSA problems, roast your resume, and land your first tech job.",
  keywords: [
    "engineering placement",
    "campus placement India",
    "berojgar engineer",
    "DSA practice",
    "resume roast",
    "AI career coach",
    "placement preparation",
    "tech job India",
    "software engineering fresher",
    "leaderboard rank",
  ],
  authors: [{ name: "Berojgar Engineer Club", url: "https://berojgarengineer.club" }],
  category: "Education",
  applicationName: "Berojgar Engineer Club",

  // ── Canonical & Robots ──────────────────────────────────────────────────
  alternates: {
    canonical: "https://berojgarengineer.club",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // ── Open Graph ──────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    url: "https://berojgarengineer.club",
    siteName: "Berojgar Engineer Club",
    locale: "en_IN",
    title: "Berojgar Engineer Club — From Berojgar to Employable",
    description:
      "AI-powered career reality check for engineering students. Get your Berojgar Score, practice real-world DSA, and land your dream tech job.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Berojgar Engineer Club — Career Reality Check Platform",
      },
    ],
  },

  // ── Twitter / X Card ────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@berojgarclub",
    creator: "@berojgarclub",
    title: "Berojgar Engineer Club — India's Brutally Honest Career Platform",
    description:
      "AI-powered career reality check for engineering students. Get your Berojgar Score today.",
    images: ["/og.png"],
  },

  // ── Icons ───────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", type: "image/png" },
      { url: "/berojgar-logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  // ── Theme ───────────────────────────────────────────────────────────────
  other: {
    "theme-color": "#0f0f0f",
    "color-scheme": "light",
  },
};

import { AuthProvider } from "@/components/providers/auth-provider";
import { AuthModal } from "@/components/shared/auth-modal";
import { GlobalAuthGuard } from "@/components/shared/global-auth-guard";
import { CookieConsentBanner } from "@/components/shared/cookie-consent-banner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <QueryProvider>
            <SplashScreen />
            <SiteHeader />
            <main className="mx-auto w-full max-w-[1360px] flex-1 px-6 py-10">
              <GlobalAuthGuard>{children}</GlobalAuthGuard>
            </main>
            <SiteFooter />
            <AuthModal />
            <CookieConsentBanner />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
