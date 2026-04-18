import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getRelease, getReleases, getArtist } from "@/lib/content";
import { JsonLd, releaseSchema } from "@/lib/seo";
import { SpotifyEmbed, YouTubeEmbed } from "@/components/media/SpotifyEmbed";

export const dynamicParams = false;

export async function generateStaticParams() {
  const items = getReleases();
  return items.length > 0 ? items.map((r) => ({ slug: r.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const release = getRelease(slug);
  if (!release) return {};
  const artistName = getArtist(release.artistSlug)?.name ?? release.artistSlug;
  return {
    title: `${release.title} — ${artistName}`,
    description: `${artistName} — ${release.title}. ${release.year} Zaruret Records release.`,
    openGraph: {
      title: `${release.title} — ${artistName}`,
      description: `${artistName} — ${release.title}. ${release.year}.`,
      images: [release.cover],
    },
  };
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const release = getRelease(slug);
  if (!release) notFound();
  const artistName = getArtist(release.artistSlug)?.name ?? release.artistSlug;

  return (
    <>
      <JsonLd data={releaseSchema({ ...release, artist: artistName })} />
      <section className="pt-40 pb-24">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src={release.cover}
              alt={release.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <div className="eyebrow mb-4">
              {release.type.toUpperCase()} — {release.year}
            </div>
            <h1 className="h-display text-5xl md:text-7xl tracking-tightest leading-[0.95]">
              {release.title}
            </h1>
            <Link
              href={`/roster/${release.artistSlug}`}
              className="mt-4 inline-block text-xl text-fg-muted hover:text-accent transition-colors"
            >
              {artistName}
            </Link>

            <div className="mt-12 space-y-6">
              {release.spotifyId && (
                <SpotifyEmbed id={release.spotifyId} type={release.type === "single" ? "track" : "album"} />
              )}
              <div className="flex flex-wrap gap-3">
                <a className="btn btn-primary" href={release.platforms?.spotify ?? "#"} target="_blank" rel="noopener noreferrer">Spotify</a>
                <a className="btn btn-outline" href={release.platforms?.apple ?? "#"} target="_blank" rel="noopener noreferrer">Apple Music</a>
                <a className="btn btn-outline" href={release.platforms?.youtube ?? "#"} target="_blank" rel="noopener noreferrer">YouTube</a>
                <a className="btn btn-outline" href={release.platforms?.bandcamp ?? "#"} target="_blank" rel="noopener noreferrer">Bandcamp</a>
              </div>
            </div>

            {release.youtubeId && (
              <div className="mt-12">
                <div className="eyebrow mb-4">Music Video</div>
                <YouTubeEmbed id={release.youtubeId} title={`${release.title} — ${artistName}`} />
              </div>
            )}

            <div className="mt-12 border-t border-border pt-8 text-sm text-fg-muted space-y-2">
              <div className="flex justify-between">
                <span className="text-fg-muted">{locale === "tr" ? "Yayın Tarihi" : "Release Date"}</span>
                <span className="text-fg">{new Date(release.date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">{locale === "tr" ? "Format" : "Format"}</span>
                <span className="text-fg uppercase">{release.type}</span>
              </div>
              {release.tracklist && release.tracklist.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-fg-muted">{locale === "tr" ? "Şarkı" : "Tracks"}</span>
                  <span className="text-fg">{release.tracklist.length}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-fg-muted">Label</span>
                <span className="text-fg">Zaruret Records</span>
              </div>
            </div>
          </div>
        </div>

        {release.tracklist && release.tracklist.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <div className="eyebrow mb-4">{locale === "tr" ? "Şarkı Listesi" : "Tracklist"}</div>
            <ol className="divide-y divide-border border-y border-border">
              {release.tracklist.map((track, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 py-3 text-sm hover:bg-bg-elevated/50 transition-colors px-1"
                >
                  <span className="text-fg-muted text-xs tabular-nums w-6 text-right">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-fg">{track.title}</span>
                  {track.duration && (
                    <span className="text-fg-muted tabular-nums text-xs">
                      {track.duration}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      </section>
    </>
  );
}
