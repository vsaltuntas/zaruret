export function Marquee() {
  const words = [
    "LABEL",
    "STUDIO",
    "PRODUCTION",
    "EVENTS",
    "MIXING",
    "MASTERING",
    "A&R",
    "PUBLISHING",
  ];
  return (
    <section className="py-16 border-y border-border overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...words, ...words, ...words].map((w, i) => (
          <span
            key={i}
            className="h-display text-5xl md:text-7xl tracking-tightest text-white/90 mx-8 flex items-center gap-8"
          >
            {w}
            <span className="text-accent text-4xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
