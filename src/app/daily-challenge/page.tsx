import { DailyChallengeWidget } from "@/components/community/daily-challenge-widget";

export const metadata = {
  title: "Daily Coding Challenge | BEROJGAR ENGINEER CLUB",
  description: "Daily DSA, Aptitude, SQL, CS Fundamentals, and AI questions to maintain your streak and gain XP.",
};

export default function DailyChallengePage() {
  return (
    <div className="py-6 space-y-8 max-w-4xl mx-auto">
      <DailyChallengeWidget />
    </div>
  );
}
