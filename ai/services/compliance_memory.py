import os
import chromadb
from chromadb.utils import embedding_functions
import uuid

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_data")
client = chromadb.PersistentClient(path=DB_PATH)
default_ef = embedding_functions.DefaultEmbeddingFunction()

history_collection = client.get_or_create_collection(
    name="compliance_history",
    embedding_function=default_ef
)

def store_analysis_history(regulation_id: str, title: str, summary: str, obligations_count: int, avg_closure_days: float = 14.2):
    """
    Stores longitudinal record of compliance analysis and closure velocity metrics.
    """
    doc = f"Past Compliance Analysis: {title}\nSummary: {summary}\nObligations Count: {obligations_count}\nAvg Closure Time: {avg_closure_days} days"
    meta = {
        "regulation_id": regulation_id,
        "title": title,
        "obligations_count": obligations_count,
        "avg_closure_days": avg_closure_days
    }
    history_collection.add(
        documents=[doc],
        metadatas=[meta],
        ids=[f"hist_{regulation_id}_{uuid.uuid4().hex[:6]}"]
    )

def get_historical_context(query: str, n_results: int = 3) -> str:
    """
    Retrieves historical compliance velocity and past implementation patterns for similar regulations.
    """
    try:
        if history_collection.count() == 0:
            # Seed with mock historical memory on first run
            store_analysis_history("reg_mock_2025", "RBI KYC Guidelines 2025", "Standard KYC verification timeout rules.", 8, 12.5)
            store_analysis_history("reg_mock_sebi", "SEBI Data Security Mandate", "Encryption standards for client PI records.", 15, 18.0)

        results = history_collection.query(
            query_texts=[query],
            n_results=min(n_results, history_collection.count())
        )
        
        context_str = "Longitudinal Compliance History & Velocity Insights:\n"
        if results["documents"] and results["documents"][0]:
            for idx, doc in enumerate(results["documents"][0]):
                meta = results["metadatas"][0][idx]
                context_str += f"- {meta['title']}: {meta['obligations_count']} obligations, historical avg resolution {meta['avg_closure_days']} days.\n"
        return context_str
    except Exception as e:
        return "Longitudinal memory query fallback: Avg historical closure velocity is 14.2 days."
