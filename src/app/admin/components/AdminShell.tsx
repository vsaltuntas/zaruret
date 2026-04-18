"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken, getUser, clearAuth } from "../lib/auth";
import { Login } from "./Login";
import { LogOut, Home, Users, Disc3, Calendar, Newspaper, UserCog, ExternalLink } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: Home, exact: true },
  { href: "/admin/artists", label: "Sanatçılar", Icon: Users },
  { href: "/admin/releases", label: "Yayınlar", Icon: Disc3 },
  { href: "/admin/events", label: "Etkinlikler", Icon: Calendar },
  { href: "/admin/news", label: "Haberler", Icon: Newspaper },
  { href: "/admin/team", label: "Ekip", Icon: UserCog },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setAuthed(!!getToken());
    setUser(getUser());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!authed) {
    return (
      <div className="admin-shell">
        <Login onSuccess={() => { setAuthed(true); setUser(getUser()); }} />
      </div>
    );
  }

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
    setUser(null);
    router.push("/admin");
  };

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <div className="admin-container flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span style={{ fontSize: "1.125rem", letterSpacing: "-0.04em" }}>
              ZARURET<span style={{ color: "var(--accent)" }}>.</span>
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--fg-muted)" }}
            >
              Siteye Git <ExternalLink size={14} />
            </a>
            {user && (
              <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
                @{user}
              </span>
            )}
            <button onClick={handleLogout} className="admin-btn admin-btn-outline" title="Çıkış">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </nav>

      <div className="admin-container flex gap-8 py-8">
        <aside style={{ width: "200px", flexShrink: 0 }}>
          <nav className="flex flex-col gap-1">
            {navItems.map(({ href, label, Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    background: active ? "var(--bg-elevated)" : "transparent",
                    color: active ? "var(--fg)" : "var(--fg-muted)",
                  }}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}
