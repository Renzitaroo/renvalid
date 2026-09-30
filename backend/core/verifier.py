import json
import urllib.request
import urllib.error
from typing import Dict, Any, List

from backend.config import GEMINI_API_KEY, DEFAULT_MODEL
from backend.retrieval.wikipedia import search_wikipedia_id
from backend.retrieval.web_search import search_duckduckgo

def gather_evidence(claim: str) -> List[Dict[str, str]]:
    """Mengumpulkan bukti multi-sumber yang relevan dengan predikat klaim."""
    evidence = []
    
    # 1. Pencarian langsung klaim
    evidence.extend(search_wikipedia_id(claim, limit=2))
    evidence.extend(search_duckduckgo(claim))
    
    # 2. Predicate Expansion: Jika ada pola identitas/asal-usul
    lower_claim = claim.lower()
    if any(w in lower_claim for w in ["orang ", "asal ", "lahir", "tinggal di", "keturunan"]):
        expanded_q = f"tempat lahir biodata {claim}"
        evidence.extend(search_wikipedia_id(expanded_q, limit=2))
        
    # 3. Hoax & Clarification Expansion: Jika klaim berupa isu sensitif / bansos / kabar viral
    if any(w in lower_claim for w in ["bansos", "dana bantuan", "meninggal", "hoaks", "resmi", "pendaftaran"]):
        evidence.extend(search_duckduckgo(f"cek fakta klarifikasi {claim}"))
        
    # Deduplikasi berdasarkan URL
    unique_evidence = []
    seen_urls = set()
    for ev in evidence:
        if ev["url"] and ev["url"] not in seen_urls:
            seen_urls.add(ev["url"])
            unique_evidence.append(ev)
        elif not ev["url"] and ev["snippet"]:
            unique_evidence.append(ev)
            
    return unique_evidence[:6]

def verify_claim(
    claim: str, 
    api_key: str = None, 
    model: str = DEFAULT_MODEL
) -> Dict[str, Any]:
    """
    Memverifikasi keabsahan informasi menggunakan Gemini Flash reasoning
    dengan bukti grounding real-time.
    """
    if not api_key:
        api_key = GEMINI_API_KEY
        
    if not api_key:
        raise ValueError("API Key Gemini tidak ditemukan. Harap masukkan API Key di .env.")

    # 1. Tarik bukti real-time
    evidences = gather_evidence(claim)
    evidence_text = "\n\n".join([
        f"Sumber: {e['title']} ({e['url']})\nTipe: {e['source_type']}\nKutipan Bukti: {e['snippet']}"
        for e in evidences
    ]) if evidences else "Gunakan basis pengetahuan ensiklopedia resmi terpercaya."

    # 2. Susun prompt anti-conflation
    prompt = f"""Kamu adalah mesin pemeriksa fakta (fact-checker) profesional independen berbahasa Indonesia.
Tugasmu: Verifikasi klaim pengguna berikut secara objektif dan berbasis bukti.

KLAIM PENGGUNA:
"{claim}"

BUKTI PENDUKUNG TERBARU DARI WEB & ENSIKLOPEDIA:
{evidence_text}

PANDUAN UTAMA EVALUASI:
1. PERHATIKAN RELASI PREDIKAT (Anti-Conflation):
   - Jangan menyamakan relasi 'asal-usul/kelahiran/tempat lahir' dengan 'kunjungan/kegiatan/afiliasi kerja'.
   - Contoh: Jika klaim menyebut 'X orang kota Y' padahal aslinya lahir/asal dari kota Z, maka klaim tersebut SALAH/HOAKS. Jelaskan bahwa keberadaannya di Y hanya kunjungan/hubungan relasi, bukan asal daerahnya.
2. KLASIFIKASI VERDICT:
   - 'SALAH / HOAKS': Klaim terbukti salah, bertentangan dengan fakta, atau kabar bohong yang sudah diklarifikasi.
   - 'BENAR / FAKTA': Klaim terbukti benar dan didukung oleh data/biografi/fakta resmi.
   - 'MERAGUKAN / KURANG KONTEKS': Klaim sebagian benar tapi dipelintir, belum ada bukti konklusif, atau menyesatkan.
   - 'OPINI SUBJEKTIF': Pernyataan berupa selera, ramalan masa depan, atau pandangan pribadi yang tidak memiliki tolok ukur fakta obyektif.

Format output WAJIB HANYA JSON MURNI dengan struktur berikut:
{{
  "verdict": "SALAH / HOAKS" | "BENAR / FAKTA" | "MERAGUKAN / KURANG KONTEKS" | "OPINI SUBJEKTIF",
  "confidence_score": 95,
  "ringkasan_fakta": "1-2 kalimat tegas meluruskan apa fakta yang sebenarnya.",
  "detail_koreksi": "Penjelasan rinci mengapa klaim ini salah/benar serta apa bukti pembandingnya.",
  "poin_kunci": [
    "Poin fakta 1...",
    "Poin fakta 2..."
  ],
  "pesan_whatsapp": "Draf pesan bantahan/klarifikasi sopan berformat WhatsApp (gunakan bold *kata*, jangan kaku) siap kirim ke grup chat.",
  "sumber_rujukan": [
    {{"nama": "...", "url": "...", "keterangan": "..."}}
  ]
}}
DILARANG memberikan output selain JSON murni! Jangan gunakan pembungkus markdown ```json.
"""

    models_to_try = [model, "gemini-3.6-flash", "gemini-flash-lite-latest"]
    last_error = None

    for m in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=14) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                
                # Pembersihan JSON
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                if raw_text.startswith("```"):
                    raw_text = raw_text[3:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                    
                result_json = json.loads(raw_text.strip())
                
                if not result_json.get("sumber_rujukan") and evidences:
                    result_json["sumber_rujukan"] = [
                        {"nama": e["title"], "url": e["url"], "keterangan": e["snippet"][:100]}
                        for e in evidences if e["url"]
                    ]
                return result_json
        except urllib.error.HTTPError as e:
            last_error = e
            err_body = e.read().decode("utf-8")
            if e.code == 503:
                continue
            raise RuntimeError(f"Gemini API Error ({e.code}): {err_body}")
        except Exception as e:
            last_error = e
            continue

    raise RuntimeError(f"Gagal memverifikasi klaim setelah mencoba beberapa model: {last_error}")
