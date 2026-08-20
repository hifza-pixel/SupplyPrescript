from pydantic import BaseModel, Field
class DecisionExecuteRequest(BaseModel):
    shipment_id: str | None = None
    option_id: str = Field(...,min_length=1,max_length=10)
    option_name: str
    predicted_delay_days: float = Field(...,ge=0)
    decision_cost: float = Field(..., ge=0)
    resulting_delay_days: float = Field(..., ge=0)
    budget_limit: float = Field(...,gt=0)
    max_delay_limit: float = Field(...,gt=0)