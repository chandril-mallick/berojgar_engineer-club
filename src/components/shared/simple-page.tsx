export function SimplePage({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="mx-auto max-w-3xl py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-4 text-sm leading-7 text-muted">{body}</p>
    </section>
  );
}
