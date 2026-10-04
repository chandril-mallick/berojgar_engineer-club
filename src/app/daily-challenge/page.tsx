import { DailyChallengeWidget } from "@/components/community/daily-challenge-widget";

export const metadata = {
  title: "Daily Coding Challenge | BEROJGAR ENGINEER CLUB",
  description: "Daily DSA, Aptitude, SQL, CS Fundamentals, and AI questions to maintain your streak and gain XP.",
};

export default function DailyChallengePage() {
  return (
    // Full-bleed: escape root layout's px-6 py-10 so the workspace fills
    // the entire viewport width (like LeetCode / CoderPad workspaces)
    <div className="-mx-6 -my-10 h-[calc(100vh-4rem)] overflow-hidden">
      <DailyChallengeWidget />
    </div>
  );
}
