"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/constants";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={item.q}
            className="border border-border bg-white rounded-none transition-colors overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full p-4 flex justify-between items-center text-left gap-4 hover:bg-surface/50 transition-colors"
            >
              <span className="text-xs font-black text-foreground uppercase tracking-wider">
                {item.q}
              </span>
              <ChevronDown
                size={16}
                className={`text-muted transition-transform duration-200 shrink-0 ${
                  isOpen ? "rotate-180 text-foreground" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-xs font-medium text-muted leading-relaxed border-t border-border/40 pt-3 bg-surface/20">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
