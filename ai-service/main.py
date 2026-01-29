from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import random

app = FastAPI(title="AptiVerse AI Service")

class AttemptSummary(BaseModel):
    score: float
    topicPerformance: Dict[str, float]

class PredictRequest(BaseModel):
    userId: str
    attemptSummary: Optional[AttemptSummary]
    recentAttempts: Optional[List[Any]]

class Recommendation(BaseModel):
    type: str  # 'test', 'question', 'topic'
    id: str
    score: float
    reason: str

class PredictResponse(BaseModel):
    topicMastery: Dict[str, float]
    recommendations: List[Recommendation]
    confidence: float

@app.get("/")
def read_root():
    return {"status": "AI Service Running"}

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        # Placeholder for BKT or XGBoost logic
        # 1. Update Mastery based on attemptSummary
        mastery = {}
        if request.attemptSummary and request.attemptSummary.topicPerformance:
            for topic, score in request.attemptSummary.topicPerformance.items():
                # Simple BKT-like update: posterior = (prior * likelihood) / evidence
                # Here, we just do a weighted average for demo
                current_mastery = 0.5 # Default prior
                mastery[topic] = (current_mastery + score) / 2
        
        # 2. Generate Recommendations
        recommendations = []
        
        # Hardcoded recommendation logic for demo
        # In real app: CF or CB filtering
        
        # Find weak topics
        weak_topics = [t for t, s in mastery.items() if s < 0.6]
        for t in weak_topics:
            recommendations.append(Recommendation(
                type='topic',
                id=t,
                score=0.9,
                reason=f"Low mastery detected in {t}"
            ))
            
        if not recommendations:
            recommendations.append(Recommendation(
                type='test',
                id='practice_general',
                score=0.8,
                reason="General practice to maintain agility"
            ))

        return PredictResponse(
            topicMastery=mastery,
            recommendations=recommendations,
            confidence=0.85
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
