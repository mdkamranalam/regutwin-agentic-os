from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.analyst_service import (AnalystService)

router = APIRouter()

class RequestBody(BaseModel):
    regulationId: Optional[str] = None
    text: str

@router.post("/analyze")
def analyze(req: RequestBody):

    result = (AnalystService.process(req.text))

    return {
        "regulationId": req.regulationId,
        "analysis": result
    }