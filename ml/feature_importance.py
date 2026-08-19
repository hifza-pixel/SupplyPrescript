from pathlib import Path
import joblib
import pandas as pd
DATA_FILE = Path("data/processed/model_features.csv")
MODEL_FILE = Path("models/delay_model.pkl")
PREPROCESSOR_FILE = Path("models/delay_preprocessor.pkl")
OUTPUT_DIR = Path("data/processed")
OUTPUT_FILE = OUTPUT_DIR / "feature_importance.csv"
def main():
    print("Loading model...")
    model = joblib.load(MODEL_FILE)
    preprocessor = joblib.load(PREPROCESSOR_FILE)
    df = pd.read_csv(DATA_FILE)
    X = df.drop(
        columns=[
            "delay_target",
            "delivery_days",
            "delivery_outlier",
            "order_id",
        ])
    print("Extracting feature names...")
    feature_names = preprocessor.get_feature_names_out()
    importance = model.feature_importances_
    result = pd.DataFrame({
            "feature": feature_names,
            "importance": importance,
        })
    result = result.sort_values(
        "importance",
        ascending=False,
    ).reset_index(drop=True)
    result["rank"] = result.index + 1
    result = result[[
            "rank",
            "feature",
            "importance",
        ]]
    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )
    result.to_csv(
        OUTPUT_FILE,
        index=False,
    )
    print("\n========== TOP 20 FEATURES ==========")
    print(
        result.head(20).to_string(
            index=False
        ))
    print(
        f"\nFeature importance saved to: "
        f"{OUTPUT_FILE}"
    )
if __name__ == "__main__":
    main()