const API_BASE_URL= process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
export interface PredictionRequest{
     order_year: number;
  order_month: number;
  order_quarter: number;
  order_day_of_week: number;
  order_week: number;
  is_weekend: number;
  shipping_mode: string;
  is_same_day: number;
  is_priority_shipping: number;
  market: string;
  order_region: string;
  order_state: string;
  customer_segment: string;
  category_name: string;
  department_name: string;
  order_item_quantity: number;
  order_item_product_price: number;
  product_price: number;
  order_item_discount: number;
  order_item_discount_rate: number;
  order_item_profit_ratio: number;
  order_value: number;
  discount_amount: number;
  net_order_value: number;
  profit_amount: number;
  order_status: string;
}
export interface PredictionResponse{
  prediction: number;
  delay_probability: number;
  delay_probability_percent: number;
  risk_level: string;
  recommendation: string;
}
export async function predictShipment(payload:PredictionRequest):Promise<PredictionResponse> {
    const response =await fetch(
        `${API_BASE_URL}/api/predictions/delay`,
        {
            method:"POST",
            headers :{
                "Content-type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );
    if (!response.ok){
        const errorText= await response.text();
        throw new Error(
            errorText || "Prediction request failed"
        );
    }
    return response.json();
}