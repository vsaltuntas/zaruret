"use client";

import { useState } from "react";
import { getToken } from "../lib/auth";
import { ghWriteFile } from "../lib/github";
import { Upload, Loader2, LinkIcon } from "lucide-react";

const OWNER = "vsaltuntas";
const REPO = "zaruret";
const BRANCH = "claude/music-label-websites-tHRWw";

export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");

  async function handleFile(file: File) {
    const token = getToken();
    if (!token) return;
    if (file.size > 8 * 1024 * 1024) {
      setErr("Dosya 8MB'dan büyük olamaz.");
      return;
    }
    setErr(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safe = file.name
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "image";
      const filename = `${Date.now()}-${safe}.${ext}`;
      const path = `public/uploads/${filename}`;

      const buf = await file.arrayBuffer();
      await ghWriteFile(token, path, new Uint8Array(buf), `admin: upload ${filename}`);

      // Public URL: statik export'ta /uploads/... olarak serve edilir
      const url = `/uploads/${filename}`;
      // Raw URL (CDN-cached): admin içinde anında önizleme için
      const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
      // Tercihen public site URL'i kullan ama fallback raw
      onChange(rawUrl);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className="admin-btn"
          style={{
            padding: "0.375rem 0.75rem",
            fontSize: "0.75rem",
            border: `1px solid ${mode === "upload" ? "var(--accent)" : "var(--border)"}`,
            color: mode === "upload" ? "var(--accent)" : "var(--fg-muted)",
            background: "transparent",
          }}
        >
          <Upload size={12} /> Yükle
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className="admin-btn"
          style={{
            padding: "0.375rem 0.75rem",
            fontSize: "0.75rem",
            border: `1px solid ${mode === "url" ? "var(--accent)" : "var(--border)"}`,
            color: mode === "url" ? "var(--accent)" : "var(--fg-muted)",
            background: "transparent",
          }}
        >
          <LinkIcon size={12} /> URL
        </button>
      </div>

      {mode === "upload" ? (
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "1.5rem",
            border: "1px dashed var(--border)",
            borderRadius: "0.75rem",
            cursor: uploading ? "wait" : "pointer",
            background: "var(--bg-elevated)",
          }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin" style={{ color: "var(--fg-muted)" }} />
              <div style={{ fontSize: "0.8125rem", color: "var(--fg-muted)" }}>Yükleniyor...</div>
            </>
          ) : (
            <>
              <Upload size={20} style={{ color: "var(--fg-muted)" }} />
              <div style={{ fontSize: "0.8125rem", color: "var(--fg-muted)" }}>
                Görsel seçmek için tıkla (max 8MB)
              </div>
            </>
          )}
        </label>
      ) : (
        <input
          type="url"
          className="admin-input"
          placeholder="https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {err && (
        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}>
          {err}
        </div>
      )}

      {value && (
        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)", wordBreak: "break-all" }}>
              {value}
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              style={{
                fontSize: "0.75rem",
                color: "#ef4444",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                marginTop: "0.25rem",
              }}
            >
              Kaldır
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
