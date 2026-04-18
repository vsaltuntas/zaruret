import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getArtists, getArtist, getReleasesByArtist } from "@/lib/content";
import { Instagram, Youtube, Music2, ArrowUpRight } from "lucide-react";
import { JsonLd, artistSchema } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  const items = getArtists();
  return items.length > 0 ? items.map((a) => ({ slug: a.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return {};
  const loc = locale as "tr" | "en";
  return {
    title: artist.name,
    description: artist.bio[loc],
    openGraph: {
      title: `${artist.name} — Zaruret Records`,
      description: artist.bio[loc],
      images: [artist.image],
    },
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.roster");
  const artist = getArtist(slug);
  if (!artist) notFound();

  const discography = getReleasesByArtist(artist.slug);
  const loc = locale as "tr" | "en";

  return (
    <>
      <JsonLd data={artistSchema(artist)} />
      <section className="relative pt-24 min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
        </div>
        <div className="container-site relative z-10 py-20">
          <div className="eyebrow mb-4">{artist.genre}</div>
          <h1 className="h-display text-6xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tightest">
            {artist.name}
          </h1>
          <p className="mt-8 text-lg md:text-xl text-fg-muted max-w-2xl">
            {artist.bio[loc]}
          </p>
          <div className="mt-8 flex items-center gap-4 text-fg-muted">
            <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-accent transition-colors">
              <Youtube size={20} />
            </a>
            <a href="#" aria-label="Spotify" className="hover:text-accent transition-colors">
              <Music2 size={20} />
            </a>
          </div>
        </div>
      </section>

      {discography.length > 0 && (
        <section className="section border-t border-border">
          <div className="container-site">
            <div className="eyebrow mb-4">DISCOGRAPHY</div>
            <h2 className="section-title mb-16">{t("discography")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {discography.map((r) => (
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
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-fg-muted uppercase tracking-wider mt-1 flex items-center justify-between">
                    <span>{r.year}</span>
                    <span>{r.type}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section border-t border-border">
        <div className="container-site">
          <Link
            href="/roster"
            className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent"
          >
            <ArrowUpRight size={14} className="-rotate-180" />
            {t("title")}
          </Link>
        </div>
      </section>
    </>
  );
}
