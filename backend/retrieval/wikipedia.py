import json
import re
import urllib.request
import urllib.parse
from typing import Dict, List

def search_wikipedia_id(query: str, limit: int = 3) -> List[Dict[str, str]]:
    """Mencari data terstruktur di Wikipedia Bahasa Indonesia."""
    url = f"https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&format=json&utf8="
    req = urllib.request.Request(url, headers={"User-Agent": "RenValid-FactChecker/1.0"})
    results = []
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            for item in data.get("query", {}).get("search", [])[:limit]:
                title = item.get("title", "")
                snippet = re.sub(r"<[^>]+>", "", item.get("snippet", "")).strip()
                page_url = f"https://id.wikipedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
                results.append({
                    "title": f"Wikipedia: {title}",
                    "snippet": snippet,
                    "url": page_url,
                    "source_type": "Basis Pengetahuan Resmi"
                })
    except Exception as e:
        print(f"[Warning] Wikipedia fetch error: {e}")
    return results
