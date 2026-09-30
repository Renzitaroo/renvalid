import urllib.request
from typing import Dict
from bs4 import BeautifulSoup

def extract_text_from_url(url: str) -> Dict[str, str]:
    """Mengambil judul dan teks artikel berita dari link URL."""
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            
        soup = BeautifulSoup(html, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
            tag.extract()
            
        title = soup.title.string.strip() if soup.title and soup.title.string else "Artikel Web"
        paragraphs = [p.get_text().strip() for p in soup.find_all("p") if len(p.get_text().strip()) > 30]
        content = " ".join(paragraphs[:10])
        
        return {
            "title": title,
            "content": content[:2500] if content else title
        }
    except Exception as e:
        raise ValueError(f"Gagal membaca URL: {str(e)}")
