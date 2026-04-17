import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getNews, getNewsPost } from "@/lib/content";

export async function generateStaticParams() {
  return getNews().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getNewsPost(slug);
  if (!post) return {};
  const loc = locale as "tr" | "en";
  return {
    title: post.title[loc],
    description: post.excerpt[loc],
    openGraph: {
      title: post.title[loc],
      description: post.excerpt[loc],
      images: [post.cover],
    },
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getNewsPost(slug);
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
        <div className="container-site max-w-3xl prose prose-invert text-fg-muted leading-relaxed space-y-6 whitespace-pre-wrap">
          {post.body?.[loc] || post.excerpt[loc]}
        </div>
      </article>
    </>
  );
}
