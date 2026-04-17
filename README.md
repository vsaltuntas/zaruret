# Zaruret Records

Bağımsız müzik evi — label, stüdyo, yapımcılık ve etkinlik.
Dark cinematic tasarımda, çift dilli (TR/EN) kurumsal web sitesi.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + CSS variables
- next-intl (TR/EN)
- Framer Motion
- React Hook Form + Zod
- Cloudflare Pages deploy

## Lokal Geliştirme

```bash
npm install
npm run dev
```

→ http://localhost:3000

## Cloudflare Pages Deploy (telefondan)

1. https://dash.cloudflare.com → **Workers & Pages**
2. **Create** → **Pages** → **Connect to Git**
3. `vsaltuntas/zaruret` reposunu seç
4. Branch: `claude/music-label-websites-tHRWw` (merge sonrası `main`)
5. Build settings:
   - Framework preset: **Next.js (Static HTML Export)** (veya "None")
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variable: `NODE_VERSION = 20`
6. **Save and Deploy**

Deploy bitince `https://<proje>.pages.dev` URL'i verilir.
Custom domain için: Pages projesi → **Custom domains** → `zaruretrecords.com`.

## Dosya Yapısı

```
src/
├── app/[locale]/       # TR/EN route'lar (9 sayfa)
├── components/         # layout, hero, home, forms, ui
├── i18n/               # next-intl routing
├── lib/mock-data.ts    # placeholder içerik
└── middleware.ts
messages/               # tr.json, en.json
```

## İçerik Güncelleme

Şu anda içerik `src/lib/mock-data.ts` içinde. Sanatçı, release, etkinlik ve haber
verileri burada. Gerçek veriler hazır olduğunda buradan güncellenebilir ya da
sonraki faz olan Sanity CMS entegrasyonu yapılabilir.

## Sıradaki Fazlar

- Sanity CMS (panelden içerik yönetimi)
- Form backend (Cloudflare Worker + Resend API → email)
- Gerçek logo, fotoğraf, hero video
- Custom domain

## Lisans

© Zaruret Records.
