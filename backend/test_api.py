import requests

url = "http://127.0.0.1:8000/api/assess-loan"
payload = {
    "loan_amnt": 10000,
    "term": " 36 months",
    "int_rate": 10.5,
    "installment": 325.0,
    "grade": "B",
    "sub_grade": "B3",
    "emp_length": "10+ years",
    "home_ownership": "MORTGAGE",
    "annual_inc": 65000,
    "dti": 15.0,
    "delinq_2yrs": 0,
    "pub_rec": 0,
    "collections_12_mths_ex_med": 0,
    "tot_coll_amt": 0,
    "open_acc": 8,
    "total_acc": 15,
    "revol_bal": 12000,
    "revol_util": 45.0
}

print("Testing direct POST...")
response = requests.post(url, json=payload)
print(f"Status Code: {response.status_code}")
print("Response text:")
print(response.text)
