"use client";

import { PRIMARY_NAV_LINKS, MORE_NAV_LINKS } from "@/lib/constants";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn, getUserAvatarUrl } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { 
  Menu, 
  X, 
  Bot, 
  ChevronDown, 
  FolderCode, 
  Flame, 
  Users, 
  Laugh, 
  Trophy,
  Sparkles,
  CheckSquare,
  LogIn,
  LogOut,
  User as UserIcon,
  LucideIcon 
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_USER_XP } from "@/lib/xp";
import { UserXP } from "@/types";
import { StreakDisplay } from "@/components/shared/streak-display";
import { NotificationCenter } from "@/components/community/notification-center";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

const MORE_ICONS: Record<string, LucideIcon> = {
  "/tasks": CheckSquare,
  "/projects": FolderCode,
  "/daily-challenge": Flame,
  "/study-groups": Users,
  "/memes": Laugh,
  "/leaderboard": Trophy,
};

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openAuthModal, logout, requireAuth } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);
  const moreRef = useRef<HTMLDivElement>(null);

  const handleProtectedNav = (e: React.MouseEvent, href: string, label: string) => {
    if (!user) {
      e.preventDefault();
      requireAuth(() => router.push(href), `Sign in required to access ${label}.`);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => { 
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Click outside to close "More" dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMoreActive = MORE_NAV_LINKS.some(
    (link) => pathname === link.href || pathname.startsWith(link.href + "/")
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-all duration-200",
          scrolled ? "shadow-md border-border/90 bg-white/95" : "border-border/60",
        )}
      >
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-4 h-14">
          <Logo />

          {/* Desktop nav - concise, non-scrollable */}
          <nav className="hidden items-center gap-1.5 lg:flex">
            {PRIMARY_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleProtectedNav(e, link.href, link.label)}
                  className={cn(
                    "rounded-[8px] px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 shrink-0 whitespace-nowrap",
                    isActive
                      ? "bg-muted-bg text-foreground font-bold"
                      : "text-muted hover:text-foreground hover:bg-muted-bg",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                onMouseEnter={() => setMoreOpen(true)}
                className={cn(
                  "flex items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 shrink-0 whitespace-nowrap",
                  isMoreActive || moreOpen
                    ? "bg-muted-bg text-foreground font-bold"
                    : "text-muted hover:text-foreground hover:bg-muted-bg",
                )}
              >
                <span>More</span>
                <ChevronDown
                  size={13}
                  className={cn(
                    "transition-transform duration-200",
                    moreOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    onMouseLeave={() => setMoreOpen(false)}
                    className="absolute left-0 top-full mt-1.5 w-56 rounded-xl border border-border bg-white p-1.5 shadow-lg shadow-black/5 z-50"
                  >
                    {MORE_NAV_LINKS.map((link) => {
                      const Icon = MORE_ICONS[link.href] || FolderCode;
                      const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleProtectedNav(e, link.href, link.label)}
                          className={cn(
                            "flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors",
                            isActive
                              ? "bg-muted-bg text-foreground font-bold"
                              : "text-muted hover:bg-muted-bg hover:text-foreground"
                          )}
                        >
                          <Icon size={16} className={cn("mt-0.5 shrink-0", isActive ? "text-brand" : "text-muted")} />
                          <div>
                            <div className="font-semibold text-foreground">{link.label}</div>
                            {link.desc && (
                              <div className="text-[11px] font-normal text-muted line-clamp-1">{link.desc}</div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Show Streak, Notifications, and AI Mode ONLY for Authenticated Users */}
            {user && (
              <>
                {userXP.streak > 0 && (
                  <div className="hidden sm:flex shrink-0">
                    <StreakDisplay streak={userXP.streak} compact />
                  </div>
                )}

                <div className="shrink-0">
                  <NotificationCenter />
                </div>

                <Link
                  href="/ai-coach"
                  className="hidden sm:flex items-center gap-1.5 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-900 hover:bg-purple-100 transition-all shadow-2xs shrink-0 whitespace-nowrap"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                  </span>
                  <Sparkles size={13} className="text-purple-600 shrink-0" />
                  <span className="whitespace-nowrap">AI Mode</span>
                </Link>
              </>
            )}

            {/* Auth Button / Profile Dropdown */}
            {user ? (
              <div className="flex items-center gap-2 rounded-full border border-border bg-surface pl-1 pr-2.5 py-1 text-xs font-semibold text-foreground shrink-0 whitespace-nowrap">
                <img
                  src={getUserAvatarUrl(user)}
                  alt={user.displayName || "User"}
                  className="h-6 w-6 rounded-full object-cover border border-border shrink-0"
                />
                <span className="hidden md:inline max-w-[90px] truncate">
                  {user.displayName || "Engineer"}
                </span>
                <button
                  onClick={logout}
                  className="ml-1 text-muted hover:text-rose-600 transition-colors p-0.5 shrink-0"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openAuthModal("Sign in to enter tasks, submit work, or save career progress.")}
                className="gap-1.5 text-xs font-bold border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 shrink-0 whitespace-nowrap"
              >
                <LogIn size={13} className="text-amber-600 shrink-0" />
                <span className="whitespace-nowrap">Sign In</span>
              </Button>
            )}

            <Link href="/assessment" onClick={(e) => handleProtectedNav(e, "/assessment", "Reality Check Assessment")} className="shrink-0">
              <Button size="sm" variant="dark" className="text-xs shrink-0 whitespace-nowrap">
                <span className="whitespace-nowrap">Check My Score</span>
              </Button>
            </Link>

            {/* Mobile burger */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-[8px] text-muted hover:bg-muted-bg hover:text-foreground transition-colors lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-30 bg-black/20 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed top-14 left-0 right-0 z-40 border-b border-border bg-white px-4 py-4 lg:hidden max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <nav className="flex flex-col gap-3">
                <div>
                  <div className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                    Main Features
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {PRIMARY_NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => handleProtectedNav(e, link.href, link.label)}
                        className={cn(
                          "rounded-[8px] px-3 py-2 text-xs font-medium transition-colors",
                          pathname === link.href
                            ? "bg-muted-bg text-foreground font-bold"
                            : "text-muted hover:bg-muted-bg hover:text-foreground",
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                    Community & Explore
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {MORE_NAV_LINKS.map((link) => {
                      const Icon = MORE_ICONS[link.href] || FolderCode;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleProtectedNav(e, link.href, link.label)}
                          className={cn(
                            "flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium transition-colors",
                            pathname === link.href
                              ? "bg-muted-bg text-foreground font-bold"
                              : "text-muted hover:bg-muted-bg hover:text-foreground",
                          )}
                        >
                          <Icon size={15} className="text-muted shrink-0" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-border space-y-2">
                  <Link href="/ai-coach">
                    <Button size="md" variant="ghost" className="w-full gap-2 text-xs justify-center">
                      <Bot size={14} className="text-brand" /> AI Career Coach
                    </Button>
                  </Link>
                  <Link href="/assessment" onClick={(e) => handleProtectedNav(e, "/assessment", "Reality Check Assessment")}>
                    <Button size="md" variant="dark" className="w-full text-xs">
                      Check My Score
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
