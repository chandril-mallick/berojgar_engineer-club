import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserAvatarUrl(
  user?: { photoURL?: string | null; email?: string | null; displayName?: string | null } | null
): string {
  if (user?.photoURL) {
    return user.photoURL;
  }
  const identifier = user?.displayName || user?.email || "Engineer";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier)}&background=18181b&color=ffffff&bold=true`;
}
