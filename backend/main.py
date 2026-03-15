from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func

from loan_engine import LoanEngine

import models
import database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Loaner AI API", version="1.0.0")

print("Loading AI Models into memory...")
engine = LoanEngine()


class LoanApplicationSchema(BaseModel):

    borrower_name: str
    loan_amnt: float = Field(..., gt=0)
    term: str
    emp_length: str
    home_ownership: str
    annual_inc: float = Field(..., gt=0)
    dti: float

    open_acc: float = 5.0
    revol_bal: float = 0.0
    revol_util: float = 0.0
    total_acc: float = 10.0

    delinq_2yrs: float = 0.0
    pub_rec: float = 0.0

    int_rate: float = 0.0
    installment: float = 0.0
    grade: str = "B"
    sub_grade: str = "B2"


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Loaner AI Backend running"}


@app.get("/api/portfolio/stats")
def get_portfolio_stats(db: Session = Depends(database.get_db)):

    total_loans = db.query(func.count(models.LoanRecord.id)).scalar() or 0

    if total_loans == 0:
        return {
            "avg_credit_score": 742,
            "total_loan_value": 0,
            "predicted_roi": 0.0,
            "overall_risk": "N/A"
        }

    total_value = db.query(func.sum(models.LoanRecord.loan_amnt)).scalar() or 0
    avg_roi = db.query(func.avg(models.LoanRecord.estimated_roi)).scalar() or 0
    avg_risk = db.query(func.avg(models.LoanRecord.risk_score)).scalar() or 0

    overall_risk = "Low" if avg_risk < 30 else "Moderate" if avg_risk < 70 else "High"

    return {
        "avg_credit_score": 742,
        "total_loan_value": total_value,
        "predicted_roi": round(avg_roi, 2),
        "overall_risk": overall_risk
    }


@app.get("/api/loans/recent")
def get_recent_loans(db: Session = Depends(database.get_db)):

    recent = db.query(models.LoanRecord)\
        .order_by(models.LoanRecord.created_at.desc())\
        .limit(5)\
        .all()

    result = []

    for r in recent:

        color = 'primary' if r.risk_score < 30 else 'orange' if r.risk_score < 70 else 'red'
        risk = "Low" if r.risk_score < 30 else "Medium" if r.risk_score < 70 else "High"

        init = "".join([n[0] for n in r.borrower_name.split()])[:2].upper()

        result.append({
            "init": init,
            "name": r.borrower_name,
            "id": f"#{r.id + 10000}",
            "type": r.home_ownership.capitalize(),
            "amt": f"${r.loan_amnt:,.0f}",
            "score": round(r.risk_score),
            "color": color,
            "grade": r.grade,
            "risk": risk,
            "status": "Approved" if r.recommendation == "Approve" else "Manual Review"
        })

    return result


@app.post("/api/assess-loan")
def assess_loan(application: LoanApplicationSchema, db: Session = Depends(database.get_db)):

    raw_data = application.dict()

    report = engine.predict_all(raw_data)

    db_record = models.LoanRecord(
        borrower_name=application.borrower_name,
        loan_amnt=application.loan_amnt,
        term=application.term,
        int_rate=report["predicted_interest_rate"],
        installment=application.installment,
        grade=report["loan_grade"],
        annual_inc=application.annual_inc,
        dti=application.dti,
        emp_length=application.emp_length,
        home_ownership=application.home_ownership,
        risk_score=report["credit_risk_score"],
        estimated_roi=report["safe_loan_score"],
        recommendation=report["recommendation"],
        flag=None
    )

    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return report


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

@app.get("/")
def home():
    return {"message": "Loan AI Backend Running"}