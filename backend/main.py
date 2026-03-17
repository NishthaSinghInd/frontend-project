from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from fastapi import Request
from loan_engine import LoanEngine

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Loaner AI Backend running"}


@app.post("/api/assess-loan")
async def assess_loan(request: Request):
    data = await request.json()
    print("RAW DATA RECEIVED:", data)

    report = engine.predict_all(data)
    return report


@app.get("/")
def home():
    return {"message": "Loan AI Backend Running"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)