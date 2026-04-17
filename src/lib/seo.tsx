export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Zaruret Records",
    alternateName: "Zaruret",
    url: "https://zaruretrecords.com",
    logo: "https://zaruretrecords.com/apple-icon.svg",
    description:
      "Independent music house. Label, studio, production and events.",
    genre: ["Alternative", "Electronic", "Indie", "Rock", "Neo-Soul"],
    sameAs: [
      "https://instagram.com/zaruretrecords",
      "https://open.spotify.com/",
      "https://youtube.com/",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
  };
}

export function artistSchema(artist: {
  name: string;
  slug: string;
  genre: string;
  bio: { tr: string; en: string };
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    genre: artist.genre,
    description: artist.bio.en,
    image: artist.image,
    url: `https://zaruretrecords.com/tr/roster/${artist.slug}/`,
    recordLabel: {
      "@type": "Organization",
      name: "Zaruret Records",
    },
  };
}

export function releaseSchema(release: {
  title: string;
  slug: string;
  artist: string;
  year: number;
  date: string;
  type: "single" | "ep" | "album";
  cover: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: release.title,
    albumReleaseType:
      release.type === "album"
        ? "StudioAlbum"
        : release.type === "ep"
          ? "EPRelease"
          : "SingleRelease",
    byArtist: {
      "@type": "MusicGroup",
      name: release.artist,
    },
    datePublished: release.date,
    image: release.cover,
    url: `https://zaruretrecords.com/tr/releases/${release.slug}/`,
    recordLabel: {
      "@type": "Organization",
      name: "Zaruret Records",
    },
  };
}

type Schema = Record<string, unknown>;

export function JsonLd({ data }: { data: Schema | Schema[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
