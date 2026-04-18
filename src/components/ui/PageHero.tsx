export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="pt-40 pb-16 md:pt-48 md:pb-24 border-b border-border bg-gradient-radial">
      <div className="container-site">
        <div className="eyebrow mb-6">{eyebrow}</div>
        <h1 className="h-display text-5xl md:text-7xl lg:text-8xl tracking-tightest leading-[0.95] text-balance">
          {title}
        </h1>
        {intro && (
          <p className="mt-8 text-lg md:text-xl text-fg-muted max-w-2xl">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
