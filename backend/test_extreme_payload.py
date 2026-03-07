import pandas as pd
from loan_engine import LoanAssessmentEngine

engine = LoanAssessmentEngine()

payload = {
    "loan_amnt": 500000,
    "term": " 60 months",
    "int_rate": 10.5,
    "installment": 325.0,
    "grade": "G",
    "sub_grade": "G1", # The frontend sends B3 default unless sub_grade is updated, wait frontend doesn't have sub_grade dropdown!
    "emp_length": "10+ years",
    "home_ownership": "MORTGAGE",
    "annual_inc": 1000,
    "dti": 50.0,
    "delinq_2yrs": 0,
    "pub_rec": 0,
    "collections_12_mths_ex_med": 0,
    "tot_coll_amt": 0,
    "open_acc": 10,
    "total_acc": 1,
    "revol_bal": 222,
    "revol_util": 45.0
}

# Add what the frontend actually sent (Frontend defaults to B3 subgrade since there's no input for it!)
payload["sub_grade"] = "B3"

print("--- Testing Extreme Payload ---")
report = engine.get_full_report(payload)
print(report)

print("--- Testing Extreme Payload with Corrected Logic ---")
payload["installment"] = payload["loan_amnt"] * (20/100/12) / (1 - (1 + 20/100/12)**-60)
print(f"Realistic Installment: {payload['installment']}")
print(engine.get_full_report(payload))
