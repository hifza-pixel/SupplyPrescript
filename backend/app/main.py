from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.config import APP_NAME, APP_VERSION
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import get_db, Base, engine
from app.models.shipment import Shipment
from app.routers.prediction import router as prediction_router
from app.routers.prescription import router as prescription_router
from app.routers.decision import router as decision_router

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title= "SupplyPrescript API",
    description= "Closed-Loop Prescriptive Analytics for Supply Chain Operations",
    version=APP_VERSION,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(prediction_router)
app.include_router(prescription_router)
app.include_router(decision_router)
@app.get("/health")
def health_check():
    return{
        "status":"healthy",
        "service": APP_NAME,
        "version": APP_VERSION,
    }
@app.get("/health/database")
def database_health_check(db: Session=Depends(get_db)):
    db.execute(text("Select 1"))
    return{
        "status": "connected",
        "database": "PostgreSQL",
    }