import joblib

model = joblib.load("models/xgboost_classifier_loan_grade_pipeline.pkl")
print(type(model))