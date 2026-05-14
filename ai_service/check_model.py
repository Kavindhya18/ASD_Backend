import pickle
import joblib

try:
    with open('asd_svm_kaggle_model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('asd_svm_scaler.pkl', 'rb') as f:
        scaler = joblib.load(f)
        
    print(f"Model type: {type(model)}")
    print(f"Scaler type: {type(scaler)}")
    
    if hasattr(model, 'n_features_in_'):
        print(f"Number of features model expects: {model.n_features_in_}")
    
    if hasattr(scaler, 'n_features_in_'):
        print(f"Number of features scaler expects: {scaler.n_features_in_}")
        
except Exception as e:
    print(f"Error: {e}")
