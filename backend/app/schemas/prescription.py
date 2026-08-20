from pydantic import BaseModel, Field
class PrescriptionRequest(BaseModel):
    delay_days:float = Field(..., ge=0)
    budget:float= Field(20000,ge=0)
    max_delay_days: float =Field(30,ge=0)