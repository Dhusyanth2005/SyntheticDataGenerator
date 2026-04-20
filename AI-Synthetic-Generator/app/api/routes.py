from fastapi import APIRouter, UploadFile, File, Form
import shutil
import os
import pandas as pd

from app.services.data_loader import load_data
from app.services.trainer import train_model
from app.services.generator import generate_synthetic
from app.services.evaluator import evaluate_quality
from app.services.quality_score import compute_quality_score
from app.models.model_manager import save_model, load_model
from app.config import UPLOAD_DIR, GENERATED_DIR

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    df = load_data(file_path)
    mean, cov = train_model(df)

    save_model(mean, cov)

    return {"message": "Model trained successfully"}

@router.post("/generate")
def generate_data(file: UploadFile = File(...), samples: int = Form(default=1000)):
    # Validate samples
    if samples < 100 or samples > 100000:
        return {"success": False, "message": "Number of rows must be between 100 and 100,000"}
    
    try:
        # Save uploaded file temporarily
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Train model on uploaded file
        df = load_data(file_path)
        mean, cov = train_model(df)
        save_model(mean, cov)
        
        # Generate synthetic data
        synthetic_df = generate_synthetic(mean, cov, n_samples=samples)

        csv_content = synthetic_df.to_csv(index=False)

        # ─── Evaluate right away ───
        try:
            metrics = evaluate_quality(df, synthetic_df)
            score = compute_quality_score(metrics)
        except Exception as e:
            metrics = {}
            score = None
            print(f"Evaluation failed: {e}")

        return {
            "success": True,
            "synthetic_csv_content": csv_content,
            "rows_generated": len(synthetic_df),
            "quality_score": score,
            "metrics": metrics
        }
        
    except Exception as e:
        print(f"Generation error: {e}")
        return {
            "success": False,
            "message": "Failed to generate synthetic dataset",
            "error": str(e)
        }

@router.post("/evaluate")
def evaluate():
    real_path = os.path.join(UPLOAD_DIR, os.listdir(UPLOAD_DIR)[0])
    synthetic_path = os.path.join(GENERATED_DIR, "synthetic_data.csv")

    real_df = pd.read_csv(real_path)
    synthetic_df = pd.read_csv(synthetic_path)

    metrics = evaluate_quality(real_df, synthetic_df)
    score = compute_quality_score(metrics)

    return {"metrics": metrics, "quality_score": score}