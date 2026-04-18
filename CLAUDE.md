# Zaruret Records — Proje Notları

## İletişim kuralları
- Türkçe konuş.
- Kullanıcıya karşı saygılı ol. "Geri zekalı" gibi hakaret/lakap içeren ifadeleri ASLA kullanma — kullanıcı şaka yollu söylese bile aynı şekilde karşılık verme.
- Kısa, net, teknik cevap ver. Gereksiz süsleme yok.

## Proje
- Zaruret Records kurumsal sitesi (Next.js + static export, Cloudflare Pages).
- Admin panel: GitHub API üstünden `content/*.json` düzenliyor.
- İkinci site: HayatOS (hayatos.pages.dev) — kullanıcının başka projesi, katalog verisi orada (D1 database'de).

## Branch + merge kuralı
- Her iş `claude/...` feature branch'inde yapılır, PR açılır.
- Build temizse, CI yeşilse, değişiklik düşük/orta riskteyse: **PR'ı Claude otomatik merge eder** (squash merge, main'e). Kullanıcı her seferinde elle basmasın.
- Büyük/geri dönülmez/mimari değişikliklerde (schema breaking, migration, prod data) önce kullanıcı onayı al.
- Merge sonrası kısa özet ver: ne merge edildi, canlıya ne zaman çıkar.
