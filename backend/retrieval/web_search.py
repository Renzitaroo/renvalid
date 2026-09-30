import json
import urllib.request
import urllib.parse
from typing import Dict, List

def search_duckduckgo(query: str) -> List[Dict[str, str]]:
    """Mencari cuplikan web dan klarifikasi via DuckDuckGo API."""
    url = f"https://api.duckduckgo.com/?q={urllib.parse.quote(query)}&format=json&no_html=1&skip_disambig=1"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    results = []
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data.get("AbstractText"):
                results.append({
                    "title": data.get("Heading", query),
                    "snippet": data.get("AbstractText", ""),
                    "url": data.get("AbstractURL", ""),
                    "source_type": "Web / Media Terverifikasi"
                })
            for r in data.get("RelatedTopics", [])[:3]:
                if isinstance(r, dict) and "Text" in r:
                    results.append({
                        "title": r.get("Text", "")[:60],
                        "snippet": r.get("Text", ""),
                        "url": r.get("FirstURL", ""),
                        "source_type": "Web / Media Terverifikasi"
                    })
    except Exception as e:
        print(f"[Warning] DDG fetch error: {e}")
    return results
