import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Ensure root directory is on python path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
load_dotenv(ROOT / ".env")

from backend.retrieval.wikipedia import search_wikipedia_id
from backend.retrieval.url_scraper import extract_text_from_url
from backend.core.verifier import verify_claim

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def test_wikipedia():
    results = search_wikipedia_id("Joko Widodo", limit=2)
    assert len(results) > 0, "Harus menemukan artikel Wikipedia"
    print("test_wikipedia passed")

def test_url_scraper():
    data = extract_text_from_url("https://id.wikipedia.org/wiki/Joko_Widodo")
    assert "Joko Widodo" in data["title"], "Scraper harus membaca judul dengan benar"
    print("test_url_scraper passed")

def test_predicate_alignment():
    res = verify_claim("Jokowi orang medan")
    assert "SALAH" in res["verdict"] or "HOAKS" in res["verdict"], f"Expected SALAH, got {res['verdict']}"
    assert "Solo" in res["ringkasan_fakta"] or "Surakarta" in res["ringkasan_fakta"] or "Solo" in res["detail_koreksi"]
    print("test_predicate_alignment passed")

if __name__ == "__main__":
    test_wikipedia()
    test_url_scraper()
    test_predicate_alignment()
    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")
