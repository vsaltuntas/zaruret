export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "image"
  | "bilingual-text"
  | "bilingual-textarea"
  | "multi-select"
  | "url";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  nested?: string;
  optionsFromContent?: "artists";
};

export type Schema = {
  key: string;
  labelSingular: string;
  labelPlural: string;
  dir: string;
  slugField: string;
  fields: Field[];
  defaults: Record<string, unknown>;
};

export const schemas: Record<string, Schema> = {
  artists: {
    key: "artists",
    labelSingular: "Sanatçı",
    labelPlural: "Sanatçılar",
    dir: "content/artists",
    slugField: "slug",
    fields: [
      { name: "slug", label: "Slug (URL)", type: "text", required: true, placeholder: "ornek-isim" },
      { name: "name", label: "İsim", type: "text", required: true },
      { name: "genre", label: "Tür", type: "text", required: true },
      { name: "image", label: "Fotoğraf", type: "image", required: true },
      { name: "bio", label: "Biyografi", type: "bilingual-textarea", required: true },
      { name: "socials.instagram", label: "Instagram", type: "url", nested: "socials" },
      { name: "socials.spotify", label: "Spotify", type: "url", nested: "socials" },
      { name: "socials.youtube", label: "YouTube", type: "url", nested: "socials" },
    ],
    defaults: {
      slug: "",
      name: "",
      genre: "",
      image: "",
      bio: { tr: "", en: "" },
      socials: { instagram: "", spotify: "", youtube: "" },
    },
  },
  releases: {
    key: "releases",
    labelSingular: "Yayın",
    labelPlural: "Yayınlar",
    dir: "content/releases",
    slugField: "slug",
    fields: [
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "title", label: "Başlık", type: "text", required: true },
      { name: "artistSlug", label: "Sanatçı", type: "select", required: true, optionsFromContent: "artists" },
      { name: "type", label: "Format", type: "select", required: true, options: [
        { value: "single", label: "Single" },
        { value: "ep", label: "EP" },
        { value: "album", label: "Albüm" },
      ] },
      { name: "year", label: "Yıl", type: "number", required: true },
      { name: "date", label: "Yayın Tarihi", type: "date", required: true },
      { name: "cover", label: "Kapak", type: "image", required: true },
      { name: "spotifyId", label: "Spotify ID (opsiyonel)", type: "text", placeholder: "4aawyAB9vmqN..." },
      { name: "youtubeId", label: "YouTube Video ID (opsiyonel)", type: "text", placeholder: "dQw4w9WgXcQ" },
      { name: "platforms.spotify", label: "Spotify URL", type: "url", nested: "platforms" },
      { name: "platforms.apple", label: "Apple Music URL", type: "url", nested: "platforms" },
      { name: "platforms.youtube", label: "YouTube URL", type: "url", nested: "platforms" },
      { name: "platforms.bandcamp", label: "Bandcamp URL", type: "url", nested: "platforms" },
    ],
    defaults: {
      slug: "",
      title: "",
      artistSlug: "",
      type: "single",
      year: new Date().getFullYear(),
      date: "",
      cover: "",
      spotifyId: "",
      youtubeId: "",
      platforms: { spotify: "", apple: "", youtube: "", bandcamp: "" },
    },
  },
  events: {
    key: "events",
    labelSingular: "Etkinlik",
    labelPlural: "Etkinlikler",
    dir: "content/events",
    slugField: "slug",
    fields: [
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "title", label: "Başlık", type: "text", required: true },
      { name: "date", label: "Tarih", type: "date", required: true },
      { name: "venue", label: "Mekan", type: "text", required: true },
      { name: "city", label: "Şehir", type: "text", required: true },
      { name: "artistSlugs", label: "Sanatçılar", type: "multi-select", optionsFromContent: "artists" },
      { name: "image", label: "Kapak Görseli", type: "image", required: true },
      { name: "ticketUrl", label: "Bilet URL", type: "url" },
      { name: "status", label: "Durum", type: "select", required: true, options: [
        { value: "upcoming", label: "Yaklaşan" },
        { value: "past", label: "Geçmiş" },
      ] },
    ],
    defaults: {
      slug: "",
      title: "",
      date: "",
      venue: "",
      city: "",
      artistSlugs: [],
      image: "",
      ticketUrl: "",
      status: "upcoming",
    },
  },
  news: {
    key: "news",
    labelSingular: "Haber",
    labelPlural: "Haberler",
    dir: "content/news",
    slugField: "slug",
    fields: [
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "title", label: "Başlık", type: "bilingual-text", required: true },
      { name: "excerpt", label: "Özet", type: "bilingual-textarea", required: true },
      { name: "body", label: "İçerik", type: "bilingual-textarea" },
      { name: "date", label: "Tarih", type: "date", required: true },
      { name: "category", label: "Kategori", type: "select", required: true, options: [
        { value: "release", label: "Release" },
        { value: "event", label: "Etkinlik" },
        { value: "press", label: "Basın" },
      ] },
      { name: "cover", label: "Kapak", type: "image", required: true },
    ],
    defaults: {
      slug: "",
      title: { tr: "", en: "" },
      excerpt: { tr: "", en: "" },
      body: { tr: "", en: "" },
      date: "",
      category: "release",
      cover: "",
    },
  },
  team: {
    key: "team",
    labelSingular: "Ekip Üyesi",
    labelPlural: "Ekip",
    dir: "content/team",
    slugField: "slug",
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "name", label: "İsim", type: "text", required: true },
      { name: "role", label: "Rol", type: "bilingual-text", required: true },
      { name: "photo", label: "Fotoğraf", type: "image", required: true },
      { name: "order", label: "Sıra", type: "number" },
    ],
    defaults: {
      slug: "",
      name: "",
      role: { tr: "", en: "" },
      photo: "",
      order: 99,
    },
  },
};

export function getByPath(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
) {
  const keys = path.split(".");
  let target = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!target[k] || typeof target[k] !== "object") {
      target[k] = {};
    }
    target = target[k] as Record<string, unknown>;
  }
  target[keys[keys.length - 1]] = value;
}
