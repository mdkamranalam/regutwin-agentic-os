import time
import schedule
from agents.watchman.local_watcher import LocalWatcher, PDFHandler
from watchdog.observers import Observer
from agents.watchman.watchman_agent import WatchmanAgent
from agents.watchman.web_scraper import scrape_portals

print("Starting Watchman Autonomous Monitoring Service (Filesystem + Live Web Scraper)...")

# Setup filesystem observer
observer = Observer()
folder = "../backend/src/uploads/regulations"
observer.schedule(PDFHandler(WatchmanAgent.process_pdf), folder, recursive=False)
observer.start()
print(f"[Watchman] Filesystem observer watching {folder}")

# Setup live web scraper schedule (every 30 mins)
schedule.every(30).minutes.do(scrape_portals)
# Trigger initial web scrape on startup
scrape_portals()

try:
    while True:
        schedule.run_pending()
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()

observer.join()