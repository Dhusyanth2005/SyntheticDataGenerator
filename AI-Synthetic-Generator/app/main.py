from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="AI Synthetic Data Generator")

app.include_router(router)