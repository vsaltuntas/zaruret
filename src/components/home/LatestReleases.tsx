"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { releases } from "@/lib/mock-data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowUpRight } from "lucide-react";

export function LatestReleases() {
  const t = useTranslations("sections");
  const latest = releases.slice(0, 6);

  return (
    <section className="section border-t border-border">
      <div className="container-site">
        <div className="flex items-end justify-between mb-16">
          <SectionHeader
            eyebrow="02 — RELEASES"
            title={t("latestReleasesTitle")}
            subtitle={t("latestReleasesSubtitle")}
          />
          <Link
            href="/releases"
            className="hidden md:inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors"
          >
            {t("seeAll")}
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {latest.map((r, i) => (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                href={`/releases/${r.slug}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={r.cover}
                    alt={r.title}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-xl" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-medium truncate">{r.title}</div>
                  <div className="text-xs text-fg-muted flex items-center justify-between mt-1">
                    <span className="truncate">{r.artist}</span>
                    <span className="uppercase tracking-wider text-[10px]">{r.type}</span>
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
