"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, ClipboardPaste } from "lucide-react";

type Track = { title: string; duration?: string };

export function TracklistEditor({
  value,
  onChange,
}: {
  value: Track[];
  onChange: (tracks: Track[]) => void;
}) {
  const [bulkText, setBulkText] = useState("");
  const tracks = value ?? [];

  function update(i: number, patch: Partial<Track>) {
    const next = [...tracks];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  function remove(i: number) {
    onChange(tracks.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= tracks.length) return;
    const next = [...tracks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  function add() {
    onChange([...tracks, { title: "", duration: "" }]);
  }

  function importBulk() {
    if (!bulkText.trim()) return;
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsed: Track[] = lines.map((line) => {
      // Supported formats:
      //   Title - 3:19
      //   Title — 3:19
      //   Title | 3:19
      //   Title 3:19
      //   1. Title - 3:19
      //   1 Title 3:19
      const cleaned = line.replace(/^\d+[.)\s]+/, "");
      const match = cleaned.match(/^(.+?)\s*[-—|\t]\s*(\d{1,2}:\d{2})\s*$/)
        ?? cleaned.match(/^(.+?)\s+(\d{1,2}:\d{2})\s*$/);
      if (match) {
        return { title: match[1].trim(), duration: match[2].trim() };
      }
      return { title: cleaned, duration: "" };
    });

    onChange([...tracks, ...parsed]);
    setBulkText("");
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
        {tracks.map((t, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr 80px auto",
              gap: "0.5rem",
              alignItems: "center",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              padding: "0.5rem",
            }}
          >
            <div style={{ color: "var(--fg-muted)", fontSize: "0.75rem", textAlign: "center" }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <input
              className="admin-input"
              placeholder="Şarkı adı"
              value={t.title ?? ""}
              onChange={(e) => update(i, { title: e.target.value })}
              style={{ padding: "0.375rem 0.625rem", fontSize: "0.8125rem" }}
            />
            <input
              className="admin-input"
              placeholder="3:19"
              value={t.duration ?? ""}
              onChange={(e) => update(i, { duration: e.target.value })}
              style={{ padding: "0.375rem 0.625rem", fontSize: "0.8125rem", textAlign: "center" }}
            />
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Yukarı"
                style={iconBtn}
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === tracks.length - 1}
                title="Aşağı"
                style={iconBtn}
              >
                <ArrowDown size={12} />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                title="Sil"
                style={{ ...iconBtn, color: "#ef4444" }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="admin-btn admin-btn-outline"
        style={{ padding: "0.375rem 0.875rem", fontSize: "0.8125rem", marginBottom: "1rem" }}
      >
        <Plus size={12} /> Şarkı Ekle
      </button>

      <details>
        <summary style={{ cursor: "pointer", fontSize: "0.8125rem", color: "var(--fg-muted)", marginBottom: "0.5rem" }}>
          <ClipboardPaste size={12} style={{ display: "inline", marginRight: "0.375rem" }} />
          Toplu ekle (yapıştır)
        </summary>
        <textarea
          className="admin-textarea"
          placeholder={`Her satırda bir şarkı. Örnek:\nHe Lan - 3:19\nÜryan Geldim Üryan Giderim - 4:14\nHekimoğlu 4:34`}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          rows={6}
          style={{ fontSize: "0.8125rem", marginTop: "0.5rem" }}
        />
        <button
          type="button"
          onClick={importBulk}
          disabled={!bulkText.trim()}
          className="admin-btn admin-btn-primary"
          style={{ padding: "0.375rem 0.875rem", fontSize: "0.8125rem", marginTop: "0.5rem" }}
        >
          Parse et ve ekle
        </button>
      </details>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid var(--border)",
  color: "var(--fg-muted)",
  borderRadius: "0.375rem",
  padding: "0.25rem",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};
