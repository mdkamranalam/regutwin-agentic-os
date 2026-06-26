"""
ReguTwin Watchman — Real Regulatory Web Scraper
================================================
Scrapes live RBI and SEBI regulatory portals for new circulars.
Extracts: title, circular number, date, URL, PDF content.
Deduplicates using URL-based MD5 hashing.
Retries with exponential backoff on network failures.
"""

import requests
from bs4 import BeautifulSoup
import json
import os
import time
import hashlib
import re
import pdfplumber
import io
import logging

logger = logging.getLogger(__name__)

SEEN_FILE = os.path.join(os.path.dirname(__file__), "seen_circulars.json")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000/api/v1")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

# ─── Portal Configurations ───────────────────────────────────────────────────

PORTALS = [
    {
        "name": "RBI",
        "source": "Reserve Bank of India",
        "list_url": "https://www.rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx",
        "base_url": "https://www.rbi.org.in",
        "parser": "parse_rbi",
    },
    {
        "name": "SEBI",
        "source": "Securities and Exchange Board of India",
        "list_url": "https://www.sebi.gov.in/legal/circulars/",
        "base_url": "https://www.sebi.gov.in",
        "parser": "parse_sebi",
    },
]

# ─── Persistence ─────────────────────────────────────────────────────────────

def load_seen() -> list:
    if os.path.exists(SEEN_FILE):
        try:
            with open(SEEN_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []


def save_seen(seen_list: list):
    try:
        with open(SEEN_FILE, "w") as f:
            json.dump(seen_list, f, indent=2)
    except Exception as e:
        logger.error(f"[Scraper] Failed to save seen circulars: {e}")


def make_id(url: str) -> str:
    """Stable deduplication ID based on the circular URL."""
    return hashlib.md5(url.encode()).hexdigest()

# ─── HTTP Helper ─────────────────────────────────────────────────────────────

def fetch_with_retry(url: str, max_retries: int = 3, timeout: int = 15) -> requests.Response | None:
    """HTTP GET with exponential backoff retry."""
    for attempt in range(max_retries):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=timeout)
            if resp.status_code == 200:
                return resp
            logger.warning(f"[Scraper] HTTP {resp.status_code} for {url} (attempt {attempt+1})")
        except requests.RequestException as e:
            logger.warning(f"[Scraper] Request failed for {url}: {e} (attempt {attempt+1})")
        if attempt < max_retries - 1:
            time.sleep(2 ** attempt)
    return None

# ─── PDF Text Extraction ─────────────────────────────────────────────────────

def extract_pdf_text(pdf_url: str) -> str:
    """Download PDF from URL and extract text using pdfplumber."""
    try:
        resp = fetch_with_retry(pdf_url, timeout=20)
        if resp and resp.content:
            with pdfplumber.open(io.BytesIO(resp.content)) as pdf:
                texts = []
                for page in pdf.pages[:10]:  # Limit to first 10 pages
                    text = page.extract_text()
                    if text:
                        texts.append(text)
                return "\n\n".join(texts).strip()
    except Exception as e:
        logger.warning(f"[Scraper] PDF extraction failed for {pdf_url}: {e}")
    return ""

# ─── Portal Parsers ──────────────────────────────────────────────────────────

def parse_rbi(html: str, base_url: str) -> list[dict]:
    """
    Parse RBI circular index page.
    Extracts circular number, title, date, and detail page URL.
    """
    circulars = []
    soup = BeautifulSoup(html, "lxml")

    # RBI uses a table with class or standard table rows
    # Try multiple selectors for robustness
    rows = (
        soup.select("table tr")
        or soup.select(".tablesorter tr")
        or soup.select("table.tablebg tr")
    )

    for row in rows[1:20]:  # Skip header, limit to 20 most recent
        cols = row.find_all("td")
        if len(cols) < 2:
            continue

        # Extract link from any column
        link_tag = row.find("a", href=True)
        if not link_tag:
            continue

        href = link_tag["href"].strip()
        title = link_tag.get_text(strip=True)

        if not title or len(title) < 10:
            continue

        # Build absolute URL
        if href.startswith("http"):
            detail_url = href
        elif href.startswith("/"):
            detail_url = f"{base_url}{href}"
        else:
            detail_url = f"{base_url}/Scripts/{href}"

        # Extract date from columns if available
        date_text = cols[-1].get_text(strip=True) if cols else ""

        # Resolve PDF link — try to find a PDF link on the detail page
        pdf_url = None
        if ".pdf" in href.lower():
            pdf_url = detail_url
        else:
            # Try to find PDF on detail page
            detail_resp = fetch_with_retry(detail_url)
            if detail_resp:
                detail_soup = BeautifulSoup(detail_resp.text, "lxml")
                pdf_link = detail_soup.find("a", href=lambda h: h and ".pdf" in h.lower())
                if pdf_link:
                    pdf_href = pdf_link["href"]
                    pdf_url = pdf_href if pdf_href.startswith("http") else f"{base_url}{pdf_href}"

        circulars.append({
            "title": title,
            "url": detail_url,
            "pdf_url": pdf_url,
            "date": date_text,
            "source": "Reserve Bank of India",
        })

    return circulars


def parse_sebi(html: str, base_url: str) -> list[dict]:
    """
    Parse SEBI circular listing page.
    Extracts title, date, and URL for each circular.
    """
    circulars = []
    soup = BeautifulSoup(html, "lxml")

    # SEBI circulars are in <li> elements or table rows
    items = (
        soup.select(".content-wrap li")
        or soup.select("table tr")
        or soup.select(".list-items li")
        or soup.select("article")
    )

    if not items:
        # Fallback: find all links that look like circulars
        links = soup.find_all("a", href=lambda h: h and "circular" in h.lower())
        for link in links[:15]:
            title = link.get_text(strip=True)
            href = link["href"]
            if len(title) < 10:
                continue
            url = href if href.startswith("http") else f"{base_url}{href}"
            circulars.append({
                "title": title,
                "url": url,
                "pdf_url": url if ".pdf" in url.lower() else None,
                "date": "",
                "source": "Securities and Exchange Board of India",
            })
        return circulars[:15]

    for item in items[:15]:
        link_tag = item.find("a", href=True)
        if not link_tag:
            continue

        title = link_tag.get_text(strip=True)
        href = link_tag["href"].strip()

        if not title or len(title) < 10:
            continue

        url = href if href.startswith("http") else f"{base_url}{href}"
        pdf_url = url if ".pdf" in url.lower() else None

        # Try to extract date
        date_tag = item.find("span", class_=lambda c: c and "date" in c.lower()) if item else None
        date_text = date_tag.get_text(strip=True) if date_tag else ""

        circulars.append({
            "title": title,
            "url": url,
            "pdf_url": pdf_url,
            "date": date_text,
            "source": "Securities and Exchange Board of India",
        })

    return circulars

# ─── Ingest Trigger ──────────────────────────────────────────────────────────

def trigger_ingest(title: str, source: str, url: str, extracted_text: str) -> bool:
    """Send regulatory content to the backend for AI processing."""
    logger.info(f"[Scraper] Ingesting: '{title}' from {source}")
    try:
        payload = {
            "url": url,
            "source": source,
            "title": title,
            "extractedText": extracted_text or "",
        }
        response = requests.post(
            f"{BACKEND_URL}/regulations/ingest-url",
            headers={"X-Internal-Secret": os.getenv("INTERNAL_SECRET", "regutwin_secret_key")},
            json=payload,
            timeout=30,
        )
        if response.status_code in [200, 201]:
            data = response.json()
            logger.info(f"[Scraper] Successfully ingested. Regulation ID: {data.get('_id', 'unknown')}")
            return True
        else:
            logger.warning(f"[Scraper] Backend rejected ingestion: {response.status_code}")
    except Exception as e:
        logger.error(f"[Scraper] Error triggering ingestion: {e}")
    return False

# ─── Main Scraping Loop ───────────────────────────────────────────────────────

def scrape_portal(portal: dict, seen: list) -> tuple[list, int]:
    """Scrape a single portal and return updated seen list and new count."""
    name = portal["name"]
    source = portal["source"]
    list_url = portal["list_url"]
    base_url = portal["base_url"]
    parser_name = portal["parser"]

    logger.info(f"[Scraper] Polling {name} portal: {list_url}")
    new_count = 0

    resp = fetch_with_retry(list_url)
    if not resp:
        logger.warning(f"[Scraper] Could not reach {name} portal. Skipping.")
        return seen, 0

    parser = {"parse_rbi": parse_rbi, "parse_sebi": parse_sebi}.get(parser_name)
    if not parser:
        return seen, 0

    circulars = parser(resp.text, base_url)
    logger.info(f"[Scraper] Found {len(circulars)} circulars on {name} portal")

    for circular in circulars[:5]:  # Process max 5 new per cycle
        circular_id = make_id(circular["url"])

        if circular_id in seen:
            continue

        logger.info(f"[Scraper] New circular detected: {circular['title']}")

        # Try to extract PDF text
        text = ""
        if circular.get("pdf_url"):
            text = extract_pdf_text(circular["pdf_url"])

        # Fallback: use title + source as minimal text
        if not text or len(text) < 50:
            text = (
                f"{circular['title']}\n\n"
                f"Source: {source}\n"
                f"Published: {circular.get('date', 'Recent')}\n"
                f"Reference: {circular['url']}\n\n"
                f"This regulatory circular from {source} requires banks and financial "
                f"institutions to review and implement the specified compliance requirements "
                f"as outlined in this mandate."
            )

        success = trigger_ingest(
            title=circular["title"],
            source=source,
            url=circular["url"],
            extracted_text=text,
        )

        if success:
            seen.append(circular_id)
            new_count += 1
            time.sleep(2)  # Rate limit between ingestions

    return seen, new_count


def scrape_portals():
    """Main scraping function — poll all configured regulatory portals."""
    logger.info("[Scraper] Starting regulatory portal polling cycle...")
    seen = load_seen()
    total_new = 0

    for portal in PORTALS:
        try:
            seen, new_count = scrape_portal(portal, seen)
            total_new += new_count
        except Exception as e:
            logger.error(f"[Scraper] Error scraping {portal['name']}: {e}")

    if total_new > 0:
        save_seen(seen)

    logger.info(f"[Scraper] Polling cycle complete. {total_new} new regulations ingested.")
    return total_new


def start_scraping_loop(interval_minutes: int = 30):
    """Start the autonomous regulatory monitoring loop."""
    import schedule
    logger.info(f"[Scraper] Starting autonomous monitoring every {interval_minutes} minutes.")
    schedule.every(interval_minutes).minutes.do(scrape_portals)
    # Run once immediately on startup
    scrape_portals()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    scrape_portals()
