export type Artist = {
  slug: string;
  name: string;
  genre: string;
  image: string;
  bio: { tr: string; en: string };
  socials?: { spotify?: string; instagram?: string; youtube?: string };
};

export type Release = {
  slug: string;
  title: string;
  artist: string;
  artistSlug: string;
  year: number;
  date: string;
  type: "single" | "ep" | "album";
  cover: string;
  platforms?: { spotify?: string; apple?: string; youtube?: string; bandcamp?: string };
};

export type Event = {
  slug: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  artists: string[];
  image: string;
  ticketUrl?: string;
  status: "upcoming" | "past";
};

export type NewsPost = {
  slug: string;
  title: { tr: string; en: string };
  excerpt: { tr: string; en: string };
  date: string;
  category: "release" | "event" | "press";
  cover: string;
};

export const artists: Artist[] = [
  {
    slug: "ay-lin",
    name: "Ay-Lin",
    genre: "Alt-Pop",
    image: "https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=1200&q=80",
    bio: {
      tr: "İstanbul merkezli şarkı yazarı. Elektronik ve akustik dokuları sıcak bir vokalle birleştiriyor.",
      en: "Istanbul-based singer-songwriter blending electronic and acoustic textures with a warm vocal.",
    },
  },
  {
    slug: "halas",
    name: "Halas",
    genre: "Psych-Rock",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80",
    bio: {
      tr: "Dört kişilik psikedelik rock topluluğu. Doğu makamlarını garaj rock enerjisiyle harmanlıyorlar.",
      en: "A four-piece psychedelic outfit that fuses Eastern modes with garage rock energy.",
    },
  },
  {
    slug: "oben",
    name: "Öben",
    genre: "Electronic",
    image: "https://images.unsplash.com/photo-1514533212735-5df27d970db0?w=1200&q=80",
    bio: {
      tr: "Prodüktör ve canlı performans sanatçısı. Ambient, techno ve deneysel elektronik arasında gezen bir dünya.",
      en: "Producer and live performer traversing ambient, techno and experimental electronic.",
    },
  },
  {
    slug: "ela-dem",
    name: "Ela Dem",
    genre: "Neo-Soul",
    image: "https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?w=1200&q=80",
    bio: {
      tr: "Neo-soul ve r&b dokuları olan bir kadın ses. Modern aranjmanlarla klasik soul duyarlılığını birleştiriyor.",
      en: "A voice threaded with neo-soul and r&b textures, pairing modern arrangements with classic soul sensibility.",
    },
  },
  {
    slug: "kara-dalga",
    name: "Kara Dalga",
    genre: "Post-Punk",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80",
    bio: {
      tr: "Üç kişilik post-punk grubu. Karanlık gitar tonları ve duygusal yoğunlukla dolu canlı performanslar.",
      en: "A three-piece post-punk band. Dark guitar tones and live shows loaded with emotional intensity.",
    },
  },
  {
    slug: "mira-su",
    name: "Mira Su",
    genre: "Indie-Folk",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80",
    bio: {
      tr: "Minimal aranjmanlar ve şiirsel sözlerle tanımlanan indie-folk sanatçısı.",
      en: "An indie-folk artist defined by minimal arrangements and poetic lyricism.",
    },
  },
];

export const releases: Release[] = [
  {
    slug: "ay-lin-geceye-dogru",
    title: "Geceye Doğru",
    artist: "Ay-Lin",
    artistSlug: "ay-lin",
    year: 2025,
    date: "2025-09-14",
    type: "album",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  },
  {
    slug: "halas-kum-ve-gul",
    title: "Kum ve Gül",
    artist: "Halas",
    artistSlug: "halas",
    year: 2025,
    date: "2025-06-02",
    type: "ep",
    cover: "https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=800&q=80",
  },
  {
    slug: "oben-yarim-ay",
    title: "Yarım Ay",
    artist: "Öben",
    artistSlug: "oben",
    year: 2025,
    date: "2025-03-21",
    type: "single",
    cover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=800&q=80",
  },
  {
    slug: "ela-dem-sonra",
    title: "Sonra",
    artist: "Ela Dem",
    artistSlug: "ela-dem",
    year: 2024,
    date: "2024-11-08",
    type: "single",
    cover: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800&q=80",
  },
  {
    slug: "kara-dalga-sehri-dinle",
    title: "Şehri Dinle",
    artist: "Kara Dalga",
    artistSlug: "kara-dalga",
    year: 2024,
    date: "2024-09-20",
    type: "album",
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  },
  {
    slug: "mira-su-uzak",
    title: "Uzak",
    artist: "Mira Su",
    artistSlug: "mira-su",
    year: 2024,
    date: "2024-05-15",
    type: "ep",
    cover: "https://images.unsplash.com/photo-1483232539664-d89822fb5d3e?w=800&q=80",
  },
  {
    slug: "ay-lin-kaybolmadan",
    title: "Kaybolmadan",
    artist: "Ay-Lin",
    artistSlug: "ay-lin",
    year: 2024,
    date: "2024-02-14",
    type: "single",
    cover: "https://images.unsplash.com/photo-1445375011782-2384686778a0?w=800&q=80",
  },
  {
    slug: "halas-zaman-nedir",
    title: "Zaman Nedir",
    artist: "Halas",
    artistSlug: "halas",
    year: 2023,
    date: "2023-10-06",
    type: "single",
    cover: "https://images.unsplash.com/photo-1460667262436-cf19894f4774?w=800&q=80",
  },
];

export const events: Event[] = [
  {
    slug: "zaruret-night-01",
    title: "Zaruret Night: Chapter 01",
    date: "2026-05-24",
    venue: "Peyote",
    city: "Istanbul",
    artists: ["Ay-Lin", "Öben"],
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&q=80",
    ticketUrl: "#",
    status: "upcoming",
  },
  {
    slug: "halas-album-launch",
    title: "Halas — Kum ve Gül Launch",
    date: "2026-06-15",
    venue: "Salon IKSV",
    city: "Istanbul",
    artists: ["Halas"],
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=80",
    ticketUrl: "#",
    status: "upcoming",
  },
  {
    slug: "summer-sessions-ankara",
    title: "Summer Sessions",
    date: "2026-07-10",
    venue: "Jolly Joker",
    city: "Ankara",
    artists: ["Kara Dalga", "Mira Su"],
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1600&q=80",
    ticketUrl: "#",
    status: "upcoming",
  },
  {
    slug: "rooftop-session-2025",
    title: "Rooftop Session",
    date: "2025-08-22",
    venue: "Babylon",
    city: "Istanbul",
    artists: ["Ela Dem", "Mira Su"],
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1600&q=80",
    status: "past",
  },
];

export const news: NewsPost[] = [
  {
    slug: "ay-lin-yeni-album",
    title: {
      tr: "Ay-Lin'in yeni albümü yayında",
      en: "Ay-Lin's new album is out",
    },
    excerpt: {
      tr: "Ay-Lin'in ilk full-length albümü 'Geceye Doğru' tüm dijital platformlarda.",
      en: "Ay-Lin's debut full-length 'Geceye Doğru' is out on all digital platforms.",
    },
    date: "2025-09-14",
    category: "release",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80",
  },
  {
    slug: "zaruret-night-announce",
    title: {
      tr: "Zaruret Night başlıyor",
      en: "Zaruret Night begins",
    },
    excerpt: {
      tr: "Label gecelerimizin ilki 24 Mayıs'ta Peyote'de. Line-up açıklandı.",
      en: "Our first label night lands at Peyote on May 24. Line-up revealed.",
    },
    date: "2026-04-02",
    category: "event",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80",
  },
  {
    slug: "studio-expansion",
    title: {
      tr: "Stüdyomuz büyüyor",
      en: "Our studio is growing",
    },
    excerpt: {
      tr: "Yeni bir live room ve mastering süiti. 2026 yazından itibaren açık.",
      en: "A new live room and a dedicated mastering suite. Open from summer 2026.",
    },
    date: "2026-03-10",
    category: "press",
    cover: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80",
  },
];
