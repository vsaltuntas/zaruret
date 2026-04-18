import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/ui/PageHero";
import { pageMeta } from '../metadata';

const equipmentGroups = [
  {
    keyword: "mics",
    items: [
      "Neumann U87 Ai",
      "Neumann TLM 103",
      "AKG C414 XLII",
      "Shure SM7B",
      "Sennheiser MD 421",
      "Royer R-121",
    ],
  },
  {
    keyword: "outboard",
    items: [
      "Universal Audio 1176LN",
      "API 500-series lunchbox",
      "Tube-Tech CL 1B",
      "Avalon VT-737SP",
      "SSL Fusion",
      "Lexicon PCM 96",
    ],
  },
  {
    keyword: "monitors",
    items: [
      "Focal Trio6 Be",
      "Yamaha NS-10M",
      "Genelec 8030C",
      "Auratone 5C",
    ],
  },
  {
    keyword: "instruments",
    items: [
      "Yamaha U1 Upright",
      "Fender Telecaster '72",
      "Gibson Les Paul Studio",
      "Moog Subsequent 37",
      "Rhodes Mark I",
      "Ludwig Classic Maple",
    ],
  },
] as const;

const gallery = [
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=80",
  "https://images.unsplash.com/photo-1520170350707-b2da59970118?w=1600&q=80",
  "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1600&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1600&q=80",
  "https://images.unsplash.com/photo-1484755560615-676f2cd74d3e?w=1600&q=80",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1600&q=80",
];


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMeta(locale, 'studio');
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.studio");

  return (
    <>
      <PageHero eyebrow="STUDIO" title={t("title")} intro={t("intro")} />

      <section className="pb-10 md:pb-16 -mt-4">
        <div className="container-site">
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4 md:min-w-[180px]">
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </div>
              <div className="text-xs uppercase tracking-[0.22em] text-accent font-medium">
                {t("comingSoonLabel")}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="h-display text-3xl md:text-4xl leading-tight mb-3">
                {t("comingSoonTitle")}
              </h2>
              <p className="text-fg-muted leading-relaxed max-w-3xl">
                {t("comingSoonBody")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-site">
          <div className="eyebrow mb-4">EQUIPMENT</div>
          <h2 className="section-title mb-16">{t("equipment")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipmentGroups.map((group) => (
              <div key={group.keyword} className="card p-6">
                <h3 className="h-display text-xl mb-4 text-accent">
                  {t(group.keyword)}
                </h3>
                <ul className="space-y-2 text-sm text-fg-muted">
                  {group.items.map((it) => (
                    <li key={it} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-site">
          <div className="eyebrow mb-4">GALLERY</div>
          <h2 className="section-title mb-16">{t("gallery")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={`Studio ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/contact" className="btn btn-primary">
              {t("bookNow")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
