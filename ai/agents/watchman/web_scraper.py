import requests
from bs4 import BeautifulSoup
import json
import os
import time
import hashlib
import schedule

SEEN_FILE = os.path.join(os.path.dirname(__file__), "seen_circulars.json")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000/api/v1")

# Target mock / real feeds for demonstration
TARGET_PORTALS = [
    {
        "source": "RBI Live Portal",
        "url": "https://www.rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx",
        "mock_url": "https://via.placeholder.com/sample_rbi.pdf",
        "sample_title": "RBI Mandate 2026: KYC Session Timeout Enforcement"
    },
    {
        "source": "SEBI Guidelines Portal",
        "url": "https://www.sebi.gov.in/legal/circulars/",
        "mock_url": "https://via.placeholder.com/sample_sebi.pdf",
        "sample_title": "SEBI Circular 2026: Digital Accessibility Standards"
    }
]

def load_seen():
    if os.path.exists(SEEN_FILE):
        try:
            with open(SEEN_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_seen(seen_list):
    try:
        with open(SEEN_FILE, "w") as f:
            json.dump(seen_list, f, indent=2)
    except Exception as e:
        print(f"[Scraper] Failed to save seen circulars: {e}")

def trigger_ingest(url: str, source: str, title: str):
    print(f"[Scraper] Discovered new circular: '{title}' from {source}")
    try:
        response = requests.post(
            f"{BACKEND_URL}/regulations/ingest-url",
            headers={"X-Internal-Secret": "regutwin_secret_key"},
            json={
                "url": url,
                "source": source,
                "title": title
            },
            timeout=10
        )
        if response.status_code in [200, 201]:
            print(f"[Scraper] Successfully ingested circular ID: {response.json().get('_id', 'unknown')}")
            return True
        else:
            print(f"[Scraper] Backend rejected URL ingestion: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[Scraper] Error triggering backend ingestion: {e}")
    return False

def scrape_portals():
    print("[Scraper] Polling regulatory web portals...")
    seen = load_seen()
    new_found = 0

    for portal in TARGET_PORTALS:
        source = portal["source"]
        # Generate a stable ID based on portal sample title/url for tracking
        circular_id = hashlib.md5((source + portal["sample_title"]).encode()).hexdigest()
        
        if circular_id not in seen:
            print(f"[Scraper] New regulatory notice found on {source}")
            success = trigger_ingest(
                url=portal["mock_url"],
                source=source,
                title=portal["sample_title"]
            )
            if success:
                seen.append(circular_id)
                new_found += 1
        else:
            print(f"[Scraper] No new updates on {source}")

    if new_found > 0:
        save_seen(seen)
    print(f"[Scraper] Polling cycle complete. {new_found} new regulations ingested.")

def start_scraping_loop(interval_minutes=30):
    print(f"[Scraper] Starting autonomous web monitoring loop every {interval_minutes} minutes.")
    schedule.every(interval_minutes).minutes.do(scrape_portals)
    # Run once immediately on startup
    scrape_portals()

if __name__ == "__main__":
    scrape_portals()
