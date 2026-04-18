"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import type { NewsPost } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowUpRight } from "lucide-react";

export function NewsTeaser({ news }: { news: NewsPost[] }) {
  const t = useTranslations("sections");
  const locale = useLocale() as "tr" | "en";

  return (
    <section className="section border-t border-border">
      <div className="container-site">
        <div className="flex items-end justify-between mb-16">
          <SectionHeader
            eyebrow="04 — NEWS"
            title={t("newsTitle")}
            subtitle={t("newsSubtitle")}
          />
          <Link
            href="/news"
            className="hidden md:inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors"
          >
            {t("seeAll")}
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                href={`/news/${post.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4">
                  <Image
                    src={post.cover}
                    alt={post.title[locale]}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="eyebrow mb-2">
                  {post.category} — {new Date(post.date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                <h3 className="h-display text-xl leading-snug group-hover:text-accent transition-colors">
                  {post.title[locale]}
                </h3>
                <p className="text-sm text-fg-muted mt-2 line-clamp-2">
                  {post.excerpt[locale]}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
