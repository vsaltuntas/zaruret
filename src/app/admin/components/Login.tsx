"use client";

import { useState } from "react";
import { setToken } from "../lib/auth";
import { ghWhoAmI } from "../lib/github";
import { KeyRound, ExternalLink, Loader2 } from "lucide-react";

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [token, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      const user = await ghWhoAmI(token.trim());
      setToken(token.trim(), user.login);
      onSuccess();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="admin-card w-full" style={{ maxWidth: "480px" }}>
        <div className="flex items-center gap-3 mb-6">
          <KeyRound size={24} style={{ color: "var(--accent)" }} />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            Zaruret Admin
          </h1>
        </div>

        <p style={{ color: "var(--fg-muted)", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          Giriş için GitHub Personal Access Token (PAT) kullanılır. Token
          tarayıcında saklanır, sadece sen görürsün. Token&apos;ı sadece
          güvendiğin cihazlarda kullan.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="admin-label">GitHub Token</label>
            <input
              type="password"
              className="admin-input"
              placeholder="ghp_..."
              value={token}
              onChange={(e) => setTokenInput(e.target.value)}
              autoFocus
            />
          </div>

          {err && (
            <div style={{ color: "#ef4444", fontSize: "0.8125rem" }}>{err}</div>
          )}

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {loading ? "Doğrulanıyor..." : "Giriş"}
          </button>
        </form>

        <details style={{ marginTop: "1.5rem", fontSize: "0.8125rem", color: "var(--fg-muted)" }}>
          <summary style={{ cursor: "pointer" }}>Token nasıl oluşturulur?</summary>
          <ol style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", lineHeight: 1.7 }}>
            <li>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=Zaruret%20Admin"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
              >
                Buradan token oluştur <ExternalLink size={12} />
              </a>
            </li>
            <li>Scope olarak <code>repo</code> seç (yazma izni için)</li>
            <li>Token&apos;ı kopyala, yukarıdaki alana yapıştır</li>
          </ol>
        </details>
      </div>
    </div>
  );
}
