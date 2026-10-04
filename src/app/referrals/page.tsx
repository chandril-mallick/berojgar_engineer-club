import { ReferralMarketplace } from "@/components/community/referral-marketplace";

export const metadata = {
  title: "Join the Referral Queue | BEROJGAR ENGINEER CLUB",
  description: "Submit your details once — we'll match you with a real engineer as our referrer network grows.",
};

export default function ReferralsPage() {
  return (
    <div className="py-6 space-y-8">
      <ReferralMarketplace />
    </div>
  );
}
