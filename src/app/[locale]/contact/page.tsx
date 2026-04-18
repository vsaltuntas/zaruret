import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForms } from "@/components/forms/ContactForms";
import { Mail, MapPin, Phone } from "lucide-react";
import { pageMeta } from '../metadata';


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMeta(locale, 'contact');
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.contact");

  return (
    <>
      <PageHero eyebrow="CONTACT" title={t("title")} intro={t("intro")} />

      <section className="section">
        <div className="container-site grid lg:grid-cols-[1fr_320px] gap-16">
          <ContactForms />

          <aside className="space-y-8">
            <div>
              <div className="eyebrow mb-3">EMAIL</div>
              <a
                href="mailto:info@zaruret.com"
                className="flex items-center gap-3 text-fg hover:text-accent transition-colors"
              >
                <Mail size={16} />
                info@zaruret.com
              </a>
              <a
                href="mailto:demo@zaruret.com"
                className="mt-2 flex items-center gap-3 text-fg hover:text-accent transition-colors"
              >
                <Mail size={16} />
                demo@zaruret.com
              </a>
            </div>

            <div>
              <div className="eyebrow mb-3">STUDIO</div>
              <div className="flex items-start gap-3 text-fg-muted">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>
                  Istanbul, Türkiye
                  <br />
                  {locale === "tr" ? "Randevu ile ziyaret" : "Visits by appointment"}
                </span>
              </div>
            </div>

            <div>
              <div className="eyebrow mb-3">{locale === "tr" ? "Telefon" : "Phone"}</div>
              <a
                href="tel:+902120000000"
                className="flex items-center gap-3 text-fg hover:text-accent transition-colors"
              >
                <Phone size={16} />
                +90 212 000 00 00
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
