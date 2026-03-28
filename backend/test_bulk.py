import pandas as pd
import requests
import json

print("Reading dummy CSV...")
df = pd.read_csv(r"d:\Coding\Projects\Loaner Frontend\dummy_applicants.csv")

print(f"Found {len(df)} applicants. Running Bulk Assessment against FastAPI...")
url = "http://127.0.0.1:8000/api/assess-loan"

for index, row in df.iterrows():
    # Convert numpy types to native Python types for JSON
    payload = row.to_dict()
    
    try:
        response = requests.post(url, json=payload)
        res = response.json()
        name = payload.get("borrower_name", "Unknown")
        score = res.get("credit_risk_score", 0)
        decision = res.get("recommendation", "Unknown")
        roi = res.get("roi_prediction", 0)
        
        print(f"[{name}] -> Score: {score:.1f} | Decision: {decision} | Expected ROI: {roi:.2f}%")
    except Exception as e:
        print(f"Failed on {payload.get('borrower_name')}: {e}")

print("Bulk Pipeline Test Complete!")
