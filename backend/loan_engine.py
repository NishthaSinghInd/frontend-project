import joblib
import pandas as pd
import numpy as np
import warnings

# Suppress the version warnings so they don't clutter your terminal
warnings.filterwarnings("ignore", category=UserWarning)

class LoanAssessmentEngine:
    def __init__(self):
        import os
        model_dir = r"d:\Coding\Projects\models"
        # Load all your models
        self.models = {
            'risk': joblib.load(os.path.join(model_dir, 'xgboost_regressor_credit_risk_model.pkl')),
            'gb_classifier': joblib.load(os.path.join(model_dir, 'gradient_boosting_classifier_prepayment_model.pkl')),
            'roi': joblib.load(os.path.join(model_dir, 'random_forest_regressor_roi_model (1).pkl')),
            'interest': joblib.load(os.path.join(model_dir, 'xgboost_regressor_interest_rate_model.pkl'))
        }
        
        # Exact feature lists from your inspection output
        self.features_risk = ['loan_amnt', 'annual_inc', 'dti', 'revol_bal', 'revol_util', 'total_acc', 'delinq_2yrs', 'collections_12_mths_ex_med', 'tot_coll_amt', 'term__60_months', 'grade_B', 'grade_C', 'grade_D', 'grade_E', 'grade_F', 'grade_G', 'sub_grade_A2', 'sub_grade_A3', 'sub_grade_A4', 'sub_grade_A5', 'sub_grade_B1', 'sub_grade_B2', 'sub_grade_B3', 'sub_grade_B4', 'sub_grade_B5', 'sub_grade_C1', 'sub_grade_C2', 'sub_grade_C3', 'sub_grade_C4', 'sub_grade_C5', 'sub_grade_D1', 'sub_grade_D2', 'sub_grade_D3', 'sub_grade_D4', 'sub_grade_D5', 'sub_grade_E1', 'sub_grade_E2', 'sub_grade_E3', 'sub_grade_E4', 'sub_grade_E5', 'sub_grade_F1', 'sub_grade_F2', 'sub_grade_F3', 'sub_grade_F4', 'sub_grade_F5', 'sub_grade_G1', 'sub_grade_G2', 'sub_grade_G3', 'sub_grade_G4', 'sub_grade_G5', 'emp_length_10__years', 'emp_length_2_years', 'emp_length_3_years', 'emp_length_4_years', 'emp_length_5_years', 'emp_length_6_years', 'emp_length_7_years', 'emp_length_8_years', 'emp_length_9_years', 'emp_length___1_year', 'home_ownership_MORTGAGE', 'home_ownership_OWN', 'home_ownership_RENT']
        
        self.features_roi = ['loan_amnt', 'int_rate', 'installment', 'annual_inc', 'dti', 'open_acc', 'revol_bal', 'revol_util', 'total_acc', 'delinq_2yrs', 'pub_rec', 'term_60months', 'grade_B', 'grade_C', 'grade_D', 'grade_E', 'grade_F', 'grade_G', 'sub_grade_A2', 'sub_grade_A3', 'sub_grade_A4', 'sub_grade_A5', 'sub_grade_B1', 'sub_grade_B2', 'sub_grade_B3', 'sub_grade_B4', 'sub_grade_B5', 'sub_grade_C1', 'sub_grade_C2', 'sub_grade_C3', 'sub_grade_C4', 'sub_grade_C5', 'sub_grade_D1', 'sub_grade_D2', 'sub_grade_D3', 'sub_grade_D4', 'sub_grade_D5', 'sub_grade_E1', 'sub_grade_E2', 'sub_grade_E3', 'sub_grade_E4', 'sub_grade_E5', 'sub_grade_F1', 'sub_grade_F2', 'sub_grade_F3', 'sub_grade_F4', 'sub_grade_F5', 'sub_grade_G1', 'sub_grade_G2', 'sub_grade_G3', 'sub_grade_G4', 'sub_grade_G5', 'emp_length_10years', 'emp_length_2years', 'emp_length_3years', 'emp_length_4years', 'emp_length_5years', 'emp_length_6years', 'emp_length_7years', 'emp_length_8years', 'emp_length_9years', 'emp_length_1year', 'home_ownership_MORTGAGE', 'home_ownership_OWN', 'home_ownership_RENT']
        self.features_prepayment = ['loan_amnt', 'int_rate', 'installment', 'annual_inc', 'dti', 'open_acc', 'revol_bal', 'revol_util', 'total_acc', 'delinq_2yrs', 'pub_rec', 'collections_12_mths_ex_med', 'tot_coll_amt', 'term_60months', 'grade_B', 'grade_C', 'grade_D', 'grade_E', 'grade_F', 'grade_G', 'sub_grade_A2', 'sub_grade_A3', 'sub_grade_A4', 'sub_grade_A5', 'sub_grade_B1', 'sub_grade_B2', 'sub_grade_B3', 'sub_grade_B4', 'sub_grade_B5', 'sub_grade_C1', 'sub_grade_C2', 'sub_grade_C3', 'sub_grade_C4', 'sub_grade_C5', 'sub_grade_D1', 'sub_grade_D2', 'sub_grade_D3', 'sub_grade_D4', 'sub_grade_D5', 'sub_grade_E1', 'sub_grade_E2', 'sub_grade_E3', 'sub_grade_E4', 'sub_grade_E5', 'sub_grade_F1', 'sub_grade_F2', 'sub_grade_F3', 'sub_grade_F4', 'sub_grade_F5', 'sub_grade_G1', 'sub_grade_G2', 'sub_grade_G3', 'sub_grade_G4', 'sub_grade_G5', 'emp_length_10years', 'emp_length_2years', 'emp_length_3years', 'emp_length_4years', 'emp_length_5years', 'emp_length_6years', 'emp_length_7years', 'emp_length_8years', 'emp_length_9years', 'emp_length_1year', 'home_ownership_MORTGAGE', 'home_ownership_OWN', 'home_ownership_RENT']

    def process_input(self, raw_data, feature_list):
        """
        raw_data: dictionary from your website form
        e.g., {'loan_amnt': 10000, 'annual_inc': 50000, 'grade': 'B', 'term': '60'}
        """
        # 1. Create a base dataframe with 0.0s for all potential features
        df = pd.DataFrame(0.0, index=[0], columns=feature_list)
        
        # 2. Map Numerical Values
        for col in ['loan_amnt', 'annual_inc', 'dti', 'revol_bal', 'revol_util', 'total_acc', 'delinq_2yrs', 'int_rate', 'installment', 'open_acc', 'pub_rec', 'collections_12_mths_ex_med', 'tot_coll_amt']:
            if col in raw_data and col in df.columns:
                df.at[0, col] = float(raw_data[col])
        
        # 3. Map Categorical (The tricky naming part)
        if raw_data.get('term'):
            term_str = raw_data['term'].strip()
            if '60' in term_str:
                if 'term_60months' in df.columns: df.at[0, 'term_60months'] = 1.0
                if 'term__60_months' in df.columns: df.at[0, 'term__60_months'] = 1.0
            
        grade_key = f"grade_{raw_data.get('grade')}"
        if grade_key in df.columns:
            df.at[0, grade_key] = 1.0
            
        if raw_data.get('sub_grade'):
            sub_grade_key = f"sub_grade_{raw_data.get('sub_grade')}"
            if sub_grade_key in df.columns:
                df.at[0, sub_grade_key] = 1.0
                
        if raw_data.get('home_ownership'):
            home_key = f"home_ownership_{raw_data.get('home_ownership')}"
            if home_key in df.columns:
                df.at[0, home_key] = 1.0
            
        emp_map_risk = {
            '10+ years': 'emp_length_10__years',
            '1 year': 'emp_length_1_year',
            '< 1 year': 'emp_length___1_year',
            '2 years': 'emp_length_2_years',
            '3 years': 'emp_length_3_years',
            '4 years': 'emp_length_4_years',
            '5 years': 'emp_length_5_years',
            '6 years': 'emp_length_6_years',
            '7 years': 'emp_length_7_years',
            '8 years': 'emp_length_8_years',
            '9 years': 'emp_length_9_years',
        }
        emp_map_roi = {
            '10+ years': 'emp_length_10years',
            '1 year': 'emp_length_1year',
            '< 1 year': 'emp_length_1year', # usually bunched
            '2 years': 'emp_length_2years',
            '3 years': 'emp_length_3years',
            '4 years': 'emp_length_4years',
            '5 years': 'emp_length_5years',
            '6 years': 'emp_length_6years',
            '7 years': 'emp_length_7years',
            '8 years': 'emp_length_8years',
            '9 years': 'emp_length_9years',
        }
        
        emp_raw = raw_data.get('emp_length')
        if emp_raw:
            if emp_map_risk.get(emp_raw) in df.columns:
                df.at[0, emp_map_risk[emp_raw]] = 1.0
            if emp_map_roi.get(emp_raw) in df.columns:
                df.at[0, emp_map_roi[emp_raw]] = 1.0
        
        return df

    def get_full_report(self, raw_data):
        # 0. Business Logic Guardrails
        # The ML models were trained on loans that ACTUALLY GOT ISSUED by the bank.
        # It has zero mathematical concept of extremely unqualified loans (e.g. DTI 50 or $500k on $1k income)
        # because the bank naturally filtered those out before they reached the model.
        # We must apply hard structural logic to catch these catastrophic outliers first.
        
        loan_amnt = float(raw_data.get('loan_amnt', 0))
        annual_inc = float(raw_data.get('annual_inc', 1))
        dti = float(raw_data.get('dti', 0))
        
        # Hard Denials
        if annual_inc < 10000 or (loan_amnt / annual_inc) > 1.0 or dti > 45.0:
            return {
                "risk_score": 100.0,
                "estimated_roi": -100.0,
                "recommendation": "Manual Review",
                "flag": "High Risk Business Guardrail Triggered"
            }

        input_df_prepayment = self.process_input(raw_data, self.features_prepayment)
        input_df_risk_int = self.process_input(raw_data, self.features_risk)
        
        # 1. Prepayment Model (Probability of Default)
        raw_default_prob = float(self.models['gb_classifier'].predict_proba(input_df_prepayment)[0][1])
        
        # Scale to a 0-100 visual score (e.g. 7.5% default -> 75 risk score)
        # Cap at 100 just in case.
        visual_risk_score = min(raw_default_prob * 10 * 100, 100.0)
        
        # 2. Interest Rate Model (Expected rate if approved)
        expected_int_rate = float(self.models['risk'].predict(input_df_risk_int)[0])
        
        # 3. Synthetic ROI Heuristic
        # ROI ≈ (Interest Return * Probability of Payback) - (Total Loss * Probability of Default)
        # (Assuming loan_amnt is 1.0 for percentage return)
        estimated_roi_val = (expected_int_rate / 100.0) * (1.0 - raw_default_prob) - (1.0 * raw_default_prob)
        estimated_roi_percentage = estimated_roi_val * 100.0
        
        return {
            "risk_score": float(np.round(visual_risk_score, 1)),
            "estimated_roi": float(np.round(estimated_roi_percentage, 2)),
            # Shift approval threshold down from 50% down to 6% raw probability (which is 60 on the visual score scale)
            "recommendation": "Approve" if raw_default_prob < 0.06 else "Manual Review"
        }

# --- Test code for your IDE ---
if __name__ == "__main__":
    engine = LoanAssessmentEngine()
    sample_application = {
        'loan_amnt': 15000,
        'annual_inc': 75000,
        'dti': 12.5,
        'grade': 'C',
        'term': '60'
    }
    print(engine.get_full_report(sample_application))