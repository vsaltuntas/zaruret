"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/roster", key: "roster" },
  { href: "/releases", key: "releases" },
  { href: "/studio", key: "studio" },
  { href: "/services", key: "services" },
  { href: "/events", key: "events" },
  { href: "/news", key: "news" },
  { href: "/about", key: "about" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "backdrop-blur-xl bg-bg/70 border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container-site flex h-20 items-center justify-between">
        <Link
          href="/"
          className="h-display text-xl tracking-tightest text-fg hover:text-accent transition-colors"
        >
          ZARURET
          <span className="text-accent">.</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm tracking-wide text-fg-muted hover:text-fg transition-colors",
                pathname === item.href && "text-fg"
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitch current={locale} />
          <Link
            href="/contact"
            className="hidden md:inline-flex btn btn-outline text-xs"
          >
            {t("submitDemo")}
          </Link>
          <button
            aria-label="menu"
            className="lg:hidden text-fg"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-bg/95 backdrop-blur-xl">
          <div className="container-site py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-lg text-fg hover:text-accent"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/contact"
              className="py-2 text-lg text-accent"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function LocaleSwitch({ current }: { current: string }) {
  const pathname = usePathname();
  return (
    <div className="flex items-center text-xs text-fg-muted">
      <Link
        href={pathname}
        locale="tr"
        className={cn(
          "px-2 py-1 transition-colors",
          current === "tr" ? "text-fg" : "hover:text-fg"
        )}
      >
        TR
      </Link>
      <span className="text-border">/</span>
      <Link
        href={pathname}
        locale="en"
        className={cn(
          "px-2 py-1 transition-colors",
          current === "en" ? "text-fg" : "hover:text-fg"
        )}
      >
        EN
      </Link>
    </div>
  );
}
