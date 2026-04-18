"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type State = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const tForm = useTranslations("form");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      if (res.ok) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "submitting"}
          placeholder={t("emailPlaceholder")}
          className="flex-1 bg-bg-elevated border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="btn btn-primary text-xs disabled:opacity-50"
        >
          {state === "submitting" ? tForm("submitting") : t("subscribe")}
        </button>
      </div>
      {state === "success" && (
        <div className="mt-2 text-xs text-accent">{tForm("success")}</div>
      )}
      {state === "error" && (
        <div className="mt-2 text-xs text-red-400">{tForm("error")}</div>
      )}
    </form>
  );
}
