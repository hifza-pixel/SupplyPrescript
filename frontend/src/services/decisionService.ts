import { apiRequest } from "./api";
export interface Decision{
    id: number;
  shipment_id: string;
  option_id: string;
  option_name: string;
  predicted_delay_days: number;
  decision_cost: number;
  resulting_delay_days: number;
  budget_limit: number;
  max_delay_limit: number;
  status: string;
  created_at: string;
}
export interface DecisionHistoryResponse{
    count: number;
    decisions: Decision[];
}
export async function getDecisionHistory():Promise<DecisionHistoryResponse> {
    return apiRequest<DecisionHistoryResponse>("/api/decisions");
}