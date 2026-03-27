import joblib
import io
import sys
import sklearn.compose._column_transformer

# Monkey path _RemainderColsList to avoid unpickling error in Python 3.14 / latest sklearn
class _RemainderColsList(list):
    pass

sklearn.compose._column_transformer._RemainderColsList = list
try:
    sklearn.compose._RemainderColsList = list
except:
    pass

try:
    model = joblib.load('models/xgboost_classifier_loan_grade_pipeline.pkl')
    print("Success loading model with list alias")
except Exception as e:
    print("Error with list:", e)

