import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";

const team = [
  {
    name: "V. Saltuntaş",
    role: { tr: "Kurucu & Direktör", en: "Founder & Director" },
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    name: "Ece Yıldız",
    role: { tr: "A&R & Yayın", en: "A&R & Publishing" },
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
  },
  {
    name: "Emre Kaya",
    role: { tr: "Baş Mühendis", en: "Chief Engineer" },
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
  },
  {
    name: "Selin Demir",
    role: { tr: "Etkinlik Direktörü", en: "Events Director" },
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.about");
  const loc = locale as "tr" | "en";

  return (
    <>
      <PageHero eyebrow="ABOUT" title={t("title")} intro={t("intro")} />

      <section className="section">
        <div className="container-site grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <div className="eyebrow mb-4">MISSION</div>
            <h2 className="section-title mb-8">{t("missionTitle")}</h2>
            <p className="text-lg text-fg-muted leading-relaxed">
              {t("missionBody")}
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80"
              alt="Zaruret"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover grayscale"
            />
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-site">
          <div className="eyebrow mb-4">TEAM</div>
          <h2 className="section-title mb-16">{t("team")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.name}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-4">
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="h-display text-lg">{m.name}</div>
                <div className="text-xs text-fg-muted mt-1 uppercase tracking-wider">
                  {m.role[loc]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
