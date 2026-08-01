import { ReferralMarketplace } from "@/components/community/referral-marketplace";

export const metadata = {
  title: "Referral Marketplace | BEROJGAR ENGINEER CLUB",
  description: "Connect with verified working professionals at Google, Microsoft, Amazon, Atlassian, and request employee referrals.",
};

export default function ReferralsPage() {
  return (
    <div className="py-6 space-y-8">
      <ReferralMarketplace />
    </div>
  );
}
