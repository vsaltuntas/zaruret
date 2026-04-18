import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/ui/PageHero";
import {
  Sliders,
  Radio,
  Sparkles,
  Rocket,
  ArrowRight,
  Headphones,
  Compass,
  FileAudio,
  Megaphone,
  ShieldCheck,
  Users,
  Globe,
} from "lucide-react";
import { pageMeta } from "../metadata";

type Bilingual = { tr: string; en: string };

const offerings: {
  keyword: "mixing" | "mastering" | "production" | "aAndR";
  Icon: typeof Sliders;
  desc: Bilingual;
  includes: Bilingual[];
}[] = [
  {
    keyword: "mixing",
    Icon: Sliders,
    desc: {
      tr: "Şarkının karakterini koruyarak modern, profesyonel bir mix. Analog ve ITB hibrit yaklaşım.",
      en: "A modern, professional mix that preserves the song's character. Hybrid analog + ITB approach.",
    },
    includes: [
      { tr: "Stem düzenleme ve temizlik", en: "Stem editing & cleanup" },
      { tr: "Analog + ITB hibrit mix", en: "Hybrid analog + ITB mix" },
      { tr: "3 revizyon dahil", en: "3 revisions included" },
      { tr: "Stem & instrumental teslim", en: "Stem & instrumental delivery" },
    ],
  },
  {
    keyword: "mastering",
    Icon: Radio,
    desc: {
      tr: "Dinamikleri koruyan, streaming ve vinyl için uygun son kalite kontrol.",
      en: "Final quality control that preserves dynamics — streaming and vinyl ready.",
    },
    includes: [
      { tr: "Streaming-optimize mastering", en: "Streaming-optimised mastering" },
      { tr: "Vinyl / CD alternatif versiyonlar", en: "Vinyl / CD alternate cuts" },
      { tr: "ISRC & BWAV metadata", en: "ISRC & BWAV metadata" },
      { tr: "Referans karşılaştırma raporu", en: "Reference comparison report" },
    ],
  },
  {
    keyword: "production",
    Icon: Sparkles,
    desc: {
      tr: "Fikir aşamasından bitmiş yapıma. Aranjman, enstrümantasyon ve yaratıcı yönlendirme.",
      en: "From idea to finished record. Arrangement, instrumentation and creative direction.",
    },
    includes: [
      { tr: "Pre-prodüksiyon ve demo geliştirme", en: "Pre-production & demo development" },
      { tr: "Aranjman ve enstrümantasyon", en: "Arrangement & instrumentation" },
      { tr: "Session müzisyen koordinasyonu", en: "Session musician coordination" },
      { tr: "Yaratıcı yönlendirme", en: "Creative direction" },
    ],
  },
  {
    keyword: "aAndR",
    Icon: Rocket,
    desc: {
      tr: "Sanatçı gelişimi, release stratejisi, yayın ve dağıtım.",
      en: "Artist development, release strategy, distribution and publishing.",
    },
    includes: [
      { tr: "Katalog ve release planlaması", en: "Catalogue & release planning" },
      { tr: "Dağıtım (Spotify, Apple, Bandcamp)", en: "Distribution (Spotify, Apple, Bandcamp)" },
      { tr: "Basın ve tanıtım koordinasyonu", en: "Press & promotion coordination" },
      { tr: "Telif ve yayıncılık yönetimi", en: "Royalty & publishing management" },
    ],
  },
];

const processSteps: { number: string; titleKey: Bilingual; descKey: Bilingual }[] = [
  {
    number: "01",
    titleKey: { tr: "Dinleme", en: "Listen" },
    descKey: {
      tr: "Demoları, canlı kayıtları ve fikirleri dikkatle inceliyoruz. Karakter ve potansiyel esas.",
      en: "We listen carefully to demos, live takes, and ideas. Character and potential come first.",
    },
  },
  {
    number: "02",
    titleKey: { tr: "Tanışma", en: "Connect" },
    descKey: {
      tr: "Sanatçıyla yüz yüze konuşuyoruz. Hedef, referans ve vizyon netleşsin.",
      en: "We meet the artist in person. Goals, references and vision become clear.",
    },
  },
  {
    number: "03",
    titleKey: { tr: "Planlama", en: "Plan" },
    descKey: {
      tr: "Yaratıcı yönlendirme, takvim, bütçe ve sanatsal kararların ortak planı.",
      en: "A shared plan of creative direction, timeline, budget and artistic decisions.",
    },
  },
  {
    number: "04",
    titleKey: { tr: "Kayıt & Prodüksiyon", en: "Record & Produce" },
    descKey: {
      tr: "Stüdyoda prodüksiyon, canlı kayıt, aranjman ve overdub süreçleri.",
      en: "Studio production, live tracking, arrangement and overdub sessions.",
    },
  },
  {
    number: "05",
    titleKey: { tr: "Mix & Master", en: "Mix & Master" },
    descKey: {
      tr: "Hibrit mix zinciri ve hassas mastering ile son hâline kavuşan kayıt.",
      en: "Hybrid mix chain and precision mastering bring the record to its final form.",
    },
  },
  {
    number: "06",
    titleKey: { tr: "Yayın & Destek", en: "Release & Support" },
    descKey: {
      tr: "Dağıtım, basın, tanıtım ve sanatçının uzun vadeli kariyer desteği.",
      en: "Distribution, press, promotion and long-term career support for the artist.",
    },
  },
];

const whyPoints: { Icon: typeof Headphones; titleKey: Bilingual; descKey: Bilingual }[] = [
  {
    Icon: Headphones,
    titleKey: { tr: "Sanatçı-merkezli", en: "Artist-first" },
    descKey: {
      tr: "Sanatçının sesini cilalıyoruz, üstüne yazmıyoruz. Karar önceliği sanatçıda.",
      en: "We polish the artist's voice, never overwrite it. The artist keeps creative authority.",
    },
  },
  {
    Icon: ShieldCheck,
    titleKey: { tr: "Şeffaf süreç", en: "Transparent process" },
    descKey: {
      tr: "Bütçe, takvim, telif ve katalog net yazılı. Sürprize yer yok.",
      en: "Budget, timeline, royalties and catalogue — clearly documented. No surprises.",
    },
  },
  {
    Icon: Compass,
    titleKey: { tr: "Analog + dijital hibrit", en: "Hybrid analog + digital" },
    descKey: {
      tr: "Vintage outboard'un sıcaklığı, modern DAW'ların hassasiyeti. İki dünyanın en iyisi.",
      en: "The warmth of vintage outboard, the precision of modern DAWs. Best of both worlds.",
    },
  },
  {
    Icon: Globe,
    titleKey: { tr: "Lokal köklü, global ulaşımlı", en: "Local roots, global reach" },
    descKey: {
      tr: "Anadolu ve Türkiye sahnesiyle yakın bağ, dünya dağıtımıyla erişim.",
      en: "Close ties to the Turkish and Anatolian scene, global distribution reach.",
    },
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta(locale, "services");
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

      {/* Offerings */}
      <section className="section">
        <div className="container-site">
          <div className="eyebrow mb-4">{t("offeringsEyebrow")}</div>
          <h2 className="section-title mb-16 max-w-3xl">{t("offeringsTitle")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerings.map(({ keyword, Icon, desc, includes }, i) => (
              <div
                key={keyword}
                className="card card-hover p-8 md:p-10 flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <Icon size={28} className="text-accent" strokeWidth={1.4} />
                  <div className="text-xs text-fg-muted tabular-nums tracking-wider">
                    0{i + 1}
                  </div>
                </div>
                <div>
                  <h3 className="h-display text-3xl md:text-4xl mb-3 leading-tight">
                    {t(keyword)}
                  </h3>
                  <p className="text-fg-muted leading-relaxed">{desc[loc]}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="eyebrow mb-3">{t("includes")}</div>
                  <ul className="space-y-2 text-sm text-fg-muted">
                    {includes.map((it, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                        <span>{it[loc]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section border-t border-border">
        <div className="container-site">
          <div className="eyebrow mb-4">{t("processEyebrow")}</div>
          <h2 className="section-title mb-16 max-w-3xl">{t("processTitle")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-8 md:gap-y-14">
            {processSteps.map((step) => (
              <div key={step.number} className="relative pl-4 border-l border-border">
                <div className="h-display text-5xl md:text-6xl text-accent/40 tabular-nums leading-none mb-4">
                  {step.number}
                </div>
                <h3 className="h-display text-xl md:text-2xl mb-2">
                  {step.titleKey[loc]}
                </h3>
                <p className="text-sm text-fg-muted leading-relaxed max-w-sm">
                  {step.descKey[loc]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="section border-t border-border">
        <div className="container-site">
          <div className="eyebrow mb-4">{t("whyEyebrow")}</div>
          <h2 className="section-title mb-16 max-w-3xl">{t("whyTitle")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyPoints.map(({ Icon, titleKey, descKey }, i) => (
              <div key={i} className="flex gap-6 p-6 md:p-8 rounded-2xl bg-bg-elevated/40">
                <div className="shrink-0">
                  <Icon size={28} className="text-accent" strokeWidth={1.4} />
                </div>
                <div>
                  <h3 className="h-display text-xl md:text-2xl mb-2">
                    {titleKey[loc]}
                  </h3>
                  <p className="text-sm text-fg-muted leading-relaxed">
                    {descKey[loc]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section border-t border-border">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bg-elevated via-bg-elevated to-bg p-10 md:p-16 lg:p-20">
            <div
              aria-hidden
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,175,55,0.35) 0%, transparent 70%)",
              }}
            />
            <div className="relative max-w-3xl">
              <div className="eyebrow mb-6">{t("ctaEyebrow")}</div>
              <h2 className="h-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tightest mb-6">
                {t("ctaTitle")}
              </h2>
              <p className="text-lg text-fg-muted max-w-2xl mb-10 leading-relaxed">
                {t("ctaBody")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn btn-primary">
                  {t("ctaPrimary")}
                  <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  {t("ctaSecondary")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
