from pathlib import Path
from typing import Any
import joblib
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
router = APIRouter(
    prefix="/api/predictions",
    tags=["Predictions"],
)
BASE_DIR = Path(__file__).resolve().parents[3]
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "delay_model.pkl"
PREPROCESSOR_PATH = MODEL_DIR / "delay_preprocessor.pkl"
DURATION_MODEL_PATH = MODEL_DIR / "delay_duration_model.pkl"
try:
    model = joblib.load(MODEL_PATH)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
except Exception as exc:
    model = None
    preprocessor = None
    MODEL_LOAD_ERROR = str(exc)
else:
    MODEL_LOAD_ERROR = None
try:
    duration_model = joblib.load(
        DURATION_MODEL_PATH
    )
except Exception as exc:
    duration_model = None
    DURATION_MODEL_LOAD_ERROR = str(exc)
else:
    DURATION_MODEL_LOAD_ERROR = None
class DelayPredictionRequest(BaseModel):
    order_year: int
    order_month: int
    order_quarter: int
    order_day_of_week: int
    order_week: int
    is_weekend: int
    shipping_mode: str
    is_same_day: int
    is_priority_shipping: int
    market: str
    order_region: str
    order_state: str
    customer_segment: str
    category_name: str
    department_name: str
    order_item_quantity: float
    order_item_product_price: float
    product_price: float
    order_item_discount: float
    order_item_discount_rate: float
    order_item_profit_ratio: float
    order_value: float
    discount_amount: float
    net_order_value: float
    profit_amount: float
    order_status: str
@router.get("/health")
def prediction_health() -> dict[str, Any]:
    return {
        "service": "SupplyPrescript Delay Prediction",
        "classification_model_loaded": (
            model is not None
        ),
        "classification_preprocessor_loaded": (
            preprocessor is not None
        ),
        "duration_model_loaded": (
            duration_model is not None
        ),
    }
@router.post("/delay")
def predict_delay(
    request: DelayPredictionRequest,
) -> dict[str, Any]:
    if model is None or preprocessor is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "Classification model is not available: "
                f"{MODEL_LOAD_ERROR}"
            ),
        )
    try:
        input_data = pd.DataFrame(
            [request.model_dump()]
        )
        transformed_data = preprocessor.transform(
            input_data
        )
        prediction = int(
            model.predict(
                transformed_data
            )[0]
        )
        probabilities = model.predict_proba(
            transformed_data
        )[0]
        delay_probability = float(
            probabilities[1]
        )
        if delay_probability >= 0.75:
            risk_level = "HIGH"
        elif delay_probability >= 0.45:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        if risk_level == "HIGH":
            recommendation = (
                "Immediate intervention recommended. "
                "Run the prescriptive optimization engine."
            )
        elif risk_level == "MEDIUM":
            recommendation = (
                "Monitor this shipment closely and "
                "prepare alternative fulfillment options."
            )
        else:
            recommendation = (
                "No immediate intervention required. "
                "Continue normal monitoring."
            )
        predicted_delay_days = None
        if duration_model is not None:
            predicted_delay = duration_model.predict(
                input_data
            )[0]
            predicted_delay_days = round(
                max(float(predicted_delay), 1.0),
                2,)
        return {
            "prediction": prediction,
            "delay_probability": round(
                delay_probability,
                4,
            ),
            "delay_probability_percent": round(
                delay_probability * 100,
                2,
            ),
            "risk_level": risk_level,
            "predicted_delay_days": (
                predicted_delay_days
            ),
            "duration_model_available": (
                duration_model is not None
            ),
            "recommendation": recommendation,
        }
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}",
        )