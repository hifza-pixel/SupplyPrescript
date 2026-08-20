from fastapi import APIRouter
from app.schemas.prescription import PrescriptionRequest
from app.optimization.prescriptive_solver import generate_prescriptions
router=APIRouter(
    prefix="/api/prescriptions",
    tags=["Prescriptive Analytics"],
)
@router.post("")
def create_prescription(data:PrescriptionRequest,):
    result= generate_prescriptions(
        delay_days=data.delay_days,
        budget=data.budget,
        max_delay_days=data.max_delay_days,
    )
    return result