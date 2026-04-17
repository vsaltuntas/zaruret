import type { MetadataRoute } from "next";
import { artists, releases, news } from "@/lib/mock-data";

export const dynamic = "force-static";

const base = "https://zaruretrecords.com";
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
    const prefix = locale === "tr" ? "" : `/${locale}`;
    for (const p of staticPaths) {
      entries.push({
        url: `${base}${prefix}${p}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: p === "" ? 1 : 0.7,
      });
    }
    for (const a of artists) {
      entries.push({
        url: `${base}${prefix}/roster/${a.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const r of releases) {
      entries.push({
        url: `${base}${prefix}/releases/${r.slug}`,
        lastModified: new Date(r.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const n of news) {
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
