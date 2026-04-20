# Claude Experimental Features — Sohbet Özeti

Tarih: 2026-04-20

---

## 1. Soru: Claude experimental agents team nedir?

> Selam claude experimental agents team nedir antrophic sitesinde böyle bir dökümantasyon gördüm sanki araştırr mısın

### Cevap

Evet, gerçek bir özellik. Resmî dokümantasyon: **Claude Code "Agent Teams"** — experimental, varsayılan olarak kapalı.

### Özet

**Ne?** Birden fazla Claude Code oturumunu bir takım gibi koordine etmeni sağlıyor. Bir oturum **team lead**, diğerleri **teammate**. Her teammate kendi context window'unda çalışıyor ve birbirlerine doğrudan mesaj atabiliyorlar (mailbox + shared task list).

**Subagent'tan farkı:**
- Subagent: tek session içinde, sadece main agent'a sonuç dönüyor, kendi aralarında konuşamıyor.
- Agent team: her teammate bağımsız tam bir Claude Code session'ı, birbirleriyle `SendMessage` ile konuşuyor, ortak task list'ten iş çekiyor.

**Aktive etme:**
```json
// settings.json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```
Gereksinim: Claude Code **v2.1.32+**.

**Kullanım:** Doğal dilde "3 kişilik takım kur, biri güvenlik, biri performans, biri test coverage incelesin" gibi söylüyorsun; lead teammate'leri spawn edip koordine ediyor.

**Display modes:** `in-process` (tek terminal, Shift+Down ile dolaş) veya `tmux`/iTerm2 ile split panes.

**Best use case'ler:** paralel code review, rakip hipotezlerle debug, bağımsız modüller, frontend+backend+test cross-layer iş.

**Önemli limitler:**
- `/resume` ve `/rewind` in-process teammate'leri geri getirmiyor
- Nested team yok (teammate başka team açamaz)
- Lead sabit, transfer edilemez
- Token maliyeti session sayısıyla doğru orantılı — rutin iş için overkill
- Split-pane VS Code terminalinde çalışmıyor

Zaruret Records gibi küçük static-export projelerde pek gerekmez; büyük refactor veya çok katmanlı araştırmalar için anlamlı.

**Kaynaklar:**
- [Agent Teams — Claude Code Docs](https://code.claude.com/docs/en/agent-teams)
- [Subagents — Claude Code Docs](https://code.claude.com/docs/en/sub-agents)

---

## 2. Soru: Başka experimental Claude özellikleri nelerdir?

> bunun gibi experimental antrophic claude özellikleri başka neler var araştırır msın normalde kapalı olan yüklü olmayan pasif olan vs

### Cevap

Araştırdım, oldukça geniş bir "kapalı/deneysel özellik" listesi var. Özet:

### 1. Resmî experimental/opt-in env variable'ları

| Variable | Ne yapıyor |
|---|---|
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | Agent teams |
| `CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING=1` | Tool input'larını token-token stream etme (Anthropic API only) |
| `CLAUDE_CODE_ENABLE_TASKS=1` | Non-interactive modda task tracking |
| `CLAUDE_CODE_ENABLE_TELEMETRY=1` | OpenTelemetry metric/log export |
| `CLAUDE_CODE_ENABLE_BACKGROUND_PLUGIN_REFRESH=1` | Headless'da arka plan plugin yenileme |
| `CLAUDE_CODE_ENABLE_AWAY_SUMMARY=1` | Session recap (siz yokken ne oldu özeti) zorla açık |
| `CLAUDE_ENABLE_STREAM_WATCHDOG=1` | Stream idle watchdog |

Ayrıca `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` → tüm `anthropic-beta` header'larını sıyırır (beta API özelliklerini kapatır).

### 2. Compile-time feature flag'ler (Bun binary'sinden strip edilmiş ama kodda izleri var)

Reverse engineer edenlerin bulduğu, **henüz release edilmemiş** özellikler:

- **KAIROS** — persistent daemon mode. Arka planda sürekli çalışan, push notification gönderebilen, dosya/kanal desteği olan asistan.
- **BUDDY** — Tamagotchi tarzı companion. 18 tür (ördek, ejderha, axolotl, capybara, mantar, hayalet), nadirlik kademeleri, 5 stat (DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK). Evet, ciddi.
- **VOICE_MODE** — `/voice` ile push-to-talk ses arayüzü.
- **COORDINATOR_MODE** — agent teams'ten daha ağır multi-agent orkestratör.
- **ULTRAPLAN** — 30 dakikalık bulut tabanlı planlama oturumu.
- **CHICAGO_MCP** — Computer Use benzeri GUI otomasyonu.
- **DAEMON** — background worker altyapısı.
- **WEB_BROWSER** — native web otomasyonu (şu anki WebFetch'ten ayrı).
- **PROACTIVE** — kullanıcı istemeden aksiyon alma modu.
- **BRIDGE_MODE** — claude.ai üzerinden CLI'ı uzaktan kontrol.

### 3. Runtime feature gate'leri (GrowthBook, `tengu_` prefix'li)

Anthropic saatlik polling'le uzaktan açıp kapatabiliyor, kullanıcı update etmeden. Bilinen örnekler:
- `tengu_kairos` — KAIROS kill-switch
- `tengu_amber_quartz_disabled` — Voice mode kapat
- `tengu_penguins_off` — Fast mode kapat
- `tengu_anti_distill_fake_tool_injection` — rakip modellerin training data'ya Claude davranışını damıtmasını önlemek için fake tool injection
- Çoğu isim bilerek obfuscate edilmiş (`tengu_frond_boric` gibi).

### 4. Release'li ama varsayılan kapalı özellikler

- **Checkpointing** → açık ama `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` ile kapatılabiliyor
- **Adaptive thinking** (Opus/Sonnet 4.6)
- **1M context window**
- **Fast mode** (Opus 4.6 için hızlı çıktı)
- **Auto memory**
- **Scheduled tasks** (cron)
- **Subagents** (açık, doğru agent tanımı yazman lazım)
- **Hooks** (SessionStart, TeammateIdle, TaskCreated, TaskCompleted vb.)

### Özet

En ilginçleri: **KAIROS** (daemon mode), **VOICE_MODE**, **BUDDY** (companion), **CHICAGO_MCP** (computer use), **BRIDGE_MODE**. Bunlar kod içinde hazır ama production build'de kapalı — Anthropic yavaş yavaş açacak gibi. Şu an kullanıcı tarafından sadece `EXPERIMENTAL_AGENT_TEAMS` gerçekten aktive edilebilir durumda.

**Kaynaklar:**
- [Environment variables — Claude Code Docs](https://code.claude.com/docs/en/env-vars)
- [Settings — Claude Code Docs](https://code.claude.com/docs/en/settings)
- [330 Env Variables & 32 Feature Flags — ThePlanetTools](https://theplanettools.ai/blog/claude-code-330-env-variables-32-feature-flags)

---

## 3. Soru: Bunlar sadece Claude Code için mi? Desktop, Chat, Cowork, Dispatch'te de var mı?

> bunları sadece claude code için mi böyle şeyler var claude desktop claude chat claude cowork claude dispatch için flaan da bunlar kullanılabiliyor mu ya ds onlar için dd böyle farklı açılabilir özellikler flaan var mı

### Cevap

Yok sadece Claude Code değil, ama **Claude Code açık ara en çok toggle'a sahip olan** — çünkü CLI, env variable ve feature flag mimarisi ona uygun. Diğer ürünlerde daha çok "Settings'ten aç/kapa" tarzı UI toggle'ları var. Ürün ürün:

### Claude.ai (web chat)

- **Beta Features** sekmesi var (Settings → Feature preview). Plan'a göre değişiyor.
- **Research previews**: Computer Use, Claude in Chrome extension, Claude Design (Anthropic Labs).
- Env variable yok, sadece hesap bazlı UI toggle.
- Bazı özellikler A/B test'le açılıyor (sunucu tarafında GrowthBook — Claude Code'daki `tengu_` gate'lerinin benzeri).

### Claude Desktop (Mac/Windows app)

- **Computer Use** — research preview, **varsayılan kapalı**, Pro/Max gerekli. Settings'ten açılıyor.
- **Preview sessions** (Claude Code sekmesinde) — toggle.
- **Persist preview sessions** — toggle.
- CLI değil electron uygulaması, o yüzden `CLAUDE_CODE_EXPERIMENTAL_*` env variable'ları tam etkisiz değil ama çoğu sadece Code motorunu etkiliyor (desktop içine gömülü terminal).

### Claude Cowork

- Anthropic'in kurumsal "agentic AI for knowledge work" ürünü. Dosyalara erişir, uygulamaları açar, çok adımlı iş yapar.
- Kendi içinde research preview olarak:
  - **Computer Use** (ekran kontrolü, en son çare)
  - **Dispatch** (telefondan masaüstüne görev atama)
  - **Scheduled tasks**
  - **Connectors** (Gmail, Slack, Calendar vb.)
- Flag mimarisi kullanıcıya açık değil — Anthropic hesap/plan bazında açıyor.

### Claude Dispatch

- **Mart 2026**'da Cowork içinde çıktı. Telefondan masaüstü Claude'a sürekli bir konuşmayla bağlanmak.
- **Research preview, Pro/Max gerekli**, iki uygulamanın da en son sürümü şart.
- Bir "özellik", ayrı ürün değil.

### Claude API (Platform)

- **Beta headers** sistemi: isteğe `anthropic-beta: <feature-name>` header'ı ekleyerek erişiyorsun. Örn. prompt caching, extended context, structured outputs, files API, memory tool, computer-use-2025-01-24 vb.
- Claude Code'daki `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` bu header'ları otomatik siyiran switch.
- API tarafında geliştirici için en geniş "deneysel özellik" yüzeyi burası.

### Karşılaştırma

| Ürün | Experimental erişim yolu | Kullanıcı kontrolü |
|---|---|---|
| Claude Code | env var + feature flag + compile flag + GrowthBook gate | Geniş, teknik |
| Claude.ai | Settings → Feature preview | Sınırlı UI toggle |
| Desktop | Settings toggle | UI, Pro/Max gerekli |
| Cowork | Plan/hesap bazlı | Anthropic kontrolünde |
| Dispatch | Cowork içinde beta | App versiyonu + plan |
| API | `anthropic-beta` header | Tam kontrol |

### Leaked source'tan çıkan ortak altyapı

Kod leak'inde görüldü ki **KAIROS, BRIDGE_MODE, CHICAGO_MCP, COORDINATOR_MODE** gibi feature flag'ler sadece Claude Code için değil — bir kısmı Cowork/Dispatch/Desktop'a doğru evrilecek gibi duruyor. Özellikle BRIDGE_MODE (claude.ai'den CLI'ı uzaktan kontrol) ve CHICAGO_MCP (Computer Use GUI) zaten Cowork/Dispatch'in teknik temelini oluşturuyor. Yani aynı motor, farklı ürünler.

### Pratik çıkarım

Senin elle açıp oynayabileceğin gerçek experimental toggle'lar **Claude Code** ve **API beta headers**'ta. Desktop/Cowork/Dispatch'te sadece Anthropic'in sana verdiği kadarı var; flag'i sen açamazsın, hesap bazında geliyor.

**Kaynaklar:**
- [Available beta and research preview features — Claude Help](https://support.claude.com/en/articles/14503520-available-beta-and-research-preview-features)
- [Cowork — Claude](https://claude.com/product/cowork)
- [Claude API Beta headers](https://platform.claude.com/docs/en/api/beta-headers)
- [Claude Code hidden features — WaveSpeedAI](https://wavespeed.ai/blog/posts/claude-code-hidden-features-leaked-source-2026/)
