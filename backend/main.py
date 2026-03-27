from fastapi import FastAPI, Request, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from loan_engine import LoanEngine
import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

# New Imports for Postgres & WebSockets
from database import engine as db_engine, Base, get_db
from db_models import LoanApplication
from websocket_manager import manager as ws_manager

app = FastAPI(title="Loaner AI API", version="1.0.0")

print("Loading AI Models into memory...")
engine = LoanEngine()

class LoanApplicationSchema(BaseModel):
    borrower_name: str
    loan_amnt: float
    term: str
    emp_length: str
    home_ownership: str
    annual_inc: float
    dti: float
    open_acc: float
    revol_bal: float
    revol_util: float
    total_acc: float
    delinq_2yrs: float
    pub_rec: float
    int_rate: float
    installment: float
    grade: str
    sub_grade: str
    tot_coll_amt: float
    collections_12_mths_ex_med: float

@app.on_event("startup")
async def startup_event():
    # Automatically create tables (for dev purposes; normally use Alembic)
    async with db_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Loaner AI Backend running with Postgres"}

@app.websocket("/ws/dashboard")
async def websocket_dashboard(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection open
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

@app.post("/api/assess-loan")
async def assess_loan(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()
    print("RAW DATA RECEIVED:", data)

    # 1. Run AI Predictions
    report = engine.predict_all(data)
    
    # 2. Save everything to PostgreSQL
    try:
        db_record = LoanApplication(
             borrower_name=data.get('borrower_name', 'Unknown'),
             loan_amnt=float(data.get('loan_amnt', 0)),
             term=data.get('term', 'Unknown'),
             raw_data=data,
             ai_results=report,
             timestamp=datetime.datetime.utcnow()
        )
        db.add(db_record)
        await db.commit()
        await db.refresh(db_record)
        print(f"Successfully saved loan application to Postgres with ID: {db_record.id}")
        report["postgres_id"] = db_record.id

        # 3. Broadcast to all connected clients
        broadcast_data = {
            "id": db_record.id,
            "applicant": db_record.borrower_name,
            "category": data.get('loan_purpose', data.get('term', 'Unknown')),
            "amount": float(db_record.loan_amnt),
            "ai_score": float(report.get('credit_risk_score', 0)),
            "grade": str(report.get('loan_grade', 'N/A')),
            "status": report.get('recommendation', 'Pending')
        }
        await ws_manager.broadcast({"action": "new_loan", "data": broadcast_data})

    except Exception as e:
        print(f"Failed to save to Postgres: {e}")
        report["postgres_error"] = str(e)

    # 4. Return results to frontend
    return report

@app.get("/api/segmentation/stats")
async def get_segmentation_stats(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(LoanApplication))
        records = result.scalars().all()
        
        if not records:
            return {
                "total_customers": 0,
                "avg_credit_score": 0,
                "risk_exposure": 0,
                "ai_confidence": 0,
                "radar_data": {"income": 0, "dti": 0, "history": 0},
                "segments": {
                    "high_value": 0,
                    "standard": 0,
                    "subprime": 0,
                    "critical": 0
                }
            }
            
        total_customers = len(records)
        risk_exposure = sum(float(r.loan_amnt) for r in records)
        
        # Calculate derived metrics
        risk_scores = [float(r.ai_results.get('credit_risk_score', 0)) for r in records if r.ai_results]
        avg_risk = sum(risk_scores) / len(risk_scores) if risk_scores else 50
        
        # Map risk score (0-100) to credit score (300-850)
        avg_credit_score = int(850 - (avg_risk / 100) * 550)
        ai_confidence = round(95.0 + (len(records) * 0.01), 1)
        ai_confidence = min(ai_confidence, 99.8)
        
        # Segments
        segments = {"high_value": 0, "standard": 0, "subprime": 0, "critical": 0}
        
        # Radar averages
        total_dti = total_income = total_open_acc = 0
        
        for r in records:
            ai = r.ai_results or {}
            raw = r.raw_data or {}
            
            score = ai.get('credit_risk_score', 50)
            
            if score < 30: segments["high_value"] += 1
            elif score < 50: segments["standard"] += 1
            elif score < 75: segments["subprime"] += 1
            else: segments["critical"] += 1
                
            total_dti += float(raw.get('dti', 0))
            total_income += float(raw.get('annual_inc', 0))
            total_open_acc += float(raw.get('open_acc', 0))
            
        # Convert segments to percentages
        for k in segments:
            segments[k] = round((segments[k] / total_customers) * 100)
            
        avg_dti = total_dti / total_customers
        avg_inc = total_income / total_customers
        avg_acc = total_open_acc / total_customers
        
        # Radar normalization (0-100 scale)
        radar_income = min(100, (avg_inc / 100000) * 100)
        radar_dti = max(0, 100 - (avg_dti * 2))
        radar_history = min(100, (avg_acc / 20) * 100)
            
        return {
            "total_customers": total_customers,
            "avg_credit_score": avg_credit_score,
            "risk_exposure": risk_exposure,
            "ai_confidence": ai_confidence,
            "radar_data": {
                "income": round(radar_income), 
                "dti": round(radar_dti), 
                "history": round(radar_history)
            },
            "segments": segments
        }
    except Exception as e:
        print(f"Error fetching segmentation stats: {e}")
        return {}


@app.get("/api/portfolio/stats")
async def get_portfolio_stats(db: AsyncSession = Depends(get_db)):
    try:
        # Fetch the most recent loans
        result = await db.execute(
            select(LoanApplication).order_by(LoanApplication.timestamp.desc()).limit(100)
        )
        records = result.scalars().all()
        
        loans = []
        for l in records:
            loans.append({
                "id": l.id,
                "borrower_name": l.borrower_name,
                "loan_amnt": l.loan_amnt,
                "term": l.term,
                "ai_results": l.ai_results or {},
                "raw_data": l.raw_data or {}
            })
            
        if not loans:
            return {
                "stats": {
                    "avg_credit_score": 0,
                    "total_loan_value": 0,
                    "predicted_roi": 0,
                    "overall_risk": "N/A"
                },
                "recent_loans": []
            }

        # Calculate KPIs
        total_loan_value = sum(float(l.get('loan_amnt', 0)) for l in loans)
        
        credit_scores = [float(l.get('ai_results', {}).get('credit_risk_score', 0)) for l in loans if l.get('ai_results', {}).get('credit_risk_score', 0) > 0]
        avg_credit_score = round(sum(credit_scores) / len(credit_scores)) if credit_scores else 0
        
        rois = [float(l.get('ai_results', {}).get('roi_prediction', 0)) for l in loans if l.get('ai_results', {}).get('roi_prediction', 0) != 0]
        avg_roi = round(sum(rois) / len(rois), 2) if rois else 0
        
        reject_count = sum(1 for l in loans if l.get('ai_results', {}).get('recommendation') == "Reject")
        reject_rate = reject_count / len(loans) if loans else 0
        overall_risk = "High" if reject_rate > 0.5 else ("Medium" if reject_rate > 0.2 else "Low")

        # Format recent loans for the table (limit to 10)
        recent = loans[:10]
        formatted_recent = []
        for l in recent:
            ai = l.get('ai_results', {})
            raw = l.get('raw_data', {})
            formatted_recent.append({
                "id": l['id'],
                "applicant": l.get('borrower_name', 'Unknown'),
                "category": raw.get('loan_purpose', raw.get('term', 'Unknown')),
                "amount": float(l.get('loan_amnt', 0)),
                "ai_score": float(ai.get('credit_risk_score', 0)),
                "grade": str(ai.get('loan_grade', 'N/A')),
                "status": ai.get('recommendation', 'Pending')
            })

        return {
            "stats": {
                "avg_credit_score": avg_credit_score,
                "total_loan_value": total_loan_value,
                "predicted_roi": avg_roi,
                "overall_risk": overall_risk
            },
            "recent_loans": formatted_recent
        }

    except Exception as e:
        print(f"Error fetching stats: {e}")
        return {"error": str(e), "stats": {}, "recent_loans": []}

@app.get("/")
def home():
    return {"message": "Loan AI Backend Running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)