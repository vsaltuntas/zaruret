import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { news } from "@/lib/mock-data";
import { PageHero } from "@/components/ui/PageHero";
import { ArrowUpRight } from "lucide-react";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.news");
  const loc = locale as "tr" | "en";
  const localeStr = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <>
      <PageHero eyebrow="NEWS" title={t("title")} intro={t("intro")} />

      <section className="section">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((p) => (
              <Link key={p.slug} href={`/news/${p.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4">
                  <Image
                    src={p.cover}
                    alt={p.title[loc]}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="eyebrow mb-2">
                  {p.category} — {new Date(p.date).toLocaleDateString(localeStr, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <h3 className="h-display text-2xl leading-snug group-hover:text-accent transition-colors flex items-start gap-2">
                  {p.title[loc]}
                  <ArrowUpRight size={18} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                </h3>
                <p className="text-sm text-fg-muted mt-3 line-clamp-3">
                  {p.excerpt[loc]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
