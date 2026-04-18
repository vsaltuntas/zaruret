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
Custom domain için: Pages projesi → **Custom domains** → `zaruret.com`.

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

## Form Backend (Cloudflare Worker + Resend)

`/api/contact` ve `/api/newsletter` Worker endpoint'leri `worker/index.ts` içinde.
Site `wrangler.toml` üstünden Worker + Assets modunda deploy ediliyor.

Canlıda çalışması için CF dashboard → Worker → Settings → Variables:

| Key | Değer |
|---|---|
| `RESEND_API_KEY` | Resend hesabından alınan API anahtarı (secret) |
| `MAIL_FROM` | `Zaruret <noreply@zaruret.com>` (Resend'de domain doğrulanmalı) |
| `MAIL_TO_INFO` | `info@zaruret.com` |
| `MAIL_TO_DEMO` | `demo@zaruret.com` |
| `MAIL_TO_NEWSLETTER` | (opsiyonel, default = info) |

Resend tarafında `zaruret.com` için SPF/DKIM kayıtları Cloudflare DNS'e eklenmeli.

## Admin Panel Env Vars

| Key | Default |
|---|---|
| `NEXT_PUBLIC_ADMIN_OWNER` | `vsaltuntas` |
| `NEXT_PUBLIC_ADMIN_REPO` | `zaruret` |
| `NEXT_PUBLIC_ADMIN_BRANCH` | `main` |

Feature branch'e commit atmak için CF Pages build environment'ta `NEXT_PUBLIC_ADMIN_BRANCH` ayarla.

## Sıradaki Fazlar

- Sanity CMS (panelden içerik yönetimi)
- Gerçek logo, fotoğraf, hero video
- Custom domain

## Lisans

© Zaruret Records.

## Admin Panel (CMS)

Site, `content/*.json` dosyalarındaki veriyi okuyor. Yönetim paneli:

**Admin URL:** `/admin` (örn. `https://zaruret.com/admin`)

### Giriş Yöntemi

GitHub Personal Access Token (PAT) ile giriş. Token tarayıcıda saklanır,
hiçbir yere gönderilmez. Her değişiklik doğrudan GitHub API'ye commit atar →
site otomatik yeniden derlenir.

### PAT Oluşturma

1. https://github.com/settings/tokens/new?scopes=repo&description=Zaruret%20Admin
2. Scope: `repo` (zorunlu — yazma izni)
3. Token'ı `/admin` login ekranına yapıştır

### Yönetilen İçerik

- **Sanatçılar** (`content/artists/`)
- **Yayınlar** (`content/releases/`)
- **Etkinlikler** (`content/events/`)
- **Haberler** (`content/news/`)
- **Ekip** (`content/team/`)
- **Görseller:** `public/uploads/` altına yüklenir

### Akış

1. Admin'de ekle/düzenle/sil → GitHub API'ye commit
2. Push'a bağlı olarak Cloudflare Pages / GitHub Pages rebuild
3. ~1-2 dk sonra canlıda
