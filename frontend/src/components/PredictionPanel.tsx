"use client";
import { useState } from "react";
import {predictShipment,PredictionResponse,} from "@/services/predictionService";
import PredictionResult from "@/components/PredictionResult";
export default function PredictionPanel() {
  const [result, setResult] =
    useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handlePrediction() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await predictShipment({
        order_year: 2026,
        order_month: 8,
        order_quarter: 3,
        order_day_of_week: 3,
        order_week: 33,
        is_weekend: 0,
        shipping_mode: "Standard Class",
        is_same_day: 0,
        is_priority_shipping: 0,
        market: "Europe",
        order_region: "Western Europe",
        order_state: "Vienna",
        customer_segment: "Consumer",
        category_name: "Cardio Equipment",
        department_name: "Footwear",
        order_item_quantity: 1,
        order_item_product_price: 99.99,
        product_price: 99.99,
        order_item_discount: 10,
        order_item_discount_rate: 0.10,
        order_item_profit_ratio: 0.40,
        order_value: 99.99,
        discount_amount: 10,
        net_order_value: 89.99,
        profit_amount: 35,
        order_status: "PROCESSING",
      });
      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Prediction failed"
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Shipment Risk Prediction
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Run the trained ML model against a shipment
        </p>
      </div>
      <button
        onClick={handlePrediction}
        disabled={loading}
        className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Running ML Model..."
          : "Predict Shipment Risk"}
      </button>
      {error && (
        <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}
      {result && (
        <PredictionResult
          prediction={result.prediction}
          probability={result.delay_probability}/>
      )}
    </div>
  );
}