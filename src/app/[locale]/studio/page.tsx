import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/ui/PageHero";

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
