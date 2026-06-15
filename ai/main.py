from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agents.analyst import analyze_regulation
from schemas.analysis import RegulationAnalysis

app = FastAPI(title="ReguTwin AI Bridge")

class AnalysisRequest(BaseModel):
    text: str

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "AI Bridge is healthy"}

@app.post("/analyze", response_model=RegulationAnalysis)
async def analyze(request: AnalysisRequest):
    try:
        result = analyze_regulation(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
