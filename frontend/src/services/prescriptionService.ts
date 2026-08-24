import { apiRequest } from "./api";
export interface PrescriptionOption{
     id: string;
  name: string;
  cost: number;
  resulting_delay: number;
  speed_score: number;
  objective_score: number;
  budget_remaining: number;
  selected_by_solver: boolean;
  rank: number;
}
export interface PrescriptionResponse{
   status: string;
  solver: string;
  delay_days_predicted: number;
  budget_constraint: number;
  max_delay_constraint: number;
  objective_weights: {
    cost: number;
    delay: number;
};
optimal_objective_value:number;
recommended_option: PrescriptionOption;
alternatives: PrescriptionOption[];
}
export interface PrescriptionRequest{
    delay_days: number;
  budget: number;
  max_delay_days: number;
}
export async function generatePrescriptions(payload:PrescriptionRequest):Promise<PrescriptionResponse> {
     return apiRequest<PrescriptionResponse>(
        "/api/prescriptions", 
        {
            method: "POST",
            body:JSON.stringify(payload),
        }
    );
}