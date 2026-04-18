"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export function CTA() {
  const t = useTranslations();

  return (
    <section className="section">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden border border-border bg-bg-elevated"
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at right, rgba(212,175,55,0.4), transparent 60%)",
            }}
          />
          <div className="relative p-10 md:p-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="eyebrow mb-4">SUBMIT A DEMO</div>
              <h2 className="h-display text-4xl md:text-6xl leading-[0.95] tracking-tightest">
                {t("hero.ctaSecondary")}.
              </h2>
              <p className="mt-4 text-fg-muted">
                {t("pages.contact.intro")}
              </p>
            </div>
            <Link href="/contact" className="btn btn-primary text-base px-8 py-4">
              {t("form.submit")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
