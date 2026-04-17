import fs from "fs";
import path from "path";

export type Bilingual = { tr: string; en: string };

export type Artist = {
  slug: string;
  name: string;
  genre: string;
  image: string;
  bio: Bilingual;
  socials?: { instagram?: string; spotify?: string; youtube?: string };
};

export type Release = {
  slug: string;
  title: string;
  artistSlug: string;
  year: number;
  date: string;
  type: "single" | "ep" | "album";
  cover: string;
  spotifyId?: string;
  youtubeId?: string;
  platforms?: {
    spotify?: string;
    apple?: string;
    youtube?: string;
    bandcamp?: string;
  };
};

export type EventItem = {
  slug: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  artistSlugs: string[];
  image: string;
  ticketUrl?: string;
  status: "upcoming" | "past";
};

export type NewsPost = {
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  body?: Bilingual;
  date: string;
  category: "release" | "event" | "press";
  cover: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: Bilingual;
  photo: string;
  order?: number;
};

export type SiteSettings = {
  name: string;
  tagline: Bilingual;
  email: string;
  demoEmail?: string;
  phone?: string;
  address?: Bilingual;
  socials?: { instagram?: string; youtube?: string; spotify?: string };
  heroImage?: string;
};

const contentRoot = path.join(process.cwd(), "content");

function readJsonDir<T>(dir: string): T[] {
  const p = path.join(contentRoot, dir);
  if (!fs.existsSync(p)) return [];
  return fs
    .readdirSync(p)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(p, f), "utf8")) as T);
}

export function getArtists(): Artist[] {
  return readJsonDir<Artist>("artists").sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function getArtist(slug: string): Artist | undefined {
  return getArtists().find((a) => a.slug === slug);
}

export function getReleases(): Release[] {
  return readJsonDir<Release>("releases").sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getRelease(slug: string): Release | undefined {
  return getReleases().find((r) => r.slug === slug);
}

export function getReleasesByArtist(artistSlug: string): Release[] {
  return getReleases().filter((r) => r.artistSlug === artistSlug);
}

export function getEvents(): EventItem[] {
  return readJsonDir<EventItem>("events").sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getEvent(slug: string): EventItem | undefined {
  return getEvents().find((e) => e.slug === slug);
}

export function getNews(): NewsPost[] {
  return readJsonDir<NewsPost>("news").sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getNewsPost(slug: string): NewsPost | undefined {
  return getNews().find((p) => p.slug === slug);
}

export function getTeam(): TeamMember[] {
  return readJsonDir<TeamMember>("team").sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99)
  );
}

export function getSite(): SiteSettings {
  const p = path.join(contentRoot, "site.json");
  if (!fs.existsSync(p)) {
    return {
      name: "Zaruret Records",
      tagline: { tr: "", en: "" },
      email: "info@zaruretrecords.com",
    };
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function resolveArtistsForEvent(e: EventItem): string[] {
  const byName = new Map(getArtists().map((a) => [a.slug, a.name]));
  return e.artistSlugs.map((s) => byName.get(s) ?? s);
}
