import json
import base64
import urllib.request
from backend.config import GEMINI_API_KEY, DEFAULT_MODEL

def extract_claim_from_image(
    image_bytes: bytes, 
    mime_type: str = "image/jpeg", 
    api_key: str = None, 
    model: str = DEFAULT_MODEL
) -> str:
    """Membaca screenshot/gambar menggunakan kemampuan Multimodal Vision Gemini."""
    if not api_key:
        api_key = GEMINI_API_KEY
    if not api_key:
        raise ValueError("API Key Gemini diperlukan untuk membaca gambar.")

    b64_data = base64.b64encode(image_bytes).decode("utf-8")
    prompt = """Baca gambar/screenshot ini secara seksama (misalnya chat WhatsApp, selebaran poster, pengumuman, atau postingan medsos).
Tugasmu:
1. Pahami isi pesan/kabar yang disampaikan di dalam gambar.
2. Tuliskan ringkasan 1-2 kalimat mengenai KLAIM FAKTUAL utama yang perlu dicek kebenarannya.
Output HANYA berupa teks ringkasan klaim fakta tersebut, tanpa kata pengantar."""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {
                    "inline_data": {
                        "mime_type": mime_type,
                        "data": b64_data
                    }
                }
            ]
        }]
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
