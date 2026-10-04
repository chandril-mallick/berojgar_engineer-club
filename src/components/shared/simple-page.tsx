import { PageContainer } from "@/components/shared/page-container";
import { PageHeading } from "@/components/shared/section-heading";

export function SimplePage({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <PageContainer size="narrow">
      <PageHeading>{title}</PageHeading>
      <p className="text-sm leading-7 text-muted">{body}</p>
    </PageContainer>
  );
}
