"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { usePathname, useRouter } from "next/navigation";
import { cn, getUserAvatarUrl } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  LogOut,
  Flame,
  Code,
  Rocket,
  Trophy,
  Laugh,
  MessageSquareQuote,
  Share2,
  FileText,
  Building,
  GraduationCap,
  Award,
  Info
} from "lucide-react";
import { NotificationCenter } from "@/components/community/notification-center";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

interface DropdownItem {
  label: string;
  href: string;
  icon?: any;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openAuthModal, logout, requireAuth } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"practice" | "community" | "more" | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<"practice" | "community" | "more" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleProtectedNav = (e: React.MouseEvent, href: string, label: string) => {
    if (!user && (href === "/daily-challenge" || href === "/referrals")) {
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
    setActiveDropdown(null);
    setProfileMenuOpen(false);
  }, [pathname]);

  // Handle ESC key navigation & Click Outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setProfileMenuOpen(false);
        setMobileOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const practiceItems: DropdownItem[] = [
    { label: "Daily Grind", href: "/daily-challenge", icon: Flame },
    { label: "DSA Lab", href: "/real-world-dsa", icon: Code },
    { label: "Projects", href: "/real-world-dsa", icon: Rocket },
  ];

  const communityItems: DropdownItem[] = [
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "Engineering Memes", href: "/memes", icon: Laugh },
    { label: "Anonymous Placement Stories", href: "/memes", icon: MessageSquareQuote },
    { label: "Referral Marketplace", href: "/referrals", icon: Share2 },
  ];

  const moreItems: DropdownItem[] = [
    { label: "Resume Roast", href: "/resume", icon: FileText },
    { label: "College Rankings", href: "/leaderboard", icon: GraduationCap },
    { label: "Branch Rankings", href: "/leaderboard", icon: GraduationCap },
    { label: "Company Rankings", href: "/offer-wall", icon: Building },
    { label: "Hackathon Rankings", href: "/achievements", icon: Award },
    { label: "About", href: "/about", icon: Info },
  ];

  const isPracticeActive = practiceItems.some(i => pathname === i.href);
  const isCommunityActive = communityItems.some(i => pathname === i.href);
  const isMoreActive = moreItems.some(i => pathname === i.href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-[#c8c8d0] bg-white/95 backdrop-blur-md transition-all duration-200",
        scrolled ? "shadow-2xs bg-white" : "bg-white/95"
      )}
    >
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-6 h-16">
        
        {/* ── LEFT: LOGO + TAGLINE ── */}
        <div className="flex items-center gap-3 shrink-0">
          <Logo size="md" />
          <span className="hidden xl:inline-block text-[10px] font-mono font-extrabold text-foreground/80 border-l border-[#c8c8d0] pl-3 py-1 uppercase tracking-wider">
            Sikhenge &bull; Banayenge &bull; Badlenge
          </span>
        </div>

        {/* ── CENTER: PRIMARY NAV + DROPDOWNS ── */}
        <div className="hidden lg:flex items-center justify-center flex-1" ref={navRef}>
          <nav className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider">
            
            {/* 1. Reality Check (Primary Link) */}
            <Link
              href="/assessment"
              className={cn(
                "px-3 py-2 border transition-colors select-none",
                pathname === "/assessment"
                  ? "bg-black text-white border-black font-extrabold"
                  : "border-transparent text-foreground hover:border-[#c8c8d0] hover:bg-surface"
              )}
            >
              Reality Check
            </Link>

            {/* 2. Practice Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={activeDropdown === "practice"}
                aria-haspopup="true"
                onClick={() => setActiveDropdown(activeDropdown === "practice" ? null : "practice")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 border transition-colors select-none",
                  isPracticeActive || activeDropdown === "practice"
                    ? "bg-surface border-[#c8c8d0] text-foreground font-extrabold"
                    : "border-transparent text-foreground/80 hover:text-foreground hover:border-[#c8c8d0]"
                )}
              >
                <span>Practice</span>
                <ChevronDown
                  size={13}
                  className={cn("transition-transform duration-200", activeDropdown === "practice" && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "practice" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-0 top-full mt-1.5 w-48 border border-[#c8c8d0] bg-white p-1 shadow-md z-50 rounded-none"
                  >
                    {practiceItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={(e) => {
                          handleProtectedNav(e, item.href, item.label);
                          setActiveDropdown(null);
                        }}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-colors",
                          pathname === item.href
                            ? "bg-black text-white"
                            : "text-foreground hover:bg-surface"
                        )}
                      >
                        {item.icon && <item.icon size={13} className="shrink-0" />}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Community Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={activeDropdown === "community"}
                aria-haspopup="true"
                onClick={() => setActiveDropdown(activeDropdown === "community" ? null : "community")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 border transition-colors select-none",
                  isCommunityActive || activeDropdown === "community"
                    ? "bg-surface border-[#c8c8d0] text-foreground font-extrabold"
                    : "border-transparent text-foreground/80 hover:text-foreground hover:border-[#c8c8d0]"
                )}
              >
                <span>Community</span>
                <ChevronDown
                  size={13}
                  className={cn("transition-transform duration-200", activeDropdown === "community" && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "community" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-0 top-full mt-1.5 w-60 border border-[#c8c8d0] bg-white p-1 shadow-md z-50 rounded-none"
                  >
                    {communityItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={(e) => {
                          handleProtectedNav(e, item.href, item.label);
                          setActiveDropdown(null);
                        }}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-colors",
                          pathname === item.href
                            ? "bg-black text-white"
                            : "text-foreground hover:bg-surface"
                        )}
                      >
                        {item.icon && <item.icon size={13} className="shrink-0" />}
                        <span className="truncate">{item.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. More Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={activeDropdown === "more"}
                aria-haspopup="true"
                onClick={() => setActiveDropdown(activeDropdown === "more" ? null : "more")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 border transition-colors select-none",
                  isMoreActive || activeDropdown === "more"
                    ? "bg-surface border-[#c8c8d0] text-foreground font-extrabold"
                    : "border-transparent text-foreground/80 hover:text-foreground hover:border-[#c8c8d0]"
                )}
              >
                <span>More</span>
                <ChevronDown
                  size={13}
                  className={cn("transition-transform duration-200", activeDropdown === "more" && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "more" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-1.5 w-52 border border-[#c8c8d0] bg-white p-1 shadow-md z-50 rounded-none"
                  >
                    {moreItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={(e) => {
                          handleProtectedNav(e, item.href, item.label);
                          setActiveDropdown(null);
                        }}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-colors",
                          pathname === item.href
                            ? "bg-black text-white"
                            : "text-foreground hover:bg-surface"
                        )}
                      >
                        {item.icon && <item.icon size={13} className="shrink-0" />}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </nav>
        </div>

        {/* ── RIGHT: NOTIFICATION, AI COACH, PROFILE ── */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Notification Icon (Logged in) */}
          {user && (
            <div className="shrink-0">
              <NotificationCenter />
            </div>
          )}

          {/* AI Coach Button (Compact Editorial Desktop Button) */}
          <Link
            href="/ai-coach"
            className="hidden sm:flex items-center gap-1.5 bg-black text-white hover:bg-neutral-800 border border-black px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-2xs shrink-0"
          >
            <Sparkles size={13} className="text-[#ffc700]" />
            <span>AI Coach</span>
          </Link>

          {/* Auth State / Profile */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((v) => !v)}
                className="flex items-center gap-2 border border-[#c8c8d0] bg-white px-2 py-1 text-xs font-mono font-bold text-foreground hover:bg-surface transition-colors select-none"
              >
                <img
                  src={getUserAvatarUrl(user)}
                  alt={user.displayName || "User"}
                  className="h-5 w-5 rounded-full object-cover border border-[#c8c8d0] shrink-0"
                />
                <span className="hidden md:inline max-w-[80px] truncate uppercase">
                  {user.displayName?.split(" ")[0] || "Engineer"}
                </span>
                <ChevronDown size={12} className="text-muted" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-1.5 w-44 border border-[#c8c8d0] bg-white p-1 shadow-md z-50 rounded-none font-mono text-xs"
                  >
                    <div className="px-3 py-2 border-b border-[#c8c8d0]">
                      <p className="font-bold text-foreground truncate">{user.displayName || "Engineer"}</p>
                      <p className="text-[10px] text-muted truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left mt-1"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => openAuthModal("Sign in to enter tasks, submit work, or save career progress.")}
                className="text-foreground hover:text-black px-2 py-1.5 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => openAuthModal("Sign in to enter tasks, submit work, or save career progress.")}
                className="bg-[#ffc700] text-black border border-black hover:bg-[#e6b300] px-3.5 py-1.5 transition-colors shadow-2xs"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="flex h-9 w-9 items-center justify-center border border-[#c8c8d0] bg-white text-foreground hover:bg-surface transition-colors lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* ── MOBILE MENU DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-16 left-0 right-0 z-40 border-b border-[#c8c8d0] bg-white p-6 lg:hidden max-h-[85vh] overflow-y-auto font-mono text-xs font-bold uppercase tracking-wider"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <div className="space-y-4">
                
                {/* 1. Reality Check */}
                <Link
                  href="/assessment"
                  onClick={() => setMobileOpen(false)}
                  className="block p-3 border border-black bg-black text-white font-extrabold text-center"
                >
                  Reality Check
                </Link>

                {/* 2. Practice Accordion */}
                <div className="border border-[#c8c8d0] bg-surface">
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === "practice" ? null : "practice")}
                    className="flex w-full items-center justify-between p-3 text-left font-extrabold border-b border-[#c8c8d0] last:border-0"
                  >
                    <span>Practice</span>
                    <ChevronDown size={14} className={cn("transition-transform", mobileAccordion === "practice" && "rotate-180")} />
                  </button>
                  {mobileAccordion === "practice" && (
                    <div className="p-2 space-y-1 bg-white">
                      {practiceItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={(e) => {
                            handleProtectedNav(e, item.href, item.label);
                            setMobileOpen(false);
                          }}
                          className="flex items-center gap-2 p-2 hover:bg-surface text-muted hover:text-foreground"
                        >
                          <item.icon size={13} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Community Accordion */}
                <div className="border border-[#c8c8d0] bg-surface">
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === "community" ? null : "community")}
                    className="flex w-full items-center justify-between p-3 text-left font-extrabold border-b border-[#c8c8d0] last:border-0"
                  >
                    <span>Community</span>
                    <ChevronDown size={14} className={cn("transition-transform", mobileAccordion === "community" && "rotate-180")} />
                  </button>
                  {mobileAccordion === "community" && (
                    <div className="p-2 space-y-1 bg-white">
                      {communityItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={(e) => {
                            handleProtectedNav(e, item.href, item.label);
                            setMobileOpen(false);
                          }}
                          className="flex items-center gap-2 p-2 hover:bg-surface text-muted hover:text-foreground"
                        >
                          <item.icon size={13} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. More Accordion */}
                <div className="border border-[#c8c8d0] bg-surface">
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === "more" ? null : "more")}
                    className="flex w-full items-center justify-between p-3 text-left font-extrabold border-b border-[#c8c8d0] last:border-0"
                  >
                    <span>More</span>
                    <ChevronDown size={14} className={cn("transition-transform", mobileAccordion === "more" && "rotate-180")} />
                  </button>
                  {mobileAccordion === "more" && (
                    <div className="p-2 space-y-1 bg-white">
                      {moreItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={(e) => {
                            handleProtectedNav(e, item.href, item.label);
                            setMobileOpen(false);
                          }}
                          className="flex items-center gap-2 p-2 hover:bg-surface text-muted hover:text-foreground"
                        >
                          <item.icon size={13} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Bottom Actions */}
                <div className="pt-3 space-y-2 border-t border-[#c8c8d0]">
                  <Link
                    href="/ai-coach"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 p-3 bg-black text-white border border-black font-extrabold"
                  >
                    <Sparkles size={14} className="text-[#ffc700]" />
                    <span>AI Coach</span>
                  </Link>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
