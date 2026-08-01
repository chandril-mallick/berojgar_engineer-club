import { CompanyHub } from "@/components/community/company-hub";

export const metadata = {
  title: "Company Preparation Hub | BEROJGAR ENGINEER CLUB",
  description: "Company-specific preparation guides, hiring rounds, OA questions, salary packages, and referral requests.",
};

export default function CompaniesPage() {
  return (
    <div className="py-6 space-y-8">
      <CompanyHub />
    </div>
  );
}
