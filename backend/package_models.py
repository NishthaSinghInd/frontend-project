import joblib
from pathlib import Path

# Need the monkey-patch for older sklearn models if running under 3.14, but we'll try to run under 3.10 which might natively support them 
# (although they might be too old even for 3.10, so let's include it)
import sklearn.compose._column_transformer
if not hasattr(sklearn.compose._column_transformer, '_RemainderColsList'):
    _RemainderColsList = type('_RemainderColsList', (list,), {'__module__': 'sklearn.compose._column_transformer'})
    sklearn.compose._column_transformer._RemainderColsList = _RemainderColsList
if not hasattr(sklearn.compose, '_RemainderColsList'):
    sklearn.compose._RemainderColsList = sklearn.compose._column_transformer._RemainderColsList

model_dir = Path(__file__).parent / "models"

try:
    models_dict = {
        "loan_grade": joblib.load(model_dir / "xgboost_classifier_loan_grade_pipeline.pkl"),
        "credit_risk": joblib.load(model_dir / "xgboost_regressor_credit_risk_pipeline.pkl"),
        "interest_rate": joblib.load(model_dir / "xgboost_regressor_interest_rate_pipeline.pkl"),
        "prepayment": joblib.load(model_dir / "gradient_boosting_classifier_prepayment_pipeline.pkl"),
        "safe_loan": joblib.load(model_dir / "linear_regression_safe_loan_pipeline.pkl"),
        "segmentation": joblib.load(model_dir / "kmeans_customer_segmentation_pipeline.pkl"),
        "roi_prediction": joblib.load(model_dir / "random_forest_regressor_roi_pipeline.pkl")
    }

    try:
        models_dict["borrower_network_risk"] = joblib.load(model_dir / "gnn_borrower_analysis_pipeline.pkl")
    except Exception as e:
        print("Skipping GNN model:", e)

    out_file = model_dir / "all_models.pkl"
    joblib.dump(models_dict, out_file)
    print("Successfully created all_models.pkl!")
except Exception as e:
    print("Error packaging models:", e)
