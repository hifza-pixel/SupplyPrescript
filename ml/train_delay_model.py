from pathlib import Path
import pandas as pd
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.metrics import(
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBClassifier
DATA_FILE = Path("data/processed/model_features.csv")
MODEL_DIR = Path("models")
MODEL_FILE = MODEL_DIR / "delay_model.pkl"
PREPROCESSOR_FILE = MODEL_DIR / "delay_preprocessor.pkl"
def load_data():
    df=pd.read_csv(DATA_FILE)
    X=df.drop(columns=[
            "delay_target",
            "delivery_days",
            "delivery_outlier",
            "order_id",
    ])
    y=df["delay_target"]
    return X,y
def train_model():
    X,y=load_data()
    categorical_columns=X.select_dtypes(
        include=["object"]
    ).columns.tolist()
    numerical_columns=X.select_dtypes(
        exclude=["object"]
    ).columns.tolist()
    preprocessor=ColumnTransformer(
        transformers=[(
             "categorical",
                OneHotEncoder(
                    handle_unknown="ignore"
                ),
                categorical_columns,
            ),
            (
                "numerical",
                "passthrough",
                numerical_columns,
            ),
        ])
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    X_train_encoded = preprocessor.fit_transform(
        X_train
    )

    X_test_encoded = preprocessor.transform(
        X_test
    )
    negative_count = (y_train == 0).sum()
    positive_count = (y_train == 1).sum()
    scale_pos_weight = (
        negative_count / positive_count
    )
    model = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="logloss",
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        n_jobs=-1,
    )
    print("Training XGBoost model...")
    model.fit(
        X_train_encoded,
        y_train,
    )
    predictions = model.predict(
        X_test_encoded
    )
    probabilities = model.predict_proba(
        X_test_encoded
    )[:, 1]
    accuracy = accuracy_score(
        y_test,
        predictions,
    )
    precision = precision_score(
        y_test,
        predictions,
        zero_division=0,
    )
    recall = recall_score(
        y_test,
        predictions,
        zero_division=0,
    )
    f1 = f1_score(
        y_test,
        predictions,
        zero_division=0,
    )
    roc_auc = roc_auc_score(
        y_test,
        probabilities,
    )
    print("\n========== MODEL PERFORMANCE ==========")
    print(f"Accuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")
    print(f"ROC-AUC  : {roc_auc:.4f}")
    print("\n========== CLASSIFICATION REPORT ==========")
    print(
        classification_report(
            y_test,
            predictions,
            zero_division=0,
        ))
    print("========== CONFUSION MATRIX ==========")
    print(
        confusion_matrix(
            y_test,
            predictions,
        )
    )
    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )
    joblib.dump(
        model,
        MODEL_FILE,
    )
    joblib.dump(
        preprocessor,
        PREPROCESSOR_FILE,
    )
    print("\n========== MODEL SAVED ==========")
    print(f"Model      : {MODEL_FILE}")
    print(f"Preprocessor: {PREPROCESSOR_FILE}")
if __name__ == "__main__":
    train_model()