import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
DATA_PATH = Path("data/processed/model_features.csv")
MODEL_DIR = Path("models")
MODEL_DIR.mkdir(parents=True, exist_ok=True)
print("Loading dataset...")
df = pd.read_csv(DATA_PATH)
df = df[df["delivery_outlier"] == False].copy()
print(f"Training records: {len(df)}")
TARGET = "delivery_days"
DROP_COLUMNS = [
    "delivery_days",
    "delay_target",
    "delivery_outlier",
    "order_id",
]
X = df.drop(columns=DROP_COLUMNS)
y = df[TARGET]
categorical_features = X.select_dtypes(
    include=["object"]).columns.tolist()
numerical_features = X.select_dtypes(
    exclude=["object"]).columns.tolist()
print("\nCategorical features:")
print(categorical_features)
print("\nNumerical features:")
print(numerical_features)
numeric_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="median"),
        )])
categorical_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="most_frequent"),
        ),
        (
            "onehot",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
        ),
    ])
preprocessor = ColumnTransformer(
    transformers=[
        (
            "numerical",
            numeric_pipeline,
            numerical_features,
        ),
        (
            "categorical",
            categorical_pipeline,
            categorical_features,
        ),
    ])
model = RandomForestRegressor(
    n_estimators=300,
    max_depth=18,
    min_samples_leaf=3,
    random_state=42,
    n_jobs=-1,
)
pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor,
        ),
        (
            "model",
            model,
        ),
    ])
X_train, X_test, y_train, y_test = train_test_split(
    X, y,test_size=0.20,random_state=42,)
print("\nTraining regression model...")
pipeline.fit( X_train,y_train,)
predictions = pipeline.predict(X_test)
mae = mean_absolute_error(y_test,predictions,)
rmse = mean_squared_error(y_test, predictions,) ** 0.5
r2 = r2_score(y_test,predictions,)
print("\n========== DURATION MODEL RESULTS ==========")
print(f"MAE  : {mae:.2f} days")
print(f"RMSE : {rmse:.2f} days")
print(f"R2   : {r2:.4f}")
MODEL_PATH = (MODEL_DIR / "delay_duration_model.pkl")
joblib.dump(pipeline,MODEL_PATH,)
print(f"\nModel saved to: {MODEL_PATH}")