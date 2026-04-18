import type { Metadata } from "next";

const baseMeta = {
  tr: {
    home: {
      title: "Bağımsız Müzik Evi",
      description:
        "Label, stüdyo, yapımcılık ve etkinlik. Zaruret Records bağımsız müziğin çok kollu evi.",
    },
    roster: {
      title: "Sanatçılar",
      description: "Zaruret Records kadrosundaki yenilikçi sesler.",
    },
    releases: {
      title: "Yayınlar",
      description: "Zaruret Records kataloğundaki tüm single, EP ve albümler.",
    },
    studio: {
      title: "Stüdyo",
      description:
        "Analog sıcaklığı ve dijital hassasiyeti birleştiren profesyonel kayıt stüdyosu.",
    },
    services: {
      title: "Hizmetler",
      description: "Mixing, mastering, prodüksiyon ve A&R hizmetleri.",
    },
    events: {
      title: "Etkinlikler",
      description: "Zaruret canlı organizasyonları. Konserler ve özel geceler.",
    },
    news: {
      title: "Haberler",
      description: "Yayınlar, etkinlikler ve basından güncel.",
    },
    about: {
      title: "Hakkımızda",
      description: "Zaruret Records'un hikayesi, misyonu ve ekibi.",
    },
    contact: {
      title: "İletişim",
      description:
        "Demo gönder, stüdyo rezervasyonu yap ya da bize yaz.",
    },
  },
  en: {
    home: {
      title: "Independent Music House",
      description:
        "Label, studio, production and events. Zaruret Records is a multi-arm house for independent music.",
    },
    roster: {
      title: "Roster",
      description: "Innovative voices on the Zaruret Records roster.",
    },
    releases: {
      title: "Releases",
      description: "Every single, EP and album in the Zaruret catalogue.",
    },
    studio: {
      title: "Studio",
      description:
        "Professional recording studio blending analog warmth with digital precision.",
    },
    services: {
      title: "Services",
      description: "Mixing, mastering, production and A&R services.",
    },
    events: {
      title: "Events",
      description: "Zaruret live productions. Concerts and special nights.",
    },
    news: {
      title: "News",
      description: "Releases, events and press.",
    },
    about: {
      title: "About",
      description: "The story, mission and team behind Zaruret Records.",
    },
    contact: {
      title: "Contact",
      description: "Submit a demo, book the studio or drop us a line.",
    },
  },
};

export function pageMeta(
  locale: string,
  key: keyof typeof baseMeta.tr
): Metadata {
  const loc = (locale as "tr" | "en") ?? "tr";
  const m = baseMeta[loc][key];
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
    },
  };
}
