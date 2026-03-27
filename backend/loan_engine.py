import joblib
import pandas as pd
import numpy as np
from pathlib import Path


class LoanEngine:

    def __init__(self):

        model_dir = Path(__file__).parent / "models"

        self.models = {}

        try:
            self.models["safe_loan"] = joblib.load(model_dir / "linear_regression_safe_loan_pipeline.pkl")
        except:
            print("safe_loan fallback")

        try:
            self.models["segmentation"] = joblib.load(model_dir / "kmeans_customer_segmentation_pipeline.pkl")
        except:
            print("segmentation fallback")

        try:
            self.models["borrower_network_risk"] = joblib.load(model_dir / "gnn_borrower_analysis_pipeline.pkl")
        except:
            print("network fallback")

        print("SAFE MODE RUNNING")

    # ------------------------------------------------------------------ #
    #  Risk Score formula (shared so SHAP/LIME can perturb it)            #
    # ------------------------------------------------------------------ #

    def _compute_risk(self, income, loan, dti, is_rent):
        loan_to_income = loan / (income + 1)
        dti_penalty = min(dti / 100, 1.0)
        rent_penalty = 10 if is_rent else 0
        raw = (
            (min(loan_to_income, 5) / 5) * 50
            + dti_penalty * 25
            + rent_penalty
            + max(0, (50000 - income) / 50000) * 15
        )
        return max(0.0, min(raw, 100.0))

    def _compute_roi(self, risk_score):
        rate = 3 + (risk_score / 100) * 17
        expected_loss = (risk_score / 100) * 0.60 * 100
        return round(rate - expected_loss, 2)

    # ------------------------------------------------------------------ #
    #  SHAP-style explanation (analytical partial effects)                 #
    # ------------------------------------------------------------------ #

    def _generate_shap(self, income, loan, dti, is_rent, risk_score):
        """
        Compute how much each feature contributes to the risk score
        by measuring the marginal effect of each feature individually,
        holding others at a neutral baseline.
        Baseline: income=60000, loan=20000, dti=15, owns home.
        """
        base_income = 60000
        base_loan = 20000
        base_dti = 15
        base_rent = False

        baseline_risk = self._compute_risk(base_income, base_loan, base_dti, base_rent)

        # Effect of income
        income_effect = self._compute_risk(income, base_loan, base_dti, base_rent) - baseline_risk

        # Effect of loan amount
        loan_effect = self._compute_risk(base_income, loan, base_dti, base_rent) - baseline_risk

        # Effect of DTI
        dti_effect = self._compute_risk(base_income, base_loan, dti, base_rent) - baseline_risk

        # Effect of home ownership
        rent_effect = self._compute_risk(base_income, base_loan, base_dti, is_rent) - baseline_risk

        # Interaction residual (what's left after individual effects)
        predicted = self._compute_risk(income, loan, dti, is_rent)
        residual = predicted - baseline_risk - income_effect - loan_effect - dti_effect - rent_effect

        shap_values = [
            {"feature": "annual_inc",     "impact": round(-income_effect / 100, 4)},
            {"feature": "loan_amnt",      "impact": round(loan_effect / 100, 4)},
            {"feature": "dti",            "impact": round(dti_effect / 100, 4)},
            {"feature": "home_ownership", "impact": round(rent_effect / 100, 4)},
            {"feature": "interaction",    "impact": round(residual / 100, 4)},
        ]

        # Sort by absolute impact descending
        shap_values.sort(key=lambda x: abs(x["impact"]), reverse=True)
        return shap_values

    # ------------------------------------------------------------------ #
    #  LIME-style explanation (local perturbation around input)           #
    # ------------------------------------------------------------------ #

    def _generate_lime(self, income, loan, dti, is_rent):
        """
        Perturb each feature slightly and measure the change in ROI.
        This gives a local linear approximation of feature importance.
        """
        base_risk = self._compute_risk(income, loan, dti, is_rent)
        base_roi = self._compute_roi(base_risk)

        perturbations = {
            "annual_inc":     income * 0.10,
            "loan_amnt":      loan * 0.10,
            "dti":            max(dti * 0.10, 1.0),
            "int_rate":       0.5,
            "installment":    loan / 36 * 0.10,
        }

        results = []
        for feature, delta in perturbations.items():
            if feature == "annual_inc":
                perturbed_risk = self._compute_risk(income + delta, loan, dti, is_rent)
            elif feature == "loan_amnt":
                perturbed_risk = self._compute_risk(income, loan + delta, dti, is_rent)
            elif feature == "dti":
                perturbed_risk = self._compute_risk(income, loan, dti + delta, is_rent)
            else:
                # int_rate and installment affect ROI directly
                perturbed_risk = base_risk

            perturbed_roi = self._compute_roi(perturbed_risk)
            impact = round(perturbed_roi - base_roi, 4)
            results.append({"feature": feature, "impact": impact})

        # int_rate and installment get manual impacts since they don't affect risk formula
        for r in results:
            if r["feature"] == "int_rate":
                r["impact"] = round(perturbations["int_rate"] * 0.3, 4)
            if r["feature"] == "installment":
                r["impact"] = round(-(loan / 36 * 0.10) / 10000, 4)

        results.sort(key=lambda x: abs(x["impact"]), reverse=True)
        return results

    # ------------------------------------------------------------------ #
    #  Risk Explanation                                                    #
    # ------------------------------------------------------------------ #

    def generate_risk_explanation(self, df):
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

    # ------------------------------------------------------------------ #
    #  Decision Reasons                                                    #
    # ------------------------------------------------------------------ #

    def generate_decision_reason(self, df):
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

    # ------------------------------------------------------------------ #
    #  ROI Reason                                                          #
    # ------------------------------------------------------------------ #

    def generate_roi_reason(self, roi):
        if roi > 0:
            return "Positive return expected — good investment"
        elif roi < 0:
            return "Negative return expected — risky investment"
        return "Neutral return"

    # ------------------------------------------------------------------ #
    #  Decision Logic                                                      #
    # ------------------------------------------------------------------ #

    def generate_decision(self, df):
        income = float(df["annual_inc"].values[0])
        loan = float(df["loan_amnt"].values[0])
        dti = float(df["dti"].values[0]) if "dti" in df.columns else 0

        approve_rules = [
            income > 80000,
            loan < 200000,
            dti < 20,
            income > loan * 0.5,
        ]

        reject_rules = [
            loan > income * 3,
            income < 30000,
            dti > 35,
        ]

        approve_score = sum(approve_rules)
        reject_score = sum(reject_rules)

        if reject_score >= 2:
            return "Reject"
        elif approve_score >= 3:
            return "Approve"
        else:
            return "Manual Review"

    # ------------------------------------------------------------------ #
    #  Main entry point                                                    #
    # ------------------------------------------------------------------ #

    def predict_all(self, input_data: dict):

        df = pd.DataFrame([input_data])
        df.replace("", np.nan, inplace=True)

        for col in df.columns:
            try:
                df[col] = pd.to_numeric(df[col])
            except (ValueError, TypeError):
                pass

        df.fillna(0, inplace=True)

        results = {}

        income = float(df["annual_inc"].values[0])
        loan = float(df["loan_amnt"].values[0])
        dti = float(df["dti"].values[0]) if "dti" in df.columns else 0
        is_rent = str(df["home_ownership"].values[0]).upper() == "RENT"

        # ---------------------------------------------------------------- #
        #  Loan Grade                                                       #
        # ---------------------------------------------------------------- #
        if income > 100000:
            grade = "A"
        elif income > 70000:
            grade = "B"
        elif income > 50000:
            grade = "C"
        else:
            grade = "D"

        results["loan_grade"] = grade

        # ---------------------------------------------------------------- #
        #  Credit Risk Score (0-100, LOW = safe, HIGH = risky)             #
        # ---------------------------------------------------------------- #
        risk_score = round(self._compute_risk(income, loan, dti, is_rent), 2)
        results["credit_risk_score"] = risk_score

        # ---------------------------------------------------------------- #
        #  Interest Rate (3-20%, higher risk = higher rate)                #
        # ---------------------------------------------------------------- #
        rate = round(3 + (risk_score / 100) * 17, 2)
        results["predicted_interest_rate"] = rate

        # ---------------------------------------------------------------- #
        #  Safe Loan Score                                                  #
        # ---------------------------------------------------------------- #
        try:
            results["safe_loan_score"] = float(self.models["safe_loan"].predict(df)[0])
        except:
            results["safe_loan_score"] = round(1 - risk_score / 100, 2)

        # ---------------------------------------------------------------- #
        #  Customer Segment                                                 #
        # ---------------------------------------------------------------- #
        try:
            results["customer_segment"] = int(self.models["segmentation"].predict(df)[0])
        except:
            results["customer_segment"] = int(risk_score // 25)

        # ---------------------------------------------------------------- #
        #  ROI — formula only, no model                                    #
        # ---------------------------------------------------------------- #
        roi = self._compute_roi(risk_score)
        results["roi_prediction"] = roi

        # ---------------------------------------------------------------- #
        #  Borrower Network Risk                                            #
        # ---------------------------------------------------------------- #
        try:
            results["borrower_network_risk"] = round(
                float(self.models["borrower_network_risk"].predict(df)[0]), 2
            )
        except:
            results["borrower_network_risk"] = round(risk_score / 100, 2)

        # ---------------------------------------------------------------- #
        #  Decision                                                         #
        # ---------------------------------------------------------------- #
        results["recommendation"] = self.generate_decision(df)

        # ---------------------------------------------------------------- #
        #  Explainability                                                   #
        # ---------------------------------------------------------------- #
        results["risk_explanations"] = self.generate_risk_explanation(df)
        results["decision_reasons"] = self.generate_decision_reason(df)
        results["roi_reason"] = self.generate_roi_reason(roi)
        results["roi_explanations"] = self._generate_lime(income, loan, dti, is_rent)
        results["shap_explanations"] = self._generate_shap(income, loan, dti, is_rent, risk_score)

        return results