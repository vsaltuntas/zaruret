"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import type { Artist } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowUpRight } from "lucide-react";

export function FeaturedArtists({ artists }: { artists: Artist[] }) {
  const t = useTranslations("sections");
  const featured = artists.slice(0, 4);

  return (
    <section className="section">
      <div className="container-site">
        <div className="flex items-end justify-between mb-16">
          <SectionHeader
            eyebrow="01 — ROSTER"
            title={t("featuredArtistsTitle")}
            subtitle={t("featuredArtistsSubtitle")}
          />
          <Link
            href="/roster"
            className="hidden md:inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors"
          >
            {t("seeAll")}
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((artist, i) => (
            <motion.div
              key={artist.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/roster/${artist.slug}`}
                className="group block relative aspect-[3/4] overflow-hidden rounded-2xl bg-bg-elevated"
              >
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-xs text-fg-muted mb-1">{artist.genre}</div>
                  <div className="h-display text-2xl flex items-center justify-between">
                    {artist.name}
                    <ArrowUpRight size={18} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
