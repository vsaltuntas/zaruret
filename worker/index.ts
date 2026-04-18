export interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  RESEND_API_KEY: string;
  MAIL_FROM: string;
  MAIL_TO_INFO: string;
  MAIL_TO_DEMO: string;
  MAIL_TO_NEWSLETTER?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      return request.method === "POST"
        ? handleContact(request, env)
        : methodNotAllowed();
    }
    if (url.pathname === "/api/newsletter") {
      return request.method === "POST"
        ? handleNewsletter(request, env)
        : methodNotAllowed();
    }
    if (url.pathname.startsWith("/api/")) {
      return json({ error: "not_found" }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request: Request, env: Env): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true });
  }

  const type = body.type === "demo" ? "demo" : body.type === "general" ? "general" : null;
  if (!type) return json({ error: "invalid_type" }, 400);

  const email = strField(body.email, 254);
  if (!email || !isEmail(email)) return json({ error: "invalid_email" }, 400);

  const message = strField(body.message, 5000);
  if (!message) return json({ error: "message_required" }, 400);

  let subject: string;
  let text: string;
  let to: string;

  if (type === "demo") {
    const artistName = strField(body.artistName, 200);
    const link = strField(body.link, 500);
    if (!artistName) return json({ error: "artistName_required" }, 400);
    if (!link || !isUrl(link)) return json({ error: "invalid_link" }, 400);
    subject = `Demo — ${artistName}`;
    text = [
      `Yeni demo başvurusu`,
      ``,
      `Sanatçı : ${artistName}`,
      `E-posta : ${email}`,
      `Link    : ${link}`,
      ``,
      `Mesaj:`,
      message,
    ].join("\n");
    to = env.MAIL_TO_DEMO;
  } else {
    const name = strField(body.name, 200);
    const subjectField = strField(body.subject, 300);
    if (!name) return json({ error: "name_required" }, 400);
    if (!subjectField) return json({ error: "subject_required" }, 400);
    subject = `İletişim — ${subjectField}`;
    text = [
      `Yeni iletişim mesajı`,
      ``,
      `İsim   : ${name}`,
      `E-posta: ${email}`,
      `Konu   : ${subjectField}`,
      ``,
      `Mesaj:`,
      message,
    ].join("\n");
    to = env.MAIL_TO_INFO;
  }

  const sent = await sendEmail(env, {
    to,
    subject,
    text,
    replyTo: email,
  });
  if (!sent.ok) return json({ error: "send_failed", detail: sent.detail }, 502);

  return json({ ok: true });
}

async function handleNewsletter(request: Request, env: Env): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true });
  }

  const email = strField(body.email, 254);
  if (!email || !isEmail(email)) return json({ error: "invalid_email" }, 400);

  const to = env.MAIL_TO_NEWSLETTER ?? env.MAIL_TO_INFO;
  const sent = await sendEmail(env, {
    to,
    subject: `Bülten aboneliği — ${email}`,
    text: `Yeni bülten aboneliği.\n\nE-posta: ${email}\nTarih: ${new Date().toISOString()}`,
    replyTo: email,
  });
  if (!sent.ok) return json({ error: "send_failed", detail: sent.detail }, 502);

  return json({ ok: true });
}

async function sendEmail(
  env: Env,
  msg: { to: string; subject: string; text: string; replyTo?: string }
): Promise<{ ok: true } | { ok: false; detail: string }> {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) {
    return { ok: false, detail: "missing_env" };
  }
  const payload: Record<string, unknown> = {
    from: env.MAIL_FROM,
    to: [msg.to],
    subject: msg.subject,
    text: msg.text,
  };
  if (msg.replyTo) payload.reply_to = msg.replyTo;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => `${res.status}`);
    return { ok: false, detail: detail.slice(0, 500) };
  }
  return { ok: true };
}

function strField(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (!trimmed) return null;
  if (trimmed.length > max) return null;
  return trimmed;
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function methodNotAllowed(): Response {
  return json({ error: "method_not_allowed" }, 405);
}
