import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { artists } from "@/lib/mock-data";
import { PageHero } from "@/components/ui/PageHero";
import { ArrowUpRight } from "lucide-react";

export default async function RosterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.roster");

  return (
    <>
      <PageHero eyebrow="ROSTER" title={t("title")} intro={t("intro")} />

      <section className="section">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((a) => (
              <Link
                key={a.slug}
                href={`/roster/${a.slug}`}
                className="group block relative aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={a.image}
                  alt={a.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-xs text-fg-muted mb-1">{a.genre}</div>
                  <div className="h-display text-2xl flex items-center justify-between">
                    {a.name}
                    <ArrowUpRight size={20} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
