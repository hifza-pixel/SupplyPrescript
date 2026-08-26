import { apiRequest } from "./api";
export interface AnalyticsSummary {
  total_decisions: number;
  high_risk_decisions: number;
  total_decision_cost: number;
  average_predicted_delay: number;
  average_resulting_delay: number;
  constraint_compliance_percent: number;
  option_breakdown: Record<string, number>;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return apiRequest<AnalyticsSummary>("/api/analytics/summary");
}