from pathlib import Path
import joblib
import pandas as pd
BASE_DIR = Path(__file__).resolve().parents[3]
MODEL_FILE = (
    BASE_DIR
    / "models"
    / "delay_model.pkl"
)
PREPROCESSOR_FILE = (
    BASE_DIR
    / "models"
    / "delay_preprocessor.pkl"
)
model = joblib.load(MODEL_FILE)
preprocessor = joblib.load(
    PREPROCESSOR_FILE
)
def predict_delay(shipment_data: dict):
    df = pd.DataFrame(
        [shipment_data]
    )
    X_encoded = preprocessor.transform(
        df
    )
    probability = model.predict_proba(
        X_encoded
    )[0][1]
    prediction = int(
        probability >= 0.5
    )
    risk_level = (
        "HIGH"
        if probability >= 0.70
        else "MEDIUM"
        if probability >= 0.40
        else "LOW"
    )
    feature_names = (
        preprocessor
        .get_feature_names_out()
    )
    importance = model.feature_importances_
    importance_df = pd.DataFrame(
        {
            "feature": feature_names,
            "importance": importance,
        }
    )
    importance_df = (
        importance_df
        .sort_values(
            "importance",
            ascending=False,
        )
        .head(5)
    )
    explanations = []
    for _, row in importance_df.iterrows():
        feature = row["feature"]
        feature = feature.replace(
            "categorical__",
            "",
        )
        feature = feature.replace(
            "numerical__",
            "",
        )
        explanations.append({
                "feature": feature,
                "importance": round(
                    float(
                        row["importance"]
                    ),
                    4,
                ),
            })
    return {
        "delay_prediction": prediction,
        "delay_probability": round(
            float(probability),
            4,
        ),
        "risk_level": risk_level,
        "top_factors": explanations,
    }