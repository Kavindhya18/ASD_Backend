from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 18-FEATURE MODEL (For the new Assessment Form) ---
MODEL_18_PATH = "asd_svm_18_model.pkl"
SCALER_18_PATH = "asd_svm_18_scaler.pkl"
model_18 = None
scaler_18 = None

if os.path.exists(MODEL_18_PATH):
    try:
        model_18 = joblib.load(MODEL_18_PATH)
        print("18-feature SVM Model loaded successfully")
    except Exception as e:
        print(f"Error loading 18-feature model: {e}")

if os.path.exists(SCALER_18_PATH):
    try:
        scaler_18 = joblib.load(SCALER_18_PATH)
        print("18-feature Scaler loaded successfully")
    except Exception as e:
        print(f"Error loading 18-feature scaler: {e}")

# --- KAGGLE MODEL (For the Advanced Form) ---
MODEL_ADV_PATH = "asd_svm_kaggle_model.pkl"
SCALER_ADV_PATH = "asd_svm_scaler.pkl"
model_adv = None
scaler_adv = None

if os.path.exists(MODEL_ADV_PATH):
    try:
        model_adv = joblib.load(MODEL_ADV_PATH)
        print("Advanced Kaggle Model loaded successfully")
    except Exception as e:
        print(f"Error loading advanced model: {e}")

if os.path.exists(SCALER_ADV_PATH):
    try:
        scaler_adv = joblib.load(SCALER_ADV_PATH)
        print("Advanced Scaler loaded successfully")
    except Exception as e:
        print(f"Error loading advanced scaler: {e}")

class PredictionInput(BaseModel):
    features: list

@app.get("/")
def read_root():
    return {"message": "ASD AI Service is running"}

# Endpoint for the 18-feature form
@app.post("/predict/asd_18")
def predict_18(input_data: PredictionInput):
    if model_18 is None or scaler_18 is None:
        raise HTTPException(status_code=500, detail="18-feature Model or Scaler not loaded")
    try:
        features = [float(f) for f in input_data.features]
        data = np.array(features).reshape(1, -1)
        scaled_data = scaler_18.transform(data)
        prediction = model_18.predict(scaled_data)
        return {
            "prediction": int(prediction[0]),
            "result": "Positive" if prediction[0] == 1 else "Negative"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint for the Advanced form
@app.post("/predict")
def predict_advanced(input_data: PredictionInput):
    if model_adv is None or scaler_adv is None:
        raise HTTPException(status_code=500, detail="Advanced Model or Scaler not loaded")
    try:
        features = [float(f) for f in input_data.features]
        data = np.array(features).reshape(1, -1)
        scaled_data = scaler_adv.transform(data)
        prediction = model_adv.predict(scaled_data)
        return {
            "prediction": int(prediction[0]),
            "result": "Positive" if prediction[0] == 1 else "Negative"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
