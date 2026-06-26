"""
ReguTwin AI Service — FastAPI Application Entry Point
======================================================
This replaces the stub app.py and wires together all routes,
auto-starts the Watchman scraping loop as a background thread,
and initializes the full LangGraph workflow engine.
"""

import threading
import time
import schedule
import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import from main.py which has all the actual routes
from main import app as _core_app

# Re-export the app for uvicorn
app = _core_app

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ─── Auto-Start Watchman Background Thread ────────────────────────────────────

def _run_watchman():
    """
    Runs the Watchman autonomous monitoring in a background thread.
    - Starts filesystem watcher for the PDF uploads folder
    - Starts scheduled web scraper for RBI/SEBI portals
    """
    from agents.watchman.web_scraper import scrape_portals, start_scraping_loop
    from agents.watchman.local_watcher import LocalWatcher, PDFHandler
    from agents.watchman.watchman_agent import WatchmanAgent
    from watchdog.observers import Observer

    upload_folder = os.getenv("UPLOADS_FOLDER", "/app/uploads/regulations")
    os.makedirs(upload_folder, exist_ok=True)

    # 1. Start filesystem observer for PDF uploads
    try:
        observer = Observer()
        observer.schedule(
            PDFHandler(WatchmanAgent.process_pdf),
            upload_folder,
            recursive=False,
        )
        observer.start()
        logger.info(f"[Watchman] Filesystem observer started on {upload_folder}")
    except Exception as e:
        logger.warning(f"[Watchman] Could not start filesystem observer: {e}")

    # 2. Schedule web scraper — run immediately then every 30 minutes
    scrape_interval = int(os.getenv("SCRAPE_INTERVAL_MINUTES", "30"))
    schedule.every(scrape_interval).minutes.do(scrape_portals)

    # Initial scrape on startup (demo mode or normal)
    if os.getenv("DEMO_MODE", "false").lower() != "true":
        # Only auto-scrape in non-demo mode; demo uses seed data
        logger.info("[Watchman] Running initial regulatory portal scan...")
        try:
            scrape_portals()
        except Exception as e:
            logger.warning(f"[Watchman] Initial scrape failed (non-fatal): {e}")

    # 3. Keep the schedule running
    while True:
        schedule.run_pending()
        time.sleep(5)


@app.on_event("startup")
async def startup_event():
    """Start the Watchman monitoring loop as a daemon thread on server startup."""
    logger.info("[Startup] ReguTwin AI Service starting up...")
    logger.info(f"[Startup] LLM Provider: {os.getenv('LLM_PROVIDER', 'ollama')}")

    watchman_thread = threading.Thread(
        target=_run_watchman,
        daemon=True,
        name="WatchmanMonitor",
    )
    watchman_thread.start()
    logger.info("[Startup] Watchman autonomous monitoring thread launched.")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("[Shutdown] ReguTwin AI Service shutting down.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)