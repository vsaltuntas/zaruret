import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Instagram, Youtube, Music2, Mail } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-24">
      <div className="container-site py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="h-display text-3xl tracking-tightest">
            ZARURET<span className="text-accent">.</span>
          </div>
          <p className="mt-4 text-fg-muted max-w-xs">
            {t("footer.tagline")}
          </p>
          <div className="mt-6 flex items-center gap-4 text-fg-muted">
            <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-accent transition-colors">
              <Youtube size={18} />
            </a>
            <a href="#" aria-label="Spotify" className="hover:text-accent transition-colors">
              <Music2 size={18} />
            </a>
            <a href="mailto:info@zaruret.com" aria-label="Email" className="hover:text-accent transition-colors">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4">{t("footer.navigation")}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/roster" className="text-fg-muted hover:text-fg">{t("nav.roster")}</Link></li>
            <li><Link href="/releases" className="text-fg-muted hover:text-fg">{t("nav.releases")}</Link></li>
            <li><Link href="/studio" className="text-fg-muted hover:text-fg">{t("nav.studio")}</Link></li>
            <li><Link href="/services" className="text-fg-muted hover:text-fg">{t("nav.services")}</Link></li>
            <li><Link href="/events" className="text-fg-muted hover:text-fg">{t("nav.events")}</Link></li>
            <li><Link href="/about" className="text-fg-muted hover:text-fg">{t("nav.about")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">{t("footer.newsletter")}</h4>
          <p className="text-sm text-fg-muted mb-4">
            {t("footer.newsletterDesc")}
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-site py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-fg-muted">
          <div>© {year} Zaruret Records. {t("footer.rights")}</div>
          <div className="flex items-center gap-2">
            <span>Istanbul</span>
            <span className="text-border">—</span>
            <span>info@zaruret.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
