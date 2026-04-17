import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/ui/PageHero";
import { Sliders, Radio, Sparkles, Rocket, ArrowRight } from "lucide-react";
import { pageMeta } from '../metadata';

const items = [
  {
    keyword: "mixing",
    Icon: Sliders,
    desc: {
      tr: "Şarkının karakterini koruyarak modern, profesyonel bir mix. Analog ve ITB hibrit yaklaşım.",
      en: "A modern, professional mix that preserves the song's character. Hybrid analog + ITB approach.",
    },
  },
  {
    keyword: "mastering",
    Icon: Radio,
    desc: {
      tr: "Dinamikleri koruyan, streaming ve vinyl için uygun son kalite kontrol.",
      en: "Final quality control that preserves dynamics — streaming and vinyl ready.",
    },
  },
  {
    keyword: "production",
    Icon: Sparkles,
    desc: {
      tr: "Fikir aşamasından bitmiş yapıma. Aranjman, enstrümantasyon ve yaratıcı yönlendirme.",
      en: "From idea to finished record. Arrangement, instrumentation and creative direction.",
    },
  },
  {
    keyword: "aAndR",
    Icon: Rocket,
    desc: {
      tr: "Sanatçı gelişimi, release stratejisi, yayın ve dağıtım.",
      en: "Artist development, release strategy, distribution and publishing.",
    },
  },
] as const;


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMeta(locale, 'services');
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.services");
  const loc = locale as "tr" | "en";

  return (
    <>
      <PageHero eyebrow="SERVICES" title={t("title")} intro={t("intro")} />

      <section className="section">
        <div className="container-site">
          <div className="space-y-6">
            {items.map(({ keyword, Icon, desc }, i) => (
              <div
                key={keyword}
                className="card card-hover p-8 md:p-12 grid md:grid-cols-[auto_1fr_auto] items-center gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="text-fg-muted text-2xl font-display">
                    0{i + 1}
                  </div>
                  <Icon size={32} className="text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="h-display text-3xl md:text-4xl mb-2">
                    {t(keyword)}
                  </h3>
                  <p className="text-fg-muted max-w-2xl">{desc[loc]}</p>
                </div>
                <Link href="/contact" className="btn btn-outline self-center">
                  {t("requestQuote")}
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
