"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export function HomeHero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial" />

      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(100%) contrast(1.1) brightness(0.5)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,1) 100%)",
        }}
      />

      <div className="container-site relative z-10 pb-20 md:pb-32 pt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow mb-6">{t("eyebrow")}</div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl md:text-3xl lg:text-4xl text-fg-muted mb-4 max-w-3xl"
        >
          {t("tagline")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="h-display text-7xl md:text-9xl lg:text-[12rem] leading-[0.9] tracking-tightest text-balance"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg md:text-xl text-fg-muted max-w-xl"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link href="/roster" className="btn btn-primary">
            {t("ctaPrimary")}
            <ArrowRight size={16} />
          </Link>
          <Link href="/contact" className="btn btn-outline">
            {t("ctaSecondary")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
