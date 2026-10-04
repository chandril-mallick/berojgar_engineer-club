"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as T;
        queueMicrotask(() => setValue(parsed));
      }
    } catch {
      // ignore
    }
  }, [key]);

  const updateValue = (nextValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const valueToStore = nextValue instanceof Function ? nextValue(prev) : nextValue;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch {
          // ignore
        }
      }
      return valueToStore;
    });
  };

  return [value, updateValue] as const;
}
