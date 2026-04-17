import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { events } from "@/lib/mock-data";
import { PageHero } from "@/components/ui/PageHero";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { pageMeta } from '../metadata';


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMeta(locale, 'events');
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.events");
  const tSec = await getTranslations("sections");

  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past");

  const localeStr = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <>
      <PageHero eyebrow="EVENTS" title={t("title")} intro={t("intro")} />

      {upcoming.length > 0 && (
        <section className="section">
          <div className="container-site">
            <div className="eyebrow mb-4">01</div>
            <h2 className="section-title mb-16">{tSec("upcomingEvents")}</h2>
            <div className="space-y-6">
              {upcoming.map((e) => (
                <div
                  key={e.slug}
                  className="card card-hover grid md:grid-cols-[320px_1fr_auto] gap-6 p-6 items-center"
                >
                  <div className="relative aspect-[4/3] md:aspect-video overflow-hidden rounded-xl">
                    <Image
                      src={e.image}
                      alt={e.title}
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="eyebrow mb-2 flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(e.date).toLocaleDateString(localeStr, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} />
                        {e.venue}, {e.city}
                      </span>
                    </div>
                    <h3 className="h-display text-3xl md:text-4xl mb-2">
                      {e.title}
                    </h3>
                    <div className="text-sm text-fg-muted">
                      {e.artists.join(" · ")}
                    </div>
                  </div>
                  {e.ticketUrl && (
                    <a
                      href={e.ticketUrl}
                      className="btn btn-primary self-center"
                    >
                      <Ticket size={14} />
                      {t("buyTickets")}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="section border-t border-border">
          <div className="container-site">
            <div className="eyebrow mb-4">02</div>
            <h2 className="section-title mb-16">{tSec("pastEvents")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((e) => (
                <div key={e.slug} className="card overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={e.image}
                      alt={e.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="p-6">
                    <div className="eyebrow mb-2">
                      {new Date(e.date).toLocaleDateString(localeStr, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <h3 className="h-display text-xl mb-1">{e.title}</h3>
                    <div className="text-sm text-fg-muted">
                      {e.venue} · {e.city}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
