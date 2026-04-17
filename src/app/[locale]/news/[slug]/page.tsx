import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { news } from "@/lib/mock-data";

export async function generateStaticParams() {
  return news.map((p) => ({ slug: p.slug }));
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = news.find((p) => p.slug === slug);
  if (!post) notFound();

  const loc = locale as "tr" | "en";
  const localeStr = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <>
      <article className="pt-40 pb-16">
        <div className="container-site max-w-3xl">
          <Link
            href="/news"
            className="eyebrow text-fg-muted hover:text-accent transition-colors"
          >
            ← {locale === "tr" ? "Haberler" : "News"}
          </Link>
          <div className="eyebrow mt-6 mb-4">
            {post.category} — {new Date(post.date).toLocaleDateString(localeStr, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <h1 className="h-display text-4xl md:text-6xl tracking-tightest leading-[1.02] text-balance">
            {post.title[loc]}
          </h1>
          <p className="mt-6 text-lg text-fg-muted">{post.excerpt[loc]}</p>
        </div>
      </article>

      <div className="container-site max-w-5xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={post.cover} alt={post.title[loc]} fill priority className="object-cover" />
        </div>
      </div>

      <article className="py-16">
        <div className="container-site max-w-3xl prose prose-invert text-fg-muted leading-relaxed space-y-6">
          <p>
            {locale === "tr"
              ? "Bu haberin detaylı içeriği yakında burada yayınlanacak. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              : "The full story will appear here soon. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
          </p>
          <p>
            {locale === "tr"
              ? "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
              : "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}
          </p>
        </div>
      </article>
    </>
  );
}
