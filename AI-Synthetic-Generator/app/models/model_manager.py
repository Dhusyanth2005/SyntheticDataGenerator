import joblib
import os
from app.config import MODEL_DIR

MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")

def save_model(mean, cov):
    joblib.dump((mean, cov), MODEL_PATH)

def load_model():
    return joblib.load(MODEL_PATH)