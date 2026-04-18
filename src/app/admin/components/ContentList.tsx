"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken } from "../lib/auth";
import { ghListDir, ghGetFile, ghDeleteFile } from "../lib/github";
import { schemas } from "../lib/schemas";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export function ContentList({ type }: { type: string }) {
  const schema = schemas[type];
  const [items, setItems] = useState<Array<Record<string, unknown> & { _sha?: string; _path?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const list = await ghListDir(token, schema.dir);
      const files = list.filter((f) => f.name.endsWith(".json"));
      const parsed = await Promise.all(
        files.map(async (f) => {
          const res = await ghGetFile(token, f.path);
          if (!res) return null;
          const obj = JSON.parse(res.content);
          return { ...obj, _sha: res.sha, _path: f.path };
        })
      );
      setItems(parsed.filter(Boolean) as typeof items);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  async function remove(item: { _sha?: string; _path?: string; slug?: string }) {
    if (!item._sha || !item._path) return;
    if (!confirm(`"${item.slug}" silinsin mi?`)) return;
    const token = getToken();
    if (!token) return;
    setBusy(item._path);
    try {
      await ghDeleteFile(token, item._path, `admin: delete ${item._path}`, item._sha);
      setItems((xs) => xs.filter((x) => x._path !== item._path));
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  const titleFor = (it: Record<string, unknown>): string => {
    const name = (it.name as string) || (it.title as string);
    if (typeof name === "string") return name;
    if (typeof it.title === "object" && it.title !== null) {
      const t = it.title as { tr?: string; en?: string };
      return t.tr || t.en || String(it.slug);
    }
    return String(it.slug);
  };

  const subtitleFor = (it: Record<string, unknown>): string => {
    if (type === "releases") return `${it.artistSlug} · ${it.year} · ${String(it.type).toUpperCase()}`;
    if (type === "events") return `${it.date} · ${it.venue}, ${it.city}`;
    if (type === "news") return `${it.category} · ${it.date}`;
    if (type === "artists") return String(it.genre ?? "");
    if (type === "team") {
      const role = it.role as { tr?: string } | undefined;
      return role?.tr ?? "";
    }
    return "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
          {schema.labelPlural}
        </h1>
        <Link href={`/admin/${type}/new`} className="admin-btn admin-btn-primary">
          <Plus size={14} /> Yeni {schema.labelSingular}
        </Link>
      </div>

      {error && (
        <div className="admin-card" style={{ borderColor: "#ef4444", color: "#fca5a5", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-card flex items-center gap-3" style={{ color: "var(--fg-muted)" }}>
          <Loader2 size={16} className="animate-spin" /> Yükleniyor...
        </div>
      ) : items.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", color: "var(--fg-muted)" }}>
          Henüz içerik yok. Yukarıdaki butondan eklemeye başla.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((it) => (
            <div
              key={String(it._path)}
              className="admin-card flex items-center justify-between"
              style={{ padding: "1rem 1.25rem" }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: "0.9375rem" }}>
                  {titleFor(it)}
                </div>
                <div style={{ color: "var(--fg-muted)", fontSize: "0.8125rem", marginTop: "0.25rem" }}>
                  {subtitleFor(it)} <span style={{ opacity: 0.5 }}>·</span> <code>{String(it.slug)}</code>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/${type}/edit?slug=${it.slug}`}
                  className="admin-btn admin-btn-outline"
                  style={{ padding: "0.5rem 0.875rem" }}
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => remove(it)}
                  disabled={busy === it._path}
                  className="admin-btn admin-btn-outline"
                  style={{ padding: "0.5rem 0.875rem", color: "#fca5a5", borderColor: "rgba(239, 68, 68, 0.3)" }}
                >
                  {busy === it._path ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
