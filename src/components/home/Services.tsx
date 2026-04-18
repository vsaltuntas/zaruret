"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Disc3, Mic2, Sliders, Calendar, ArrowUpRight } from "lucide-react";

export function Services() {
  const t = useTranslations();
  const items = [
    { key: "label", href: "/roster", Icon: Disc3 },
    { key: "studio", href: "/studio", Icon: Mic2 },
    { key: "production", href: "/services", Icon: Sliders },
    { key: "events", href: "/events", Icon: Calendar },
  ] as const;

  return (
    <section className="section border-t border-border bg-gradient-radial">
      <div className="container-site">
        <SectionHeader
          eyebrow="03 — SERVICES"
          title={t("sections.servicesTitle")}
          subtitle={t("sections.servicesSubtitle")}
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ key, href, Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                href={href}
                className="card card-hover group block p-8 h-full"
              >
                <div className="flex items-start justify-between mb-10">
                  <Icon size={28} className="text-accent" strokeWidth={1.5} />
                  <ArrowUpRight
                    size={18}
                    className="text-fg-muted group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                  />
                </div>
                <h3 className="h-display text-2xl mb-3">
                  {t(`services.${key}.title`)}
                </h3>
                <p className="text-sm text-fg-muted leading-relaxed">
                  {t(`services.${key}.desc`)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
