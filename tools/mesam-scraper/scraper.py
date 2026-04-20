#!/usr/bin/env python3
"""
MESAM eser arama scraper.

Amac: Soz yazari veya bestecisi "DP" (anonim/kamu malı) gosterilirken
diger rolu gercek bir kisiye atanmis eserleri tespit etmek.

- A tipi: SOZ=DP, BESTE=kisi  (halk sozune beste uyduran)
- B tipi: BESTE=DP, SOZ=kisi  (halk ezgisine soz yazdigini iddia eden)
- DP (BESTECI SOZ YAZARI): tamamen anonim, listeye alinmaz.

Kullanim:
    pip install -r requirements.txt
    python scraper.py --out mesam_suphe.csv                  # requests modu
    python scraper.py --mode playwright --out mesam_suphe.csv
    python scraper.py --prefixes A,B,AL,BE

API henuz bilinmiyor: script acilista birkac yaygin form-parametre
kombinasyonunu deneyip dogrusunu bulmaya calisir. Bulamazsa gercek
istegi F12 Network'ten kopyalayip --endpoint/--method/--param-eser vb.
flaglerle elle verebilirsin.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
import time
from dataclasses import dataclass, field
from typing import Iterable, Optional

import requests
from bs4 import BeautifulSoup


BASE_URL = "https://www.mesam.org.tr/eser-arama/search"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/131.0.0.0 Safari/537.36"
)
ALPHA = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

PARAM_CANDIDATES = [
    ("EserAdi", "IlkSatir", "EserSahibi"),
    ("eserAdi", "ilkSatir", "eserSahibi"),
    ("eser_adi", "ilk_satir", "eser_sahibi"),
    ("EserAdi", "IlkSatir", "EserSahipleri"),
    ("eserAdi", "ilkSatir", "eserSahipleri"),
    ("name", "firstLine", "owner"),
    ("ad", "satir", "sahip"),
]


@dataclass
class Eser:
    eser_no: str
    eser_adi: str = ""
    ilk_satir: str = ""
    hak_sahipleri_raw: str = ""
    soz_yazari: Optional[str] = None
    besteci: Optional[str] = None
    tip: Optional[str] = None
    roller: list[tuple[str, str]] = field(default_factory=list)


ROLE_RE = re.compile(r"([^\n(]+?)\s*\(\s*([^)]+?)\s*\)")


def analyze_roles(raw: str) -> tuple[Optional[str], Optional[str], list[tuple[str, str]]]:
    """
    Ornek girdi:
        "DP ( BESTECI )\nMETIN MAHMUT ( SOZ YAZARI )"
        "DP ( BESTECI SOZ YAZARI )"
    """
    soz = beste = None
    roller: list[tuple[str, str]] = []
    for m in ROLE_RE.finditer(raw or ""):
        name = m.group(1).strip()
        role = m.group(2).strip().upper()
        role_norm = (
            role.replace("İ", "I").replace("Ş", "S").replace("Ö", "O")
                .replace("Ç", "C").replace("Ğ", "G").replace("Ü", "U")
        )
        roller.append((name, role))
        if "BESTECI" in role_norm:
            beste = name
        if "SOZ" in role_norm:
            soz = name
    return soz, beste, roller


def classify(soz: Optional[str], beste: Optional[str]) -> Optional[str]:
    if not soz or not beste:
        return None
    soz_dp = soz.strip().upper() == "DP"
    beste_dp = beste.strip().upper() == "DP"
    if soz_dp and beste_dp:
        return None
    if soz_dp and not beste_dp:
        return "A"
    if beste_dp and not soz_dp:
        return "B"
    return None


def parse_results(html: str) -> list[Eser]:
    soup = BeautifulSoup(html, "lxml")
    items: list[Eser] = []

    # Strateji 1: ESER NO baslikli her blogu yakala
    blocks: list[str] = []

    # Kartlar halinde olabilir (div), veya tablo satirlari.
    for tag in soup.find_all(["div", "article", "section", "li", "tr", "table"]):
        text = tag.get_text("\n", strip=True)
        if "ESER NO" in text and "HAK SAH" in text and text.count("ESER NO") == 1:
            if not any(text in b or b in text for b in blocks):
                blocks.append(text)

    if not blocks:
        # Fallback: tum sayfadan regex ile bloklara ayir
        full = soup.get_text("\n", strip=True)
        parts = re.split(r"(?=ESER NO)", full)
        blocks = [p for p in parts if "ESER NO" in p and "HAK SAH" in p]

    # En kucuk kapsayan bloklari sec (kartlar ic ice match'liyor olabilir)
    blocks.sort(key=len)
    dedup: list[str] = []
    for b in blocks:
        if not any(b in d for d in dedup):
            dedup.append(b)

    for text in dedup:
        no = re.search(r"ESER NO\s*:?\s*([0-9.]+)", text)
        if not no:
            continue
        ad = re.search(r"ESER AD[IİU]\s*:?\s*([^\n]+)", text)
        satir = re.search(r"[İI]LK SATIR\s*:?\s*([^\n]+)", text)
        sahip_m = re.search(r"HAK SAH[İI]B[İI]\s*:?\s*(.+)", text, re.S)
        raw = sahip_m.group(1).strip() if sahip_m else ""
        # Sadece hak sahibi bolumunu al - sonraki ESER NO'ya kadar
        raw = re.split(r"\n\s*ESER NO", raw)[0].strip()

        e = Eser(
            eser_no=no.group(1),
            eser_adi=ad.group(1).strip() if ad else "",
            ilk_satir=satir.group(1).strip() if satir else "",
            hak_sahipleri_raw=raw,
        )
        e.soz_yazari, e.besteci, e.roller = analyze_roles(raw)
        e.tip = classify(e.soz_yazari, e.besteci)
        items.append(e)

    return items


def probe_endpoint(session: requests.Session) -> tuple[str, tuple[str, str, str]]:
    last_err = None
    for params in PARAM_CANDIDATES:
        for method in ("POST", "GET"):
            data = {params[0]: "", params[1]: "", params[2]: "DP"}
            try:
                if method == "GET":
                    r = session.get(BASE_URL, params=data, timeout=30)
                else:
                    r = session.post(BASE_URL, data=data, timeout=30)
            except Exception as ex:
                last_err = ex
                continue
            if r.status_code == 200 and "ESER NO" in r.text:
                print(f"[probe] OK method={method} params={params}", file=sys.stderr)
                return method, params
    raise RuntimeError(
        f"Form parametreleri tespit edilemedi. F12'den istegin "
        f"URL/method/payload'unu gor, --method ve --param-* flagleri ile ver. "
        f"Son hata: {last_err!r}"
    )


def fetch(
    session: requests.Session,
    method: str,
    params: tuple[str, str, str],
    eser_adi: str = "",
    ilk_satir: str = "",
    sahip: str = "DP",
) -> str:
    data = {params[0]: eser_adi, params[1]: ilk_satir, params[2]: sahip}
    if method == "GET":
        r = session.get(BASE_URL, params=data, timeout=60)
    else:
        r = session.post(BASE_URL, data=data, timeout=60)
    r.raise_for_status()
    return r.text


def run_requests(args) -> list[Eser]:
    s = requests.Session()
    s.headers.update({
        "User-Agent": UA,
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    })
    if args.method and args.param_eser and args.param_satir and args.param_sahip:
        method = args.method
        params = (args.param_eser, args.param_satir, args.param_sahip)
    else:
        method, params = probe_endpoint(s)

    prefixes: Iterable[str] = (
        [p.strip() for p in args.prefixes.split(",")] if args.prefixes else ALPHA
    )

    all_items: dict[str, Eser] = {}
    for p in prefixes:
        try:
            html = fetch(s, method, params, eser_adi=p)
        except Exception as ex:
            print(f"[{p}] HATA: {ex}", file=sys.stderr)
            continue
        items = parse_results(html)
        print(f"[{p}] ham: {len(items)}  kumulatif: {len(all_items)}", file=sys.stderr)
        for it in items:
            all_items.setdefault(it.eser_no, it)
        time.sleep(args.delay)

    return list(all_items.values())


def run_playwright(args) -> list[Eser]:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("playwright kurulu degil. Kurmak icin:", file=sys.stderr)
        print("  pip install playwright && python -m playwright install chromium",
              file=sys.stderr)
        sys.exit(2)

    prefixes: Iterable[str] = (
        [p.strip() for p in args.prefixes.split(",")] if args.prefixes else ALPHA
    )
    all_items: dict[str, Eser] = {}

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=not args.headed)
        ctx = browser.new_context(user_agent=UA, locale="tr-TR")
        page = ctx.new_page()

        for p in prefixes:
            page.goto(BASE_URL, wait_until="networkidle", timeout=60_000)
            inputs = page.locator("input:not([type=hidden])")
            count = inputs.count()
            if count < 3:
                print(f"[{p}] beklenen 3 input bulunamadi ({count})", file=sys.stderr)
                continue
            inputs.nth(0).fill(p)       # EserAdi
            inputs.nth(1).fill("")      # IlkSatir
            inputs.nth(2).fill("DP")    # EserSahipleri
            page.get_by_role("button", name=re.compile(r"Ara", re.I)).click()
            page.wait_for_load_state("networkidle", timeout=60_000)
            html = page.content()
            items = parse_results(html)
            print(f"[{p}] ham: {len(items)}  kumulatif: {len(all_items)}", file=sys.stderr)
            for it in items:
                all_items.setdefault(it.eser_no, it)
            time.sleep(args.delay)

        browser.close()

    return list(all_items.values())


def write_csv(out: str, items: list[Eser]) -> tuple[int, int]:
    suspicious = [i for i in items if i.tip in ("A", "B")]
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([
            "tip", "eser_no", "eser_adi", "ilk_satir",
            "soz_yazari", "besteci", "hak_sahipleri_raw",
        ])
        for i in suspicious:
            w.writerow([
                i.tip, i.eser_no, i.eser_adi, i.ilk_satir,
                i.soz_yazari or "", i.besteci or "", i.hak_sahipleri_raw,
            ])
    return len(items), len(suspicious)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--mode", choices=["requests", "playwright"], default="requests")
    ap.add_argument("--out", default="mesam_suphe.csv")
    ap.add_argument("--prefixes", default="",
                    help="Virgullu. Bosa A..Z kullanilir. Ornek: A,B,AL,BE")
    ap.add_argument("--delay", type=float, default=0.8, help="Istekler arasi saniye")
    ap.add_argument("--headed", action="store_true", help="Playwright tarayici gorunsun")
    ap.add_argument("--method", choices=["GET", "POST"], help="Probe'u atlamak icin")
    ap.add_argument("--param-eser", help="Eser Adi input name")
    ap.add_argument("--param-satir", help="Ilk Satir input name")
    ap.add_argument("--param-sahip", help="Eser Sahipleri input name")
    args = ap.parse_args()

    if args.mode == "requests":
        items = run_requests(args)
    else:
        items = run_playwright(args)

    toplam, suphe = write_csv(args.out, items)
    print(f"\nTarama bitti.")
    print(f"  Toplam taranan (tekil) eser : {toplam}")
    print(f"  Supheli (A veya B tipi)     : {suphe}")
    print(f"  CSV                         : {args.out}")


if __name__ == "__main__":
    main()
