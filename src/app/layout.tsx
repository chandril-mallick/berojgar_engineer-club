import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SplashScreen } from "@/components/shared/splash-screen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://berojgar-engineer.club"),
  title: {
    default: "Berojgar Engineer Club",
    template: "%s — Berojgar Engineer Club",
  },
  description: "India's most brutally honest career platform for engineering students.",
  openGraph: {
    title: "Berojgar Engineer Club",
    description: "From Berojgar to Employable — AI-powered career reality check.",
    images: ["/og.png"],
    siteName: "Berojgar Engineer Club",
  },
  icons: {
    icon: "/berojgar-logo.png",
    shortcut: "/berojgar-logo.png",
    apple: "/berojgar-logo.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Berojgar Engineer Club",
    description: "India's most brutally honest career platform.",
  },
};

import { AuthProvider } from "@/components/providers/auth-provider";
import { AuthModal } from "@/components/shared/auth-modal";
import { GlobalAuthGuard } from "@/components/shared/global-auth-guard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <QueryProvider>
            <SplashScreen />
            <SiteHeader />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
              <GlobalAuthGuard>{children}</GlobalAuthGuard>
            </main>
            <SiteFooter />
            <AuthModal />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
