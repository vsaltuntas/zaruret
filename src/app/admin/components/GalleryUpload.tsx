"use client";

import { useState } from "react";
import { getToken } from "../lib/auth";
import { ghWriteFile } from "../lib/github";
import { Upload, Loader2, X, GripVertical, LinkIcon } from "lucide-react";

const OWNER = "vsaltuntas";
const REPO = "zaruret";
const BRANCH = "claude/music-label-websites-tHRWw";

export function GalleryUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const items = value ?? [];

  async function handleFiles(files: FileList) {
    const token = getToken();
    if (!token) return;
    setErr(null);
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 8 * 1024 * 1024) {
          setErr(`${file.name} 8MB'dan buyuk, atlandi`);
          continue;
        }
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const safe =
          file.name
            .replace(/\.[^.]+$/, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 40) || "image";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safe}.${ext}`;
        const path = `public/uploads/${filename}`;
        const buf = await file.arrayBuffer();
        await ghWriteFile(
          token,
          path,
          new Uint8Array(buf),
          `admin: upload ${filename}`
        );
        const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
        newUrls.push(rawUrl);
      }
      onChange([...items, ...newUrls]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  }

  function removeAt(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  function addUrl() {
    if (!urlInput.trim()) return;
    onChange([...items, urlInput.trim()]);
    setUrlInput("");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            border: "1px dashed var(--border)",
            borderRadius: "0.5rem",
            cursor: uploading ? "wait" : "pointer",
            background: "var(--bg-elevated)",
            fontSize: "0.8125rem",
            color: "var(--fg-muted)",
          }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {uploading ? "Yukleniyor..." : "Birden cok gorsel yukle"}
        </label>

        <div style={{ display: "flex", gap: "0.375rem", flex: 1, minWidth: "200px" }}>
          <input
            type="url"
            className="admin-input"
            placeholder="veya URL yapistir"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            style={{ padding: "0.5rem 0.75rem", fontSize: "0.8125rem" }}
          />
          <button
            type="button"
            onClick={addUrl}
            className="admin-btn admin-btn-outline"
            style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem" }}
          >
            <LinkIcon size={12} /> Ekle
          </button>
        </div>
      </div>

      {err && (
        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
          {err}
        </div>
      )}

      {items.length === 0 ? (
        <div
          style={{
            padding: "1.5rem",
            textAlign: "center",
            color: "var(--fg-muted)",
            fontSize: "0.8125rem",
            border: "1px dashed var(--border)",
            borderRadius: "0.5rem",
          }}
        >
          Henuz gorsel yok. Yukarida cok dosya secebilir veya URL yapistirabilirsin.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {items.map((url, i) => (
            <div
              key={`${url}-${i}`}
              style={{
                position: "relative",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                overflow: "hidden",
                background: "var(--bg-elevated)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`gallery-${i}`}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8))",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  padding: "0.375rem",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  <button
                    type="button"
                    title="Sola al"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "white",
                      border: "none",
                      borderRadius: "0.25rem",
                      padding: "0.25rem",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    title="Saga al"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "white",
                      border: "none",
                      borderRadius: "0.25rem",
                      padding: "0.25rem",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  title="Sil"
                  onClick={() => removeAt(i)}
                  style={{
                    background: "rgba(239,68,68,0.9)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    padding: "0.25rem",
                    cursor: "pointer",
                  }}
                >
                  <X size={12} />
                </button>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "0.25rem",
                  left: "0.25rem",
                  background: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "0.125rem 0.375rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.625rem",
                }}
              >
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
