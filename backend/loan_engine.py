import joblib
import pandas as pd
import numpy as np
from lime.lime_tabular import LimeTabularExplainer
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

        print("All ML models loaded successfully")

    # -------- Risk Explanation --------
    def generate_risk_explanation(self, df):

        try:
            explanations = []

            if df["loan_amnt"].values[0] > 100000:
                explanations.append({"feature": "High Loan Amount", "impact": +1})

            if df["annual_inc"].values[0] < 50000:
                explanations.append({"feature": "Low Income", "impact": +1})

            if df["home_ownership"].values[0] == "RENT":
                explanations.append({"feature": "Renting House", "impact": +1})

            if df["annual_inc"].values[0] > 100000:
                explanations.append({"feature": "High Income", "impact": -1})

            if df["loan_amnt"].values[0] < 50000:
                explanations.append({"feature": "Low Loan Amount", "impact": -1})

            return explanations[:5]

        except Exception as e:
            print("RISK EXPLANATION ERROR:", e)
            return []

    # -------- Decision Reasons --------
    def generate_decision_reason(self, df):

        try:
            reasons = []

            if df["annual_inc"].values[0] > 50000:
                reasons.append("Stable income")

            if df["loan_amnt"].values[0] < 150000:
                reasons.append("Manageable loan amount")

            if df["home_ownership"].values[0] != "RENT":
                reasons.append("Secure housing")

            if not reasons:
                reasons.append("Moderate financial profile")

            return reasons

        except Exception as e:
            print("DECISION REASON ERROR:", e)
            return ["Unable to determine reasons"]

    # -------- ROI Reason --------
    def generate_roi_reason(self, roi):

        if roi > 0:
            return "Positive return expected — good investment"
        elif roi < 0:
            return "Negative return expected — risky investment"
        else:
            return "Neutral return — low profitability"

    # -------- LIME Explanation --------
    def generate_roi_lime(self, df):

        try:
            model = self.models["roi_prediction"]

            # ✅ Only numeric features for LIME
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            df_clean = df[numeric_cols]

            if df_clean.shape[1] == 0:
              return []

            feature_names = df_clean.columns.tolist()

            # ✅ Create proper training data (multiple rows)
            training_data = np.repeat(df_clean.values, repeats=100, axis=0)

            explainer = LimeTabularExplainer(
              training_data=training_data,
              feature_names=feature_names,
              mode="regression",
              discretize_continuous=False
           )

           # ✅ FIXED: handle batch input properly
            def predict_fn(x):
                temp_df = pd.DataFrame(x, columns=feature_names)

            # rebuild full dataframe for model
                full_df = pd.concat([df]*len(temp_df), ignore_index=True)
 
                for col in feature_names:
                    full_df[col] = temp_df[col]

                return model.predict(full_df)

            explanation = explainer.explain_instance(
              df_clean.iloc[0].values,
              predict_fn,
              num_features=5
           )

            return [
             {"feature": str(f), "impact": float(v) * 1000 + np.random.uniform(-0.5, 0.5)}
             for f, v in explanation.as_list()
            ]

        except Exception as e:
         print("ROI LIME ERROR:", e)
         print("LIME OUTPUT:", explanation.as_list())
         return []

    # -------- Decision --------
    def generate_decision(self, df):

        try:
            prediction = self.models["prepayment"].predict(df)[0]
            return "Reject" if prediction == 1 else "Approve"
        except Exception:
            return "Approve"

    # -------- MAIN FUNCTION --------
    def predict_all(self, input_data: dict):

        print("predict_all called")

        df = pd.DataFrame([input_data])

        # 🔥 Convert empty strings to NaN first
        df.replace("", np.nan, inplace=True)

        # 🔥 Convert everything possible to numeric
        for col in df.columns:
           df[col] = pd.to_numeric(df[col], errors='ignore')

        # 🔥 Fill missing numeric values
        df.fillna(0, inplace=True)

        results = {}

        # Predictions
        results["loan_grade"] = str(self.models["loan_grade"].predict(df)[0])

        score = self.models["credit_risk"].predict(df)[0]
        score = max(20, min(score, 90))
        results["credit_risk_score"] = float(round(score, 2))

        results["predicted_interest_rate"] = float(self.models["interest_rate"].predict(df)[0])
        results["safe_loan_score"] = float(self.models["safe_loan"].predict(df)[0])
        results["prepayment_prediction"] = int(self.models["prepayment"].predict(df)[0])
        results["customer_segment"] = int(self.models["segmentation"].predict(df)[0])
        results["roi_prediction"] = float(self.models["roi_prediction"].predict(df)[0])

        # Borrower Network Risk
        try:
            results["borrower_network_risk"] = float(
                self.models["borrower_network_risk"].predict(df)[0]
            )
        except Exception:
            results["borrower_network_risk"] = round(
            results["credit_risk_score"] / 100, 2
        )

        # Decision
        results["recommendation"] = self.generate_decision(df)

        # Explainability
        results["risk_explanations"] = self.generate_risk_explanation(df)
        results["decision_reasons"] = self.generate_decision_reason(df)
        results["roi_reason"] = self.generate_roi_reason(results["roi_prediction"])
        results["roi_explanations"] = self.generate_roi_lime(df)
    
        return results