import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/hero/HomeHero";
import { FeaturedArtists } from "@/components/home/FeaturedArtists";
import { LatestReleases } from "@/components/home/LatestReleases";
import { Services } from "@/components/home/Services";
import { Marquee } from "@/components/home/Marquee";
import { NewsTeaser } from "@/components/home/NewsTeaser";
import { CTA } from "@/components/home/CTA";
import { pageMeta } from "./metadata";
import { getArtists, getReleases, getNews } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta(locale, "home");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const artists = getArtists();
  const releases = getReleases();
  const news = getNews();

  return (
    <>
      <HomeHero />
      <FeaturedArtists artists={artists} />
      <LatestReleases releases={releases} artists={artists} />
      <Marquee />
      <Services />
      <NewsTeaser news={news} />
      <CTA />
    </>
  );
}
