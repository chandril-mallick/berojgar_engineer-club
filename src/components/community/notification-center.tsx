"use client";

import { useState } from "react";
import { INITIAL_NOTIFICATIONS } from "@/lib/community-data";
import { NotificationItem } from "@/types/community";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trophy, Handshake, Rocket, Check, X } from "lucide-react";
import Link from "next/link";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-[8px] text-muted hover:bg-muted-bg hover:text-foreground transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 top-11 z-50 w-80 rounded-[14px] border border-border bg-white p-4 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h4 className="text-xs font-bold text-foreground">Notifications</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] font-semibold text-brand hover:underline">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link || "#"}
                    onClick={() => setOpen(false)}
                    className={`block rounded-[8px] p-2.5 border transition-colors ${
                      n.read ? "border-transparent bg-white" : "border-border bg-surface"
                    }`}
                  >
                    <p className="text-xs font-bold text-foreground">{n.title}</p>
                    <p className="text-[11px] text-muted leading-tight mt-0.5">{n.message}</p>
                    <span className="text-[9px] text-muted/60 mt-1 block font-mono">{n.timeAgo}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
