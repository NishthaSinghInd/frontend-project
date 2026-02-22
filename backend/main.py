from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Loaner AI API", version="1.0.0")

# Configure CORS for local development with Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Loaner AI Backend is running"}

@app.get("/api/portfolio/stats")
def get_portfolio_stats():
    """Mock endpoint serving the main dashboard stats"""
    return {
        "avg_credit_score": 742,
        "total_loan_value": 12400000,
        "predicted_roi": 8.42,
        "overall_risk": "Moderate"
    }

@app.get("/api/risk-models")
def get_risk_models():
    """Mock endpoint serving risk model status"""
    return [
       {"id": "prepayment", "name": "Prepayment Model", "accuracy": 94.2, "status": "STABLE"},
       {"id": "safe-loan", "name": "Safe Loan Model", "accuracy": 96.8, "status": "OPTIMIZED"},
       {"id": "credit-risk", "name": "Credit Risk Model", "accuracy": 89.4, "status": "RECALIBRATING"}
    ]

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
