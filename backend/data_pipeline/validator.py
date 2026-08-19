from pathlib import Path
import pandas as pd
RAW_FILE=Path("data/raw/incom2024_delay_example_dataset.csv")
PROCESSED_DIR = Path("data/processed")
CLEAN_FILE = PROCESSED_DIR / "supply_chain_clean.csv"
QUALITY_FILE = PROCESSED_DIR / "data_quality_report.csv"
def load_data() -> pd.DataFrame:
    """Load the raw supply-chain dataset."""
    df=pd.read_csv(RAW_FILE)
    df["order_date"]=pd.to_datetime(
        df["order_date"], utc=True,errors="coerce",
    )
    df["shipping_date"]=pd.to_datetime(
        df["shipping_date"], utc=True, errors="coerce",
    )
    return df
def validate_data(df:pd.DataFrame):
    """Raw data-quaity check and returned clean data + report."""
    original_count=len(df)
    duplicate_mask=df.duplicated(
        subset=["order_id","order_item_id"], keep="first",
    )
    duplicate_count=int(duplicate_mask.sum())
    df=df.loc[~duplicate_mask].copy()
     # Calculate historical delivery duration.
    df["delivery_days"] = (
        df["shipping_date"] - df["order_date"]
    ).dt.total_seconds() / 86400
    # Invalid shipment duration.
    invalid_mask = (
        df["delivery_days"].isna() | (df["delivery_days"] <= 0)
    )
    invalid_count = int(invalid_mask.sum())
    df = df.loc[~invalid_mask].copy()
    # Calculate mode-specific P99 thresholds.
    thresholds = (
        df.groupby("shipping_mode")["delivery_days"]
        .quantile(0.99)
        .to_dict()
    )
    # Flag statistical outliers.
    df["delivery_outlier"] = df.apply(
        lambda row: (
            row["delivery_days"]> thresholds.get(row["shipping_mode"],float("inf"),
            )
        ),
        axis=1,
    )
    outlier_count = int(df["delivery_outlier"].sum())
    # Quality report.
    report = pd.DataFrame(
        [
            {
                "metric": "original_records",
                "value": original_count,
            },
            {
                "metric": "duplicate_records_removed",
                "value": duplicate_count,
            },
            {
                "metric": "invalid_delivery_records_removed",
                "value": invalid_count,
            },
            {
                "metric": "valid_records",
                "value": len(df),
            },
            {
                "metric": "delivery_outliers_flagged",
                "value": outlier_count,
            },
        ]
    )
    return df, report
def main():
    """Run the complete data-quality pipeline."""
    PROCESSED_DIR.mkdir(
        parents=True, exist_ok=True,
    )
    print("Loading raw dataset...")
    df = load_data()
    print(f"Raw records: {len(df)}")
    clean_df, report = validate_data(df)
    clean_df.to_csv(
        CLEAN_FILE,index=False,
    )
    report.to_csv(
        QUALITY_FILE,index=False,
        )
    print("\nData quality pipeline completed.")
    print(f"Clean dataset: {CLEAN_FILE}")
    print(f"Quality report: {QUALITY_FILE}")
    print("\nQuality report:")
    print(report.to_string(index=False))
if __name__ == "__main__":
    main()