import joblib
import pandas as pd
from pathlib import Path


class LoanEngine:

    def __init__(self):

        model_dir = Path(__file__).parent / "models"

        self.models = {
            "loan_grade": joblib.load(model_dir / "xgboost_classifier_loan_grade_pipeline.pkl"),
            "credit_risk": joblib.load(model_dir / "xgboost_regressor_credit_risk_pipeline.pkl"),
            "interest_rate": joblib.load(model_dir / "xgboost_regressor_interest_rate_pipeline.pkl"),
            "prepayment": joblib.load(model_dir / "gradient_boosting_classifier_prepayment_pipeline.pkl"),
            "safe_loan": joblib.load(model_dir / "linear_regression_safe_loan_pipeline.pkl"),
            "segmentation": joblib.load(model_dir / "kmeans_customer_segmentation_pipeline.pkl"),
            "roi_prediction": joblib.load(model_dir / "random_forest_regressor_roi_pipeline.pkl"),
            "borrower_network_risk": joblib.load(model_dir / "gnn_borrower_analysis_pipeline.pkl")
        }

        print("✅ All ML models loaded successfully")

    # -------- Risk Driver Generator --------
    def generate_risk_drivers(self, data):

        drivers = []

        if data["dti"] > 20:
            drivers.append({"feature": "Debt-To-Income", "impact": 0.35})

        if data["revol_util"] > 50:
            drivers.append({"feature": "Credit Utilization", "impact": 0.30})

        if data["annual_inc"] < 50000:
            drivers.append({"feature": "Low Income", "impact": 0.25})

        if data["loan_amnt"] > 20000:
            drivers.append({"feature": "Large Loan Amount", "impact": 0.20})

        if data["delinq_2yrs"] > 0:
            drivers.append({"feature": "Recent Delinquencies", "impact": 0.28})

        if len(drivers) == 0:
            drivers.append({"feature": "Stable Financial Profile", "impact": -0.15})

        return drivers[:3]

    # -------- Human Explanations --------
    def human_explanations(self, drivers):

        explanations = []

        for d in drivers:

            if d["impact"] > 0:
                explanations.append(f"{d['feature']} increases loan risk")
            else:
                explanations.append(f"{d['feature']} lowers loan risk")

        return explanations

    # -------- Main Prediction --------
    def predict_all(self, input_data: dict):

        df = pd.DataFrame([input_data])

        if "tot_coll_amt" not in df.columns:
            df["tot_coll_amt"] = 0

        if "collections_12_mths_ex_med" not in df.columns:
            df["collections_12_mths_ex_med"] = 0

        results = {}

        results["loan_grade"] = str(self.models["loan_grade"].predict(df)[0])
        results["credit_risk_score"] = float(self.models["credit_risk"].predict(df)[0])
        results["predicted_interest_rate"] = float(self.models["interest_rate"].predict(df)[0])
        results["safe_loan_score"] = float(self.models["safe_loan"].predict(df)[0])
        results["prepayment_prediction"] = int(self.models["prepayment"].predict(df)[0])
        results["customer_segment"] = int(self.models["segmentation"].predict(df)[0])
        results["roi_prediction"] = float(self.models["roi_prediction"].predict(df)[0])
        gnn_model = self.models["borrower_network_risk"]
        if isinstance(gnn_model, dict):
            results["borrower_network_risk"] = float(gnn_model.get("risk_score", 0.5))
        else:
            results["borrower_network_risk"] = float(gnn_model.predict(df)[0])

        # decision logic
        if results["credit_risk_score"] > 0.7:
            decision = "Reject"
        elif results["credit_risk_score"] > 0.4:
            decision = "Manual Review"
        else:
            decision = "Approve"

        results["recommendation"] = decision

        # risk drivers
        drivers = self.generate_risk_drivers(input_data)

        results["shap_explanations"] = drivers
        results["lime_explanations"] = drivers
        results["human_explanations"] = self.human_explanations(drivers)

        return results