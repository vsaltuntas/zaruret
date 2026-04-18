"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken } from "../lib/auth";
import { ghListDir, ghLatestCommit } from "../lib/github";
import { schemas } from "../lib/schemas";
import { Users, Disc3, Calendar, Newspaper, UserCog, ArrowRight, GitCommit, Loader2 } from "lucide-react";

const items = [
  { key: "artists", Icon: Users },
  { key: "releases", Icon: Disc3 },
  { key: "events", Icon: Calendar },
  { key: "news", Icon: Newspaper },
  { key: "team", Icon: UserCog },
];

export function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [commit, setCommit] = useState<{ message: string; date: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    (async () => {
      try {
        const results = await Promise.all(
          items.map(async ({ key }) => {
            const dir = schemas[key].dir;
            const list = await ghListDir(token, dir);
            return [key, list.filter((f) => f.name.endsWith(".json")).length] as [string, number];
          })
        );
        setCounts(Object.fromEntries(results));

        const latest = await ghLatestCommit(token);
        if (latest) {
          setCommit({
            message: latest.commit.message,
            date: latest.commit.author.date,
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Kontrol Paneli
        </h1>
        <p style={{ color: "var(--fg-muted)", marginTop: "0.5rem" }}>
          İçerik yönetimi. Her değişiklik repo&apos;ya commit olarak kaydedilir ve
          site otomatik yeniden derlenir.
        </p>
      </div>

      {loading ? (
        <div className="admin-card flex items-center gap-3" style={{ color: "var(--fg-muted)" }}>
          <Loader2 size={16} className="animate-spin" /> İçerik yükleniyor...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {items.map(({ key, Icon }) => {
              const schema = schemas[key];
              const count = counts[key] ?? 0;
              return (
                <Link
                  key={key}
                  href={`/admin/${key}`}
                  className="admin-card"
                  style={{ textDecoration: "none", color: "inherit", transition: "border-color 0.2s" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon size={24} style={{ color: "var(--accent)" }} />
                    <ArrowRight size={16} style={{ color: "var(--fg-muted)" }} />
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1 }}>
                    {count}
                  </div>
                  <div style={{ color: "var(--fg-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                    {schema.labelPlural}
                  </div>
                </Link>
              );
            })}
          </div>

          {commit && (
            <div className="admin-card">
              <div className="flex items-center gap-2 mb-2" style={{ color: "var(--fg-muted)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <GitCommit size={12} /> Son Commit
              </div>
              <div style={{ fontSize: "0.9375rem" }}>{commit.message.split("\n")[0]}</div>
              <div style={{ color: "var(--fg-muted)", fontSize: "0.8125rem", marginTop: "0.25rem" }}>
                {new Date(commit.date).toLocaleString("tr-TR")}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
