import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { releases } from "@/lib/mock-data";
import { PageHero } from "@/components/ui/PageHero";

export default async function ReleasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.releases");

  const sorted = [...releases].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero eyebrow="CATALOGUE" title={t("title")} intro={t("intro")} />

      <section className="section">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sorted.map((r) => (
              <Link key={r.slug} href={`/releases/${r.slug}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
                  <Image
                    src={r.cover}
                    alt={r.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="text-sm font-medium truncate">{r.title}</div>
                <div className="text-xs text-fg-muted mt-1 flex items-center justify-between">
                  <span className="truncate">{r.artist}</span>
                  <span className="uppercase tracking-wider text-[10px]">{r.type} · {r.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
