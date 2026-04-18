import type { MetadataRoute } from "next";
import { getArtists, getReleases, getNews } from "@/lib/content";

export const dynamic = "force-static";

const base = "https://zaruret.com";
const locales = ["tr", "en"] as const;
const staticPaths = [
  "",
  "/roster",
  "/releases",
  "/studio",
  "/services",
  "/events",
  "/news",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of locales) {
    const prefix = `/${locale}`;
    for (const p of staticPaths) {
      entries.push({
        url: `${base}${prefix}${p}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: p === "" ? 1 : 0.7,
      });
    }
    for (const a of getArtists()) {
      entries.push({
        url: `${base}${prefix}/roster/${a.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const r of getReleases()) {
      entries.push({
        url: `${base}${prefix}/releases/${r.slug}`,
        lastModified: new Date(r.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const n of getNews()) {
      entries.push({
        url: `${base}${prefix}/news/${n.slug}`,
        lastModified: new Date(n.date),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
