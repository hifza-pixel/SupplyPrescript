from pathlib import Path
import pandas as pd
INPUT_FILE = Path("data/processed/supply_chain_clean.csv")
OUTPUT_FILE = Path("data/processed/model_features.csv")
def build_features(df:pd.DataFrame) -> pd.DataFrame :
    """Create leakage-safe features for supply-chain delay prediction."""
    df= df.copy()
    #  Date features
    
    df["order_year"] = df["order_date"].dt.year
    df["order_month"] = df["order_date"].dt.month
    df["order_quarter"] = df["order_date"].dt.quarter
    df["order_day_of_week"] = df["order_date"].dt.dayofweek
    df["order_week"] = df["order_date"].dt.isocalendar().week.astype(int)

    #  Order / commercial features
    df["order_value"] = (
        df["order_item_quantity"]
        * df["order_item_product_price"]
    )
    df["discount_amount"] = (
        df["order_item_discount"]
        * df["order_value"]
    )
    df["net_order_value"] = (
        df["order_value"]
        - df["discount_amount"]
    )
    df["profit_amount"] = (
        df["net_order_value"]
        * df["order_item_profit_ratio"]
    )

    #  Operational features
    df["is_weekend"] = (
        df["order_day_of_week"] >= 5
    ).astype(int)
    df["is_same_day"] = (
        df["shipping_mode"] == "Same Day"
    ).astype(int)
    df["is_priority_shipping"] = (
        df["shipping_mode"].isin(
            ["Same Day", "First Class"]
        )
    ).astype(int)

    #  Target
    DELAY_THRESHOLD = 14
    df["delay_target"] = (
        df["delivery_days"] > DELAY_THRESHOLD
    ).astype(int)

    #  Keep useful model columns
    feature_columns = [
        "order_id",
        "order_year",
        "order_month",
        "order_quarter",
        "order_day_of_week",
        "order_week",
        "is_weekend",
        "shipping_mode",
        "is_same_day",
        "is_priority_shipping",
        "market",
        "order_region",
        "order_state",
        "customer_segment",
        "category_name",
        "department_name",
        "order_item_quantity",
        "order_item_product_price",
        "product_price",
        "order_item_discount",
        "order_item_discount_rate",
        "order_item_profit_ratio",
        "order_value",
        "discount_amount",
        "net_order_value",
        "profit_amount",
        "order_status",
        "delay_target",
        "delivery_days",
        "delivery_outlier",
    ]
    feature_columns = [
        column
        for column in feature_columns
        if column in df.columns
    ]
    return df[feature_columns]
def main():
    print("Loading cleaned dataset...")
    df = pd.read_csv(
        INPUT_FILE,
        parse_dates=[
            "order_date",
            "shipping_date",
        ],
    )
    print(f"Input records: {len(df)}")
    features = build_features(df)
    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )
    features.to_csv(
        OUTPUT_FILE,
        index=False,
    )
    print("\nFeature engineering completed.")
    print(f"Output file: {OUTPUT_FILE}")
    print(f"Shape: {features.shape}")
    print("\nDelay target distribution:")
    print(
        features["delay_target"]
        .value_counts()
        .sort_index()
    )
    print("\nFeature columns:")
    for column in features.columns:
        print(f"- {column}")
if __name__ == "__main__":
    main()