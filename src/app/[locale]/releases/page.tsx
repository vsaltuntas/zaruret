import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getReleases, getArtists } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { ReleaseCover } from "@/components/media/ReleaseCover";
import { pageMeta } from '../metadata';


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMeta(locale, 'releases');
}

export default async function ReleasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.releases");

  const sorted = getReleases();
  const artistName = (slug: string) =>
    getArtists().find((a) => a.slug === slug)?.name ?? slug;

  return (
    <>
      <PageHero eyebrow="CATALOGUE" title={t("title")} intro={t("intro")} />

      <section className="section">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sorted.map((r) => (
              <Link key={r.slug} href={`/releases/${r.slug}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
                  <ReleaseCover
                    cover={r.cover}
                    title={r.title}
                    artistName={artistName(r.artistSlug)}
                    type={r.type}
                    year={r.year}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    imgClassName="group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="text-sm font-medium truncate">{r.title}</div>
                <div className="text-xs text-fg-muted mt-1 flex items-center justify-between">
                  <span className="truncate">{artistName(r.artistSlug)}</span>
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
