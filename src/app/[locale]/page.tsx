import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/hero/HomeHero";
import { FeaturedArtists } from "@/components/home/FeaturedArtists";
import { LatestReleases } from "@/components/home/LatestReleases";
import { Services } from "@/components/home/Services";
import { Marquee } from "@/components/home/Marquee";
import { NewsTeaser } from "@/components/home/NewsTeaser";
import { CTA } from "@/components/home/CTA";
import { pageMeta } from "./metadata";

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

  return (
    <>
      <HomeHero />
      <FeaturedArtists />
      <LatestReleases />
      <Marquee />
      <Services />
      <NewsTeaser />
      <CTA />
    </>
  );
}
