import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { releases } from "@/lib/mock-data";

export async function generateStaticParams() {
  return releases.map((r) => ({ slug: r.slug }));
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const release = releases.find((r) => r.slug === slug);
  if (!release) notFound();

  return (
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
              {release.artist}
            </Link>

            <div className="mt-12 space-y-4">
              <div className="flex flex-wrap gap-3">
                <a className="btn btn-primary" href="#">Spotify</a>
                <a className="btn btn-outline" href="#">Apple Music</a>
                <a className="btn btn-outline" href="#">YouTube</a>
                <a className="btn btn-outline" href="#">Bandcamp</a>
              </div>
            </div>

            <div className="mt-12 border-t border-border pt-8 text-sm text-fg-muted space-y-2">
              <div className="flex justify-between">
                <span className="text-fg-muted">{locale === "tr" ? "Yayın Tarihi" : "Release Date"}</span>
                <span className="text-fg">{new Date(release.date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">{locale === "tr" ? "Format" : "Format"}</span>
                <span className="text-fg uppercase">{release.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Label</span>
                <span className="text-fg">Zaruret Records</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
