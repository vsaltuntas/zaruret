"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getToken } from "../lib/auth";
import { ghGetFile, ghWriteFile, ghListDir } from "../lib/github";
import { schemas, getByPath, setByPath, type Field } from "../lib/schemas";
import { ImageUpload } from "./ImageUpload";
import { GalleryUpload } from "./GalleryUpload";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export function ContentForm({ type, mode }: { type: string; mode: "new" | "edit" }) {
  const schema = schemas[type];
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("slug") ?? "";

  const [state, setState] = useState<Record<string, unknown>>(() =>
    structuredClone(schema.defaults)
  );
  const [sha, setSha] = useState<string | undefined>();
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artistOptions, setArtistOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const needsArtists = schema.fields.some((f) => f.optionsFromContent === "artists");
    if (needsArtists) {
      ghListDir(token, "content/artists").then(async (list) => {
        const files = list.filter((f) => f.name.endsWith(".json"));
        const artists = await Promise.all(
          files.map(async (f) => {
            const res = await ghGetFile(token, f.path);
            if (!res) return null;
            const obj = JSON.parse(res.content);
            return { value: obj.slug as string, label: obj.name as string };
          })
        );
        setArtistOptions(artists.filter(Boolean) as { value: string; label: string }[]);
      });
    }
  }, [schema.fields]);

  useEffect(() => {
    if (mode !== "edit" || !slug) return;
    const token = getToken();
    if (!token) return;
    (async () => {
      try {
        const path = `${schema.dir}/${slug}.json`;
        const res = await ghGetFile(token, path);
        if (!res) {
          setError("Kayıt bulunamadı.");
          return;
        }
        setState(JSON.parse(res.content));
        setSha(res.sha);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, slug, schema.dir]);

  function update(path: string, value: unknown) {
    const next = structuredClone(state);
    setByPath(next, path, value);
    setState(next);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    const currentSlug = state.slug as string;
    if (!currentSlug) {
      setError("Slug zorunlu.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const path = `${schema.dir}/${currentSlug}.json`;
      const json = JSON.stringify(state, null, 2);
      const msg = `admin: ${mode === "new" ? "create" : "update"} ${path}`;
      await ghWriteFile(token, path, json, msg, undefined, sha);
      router.push(`/admin/${type}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-card flex items-center gap-3" style={{ color: "var(--fg-muted)" }}>
        <Loader2 size={16} className="animate-spin" /> Yükleniyor...
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/admin/${type}`}
        className="flex items-center gap-2 text-sm mb-6"
        style={{ color: "var(--fg-muted)" }}
      >
        <ArrowLeft size={14} /> {schema.labelPlural}
      </Link>

      <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "2rem" }}>
        {mode === "new" ? `Yeni ${schema.labelSingular}` : `${schema.labelSingular} Düzenle`}
      </h1>

      {error && (
        <div className="admin-card" style={{ borderColor: "#ef4444", color: "#fca5a5", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={save} className="admin-card flex flex-col gap-5">
        {schema.fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={getByPath(state, field.name)}
            onChange={(v) => update(field.name, v)}
            artistOptions={artistOptions}
          />
        ))}

        <div className="flex items-center gap-3" style={{ paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <Link href={`/admin/${type}`} className="admin-btn admin-btn-outline">
            İptal
          </Link>
          <span style={{ color: "var(--fg-muted)", fontSize: "0.75rem", marginLeft: "auto" }}>
            Kaydettikten sonra site 1-2 dk içinde yenilenir.
          </span>
        </div>
      </form>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  artistOptions,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  artistOptions: { value: string; label: string }[];
}) {
  const options = field.optionsFromContent === "artists" ? artistOptions : field.options ?? [];

  if (field.type === "text" || field.type === "url") {
    return (
      <div>
        <label className="admin-label">{field.label}{field.required && " *"}</label>
        <input
          type={field.type === "url" ? "url" : "text"}
          className="admin-input"
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div>
        <label className="admin-label">{field.label}{field.required && " *"}</label>
        <input
          type="number"
          className="admin-input"
          value={(value as number | string) ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          required={field.required}
        />
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div>
        <label className="admin-label">{field.label}{field.required && " *"}</label>
        <input
          type="date"
          className="admin-input"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className="admin-label">{field.label}{field.required && " *"}</label>
        <textarea
          className="admin-textarea"
          rows={5}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <label className="admin-label">{field.label}{field.required && " *"}</label>
        <select
          className="admin-select"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        >
          <option value="">— Seç —</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "multi-select") {
    const arr = (value as string[]) ?? [];
    return (
      <div>
        <label className="admin-label">{field.label}</label>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const checked = arr.includes(o.value);
            return (
              <label
                key={o.value}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.875rem",
                  border: `1px solid ${checked ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "9999px",
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  color: checked ? "var(--accent)" : "var(--fg)",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    onChange(
                      e.target.checked
                        ? [...arr, o.value]
                        : arr.filter((x) => x !== o.value)
                    );
                  }}
                  style={{ accentColor: "var(--accent)" }}
                />
                {o.label}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === "bilingual-text" || field.type === "bilingual-textarea") {
    const v = (value as { tr?: string; en?: string }) ?? { tr: "", en: "" };
    const Tag = field.type === "bilingual-textarea" ? "textarea" : "input";
    return (
      <div>
        <label className="admin-label">{field.label}{field.required && " *"}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--fg-muted)", marginBottom: "0.25rem" }}>TR</div>
            <Tag
              className={field.type === "bilingual-textarea" ? "admin-textarea" : "admin-input"}
              rows={field.type === "bilingual-textarea" ? 4 : undefined}
              value={v.tr ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChange({ ...v, tr: e.target.value })
              }
              required={field.required}
            />
          </div>
          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--fg-muted)", marginBottom: "0.25rem" }}>EN</div>
            <Tag
              className={field.type === "bilingual-textarea" ? "admin-textarea" : "admin-input"}
              rows={field.type === "bilingual-textarea" ? 4 : undefined}
              value={v.en ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChange({ ...v, en: e.target.value })
              }
              required={field.required}
            />
          </div>
        </div>
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <div>
        <label className="admin-label">{field.label}{field.required && " *"}</label>
        <ImageUpload
          value={(value as string) ?? ""}
          onChange={(url) => onChange(url)}
        />
      </div>
    );
  }

  if (field.type === "gallery") {
    return (
      <div>
        <label className="admin-label">{field.label}{field.required && " *"}</label>
        <GalleryUpload
          value={(value as string[]) ?? []}
          onChange={(urls) => onChange(urls)}
        />
      </div>
    );
  }

  return null;
}
