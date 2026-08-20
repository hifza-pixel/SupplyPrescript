from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.decision import Decision
from app.schemas.decision import (
    DecisionExecuteRequest,
)
router = APIRouter(
    prefix="/api/decisions",
    tags=["Decision Execution"],
)
@router.post("/execute")
def execute_decision(
    data: DecisionExecuteRequest,
    db: Session = Depends(get_db),
):
    if data.decision_cost > data.budget_limit:
        raise HTTPException(
            status_code=400,
            detail="Decision violates budget constraint.",
        )
    if data.resulting_delay_days > data.max_delay_limit:
        raise HTTPException(
            status_code=400,
            detail="Decision violates maximum delay constraint.",
        )
    decision = Decision(
        shipment_id=data.shipment_id,
        option_id=data.option_id,
        option_name=data.option_name,
        predicted_delay_days=data.predicted_delay_days,
        decision_cost=data.decision_cost,
        resulting_delay_days=data.resulting_delay_days,
        budget_limit=data.budget_limit,
        max_delay_limit=data.max_delay_limit,
        status="EXECUTED",
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)
    return {
        "status": "success",
        "message": "Decision executed and written back successfully.",
        "decision_id": decision.id,
        "decision": {
            "option_id": decision.option_id,
            "option_name": decision.option_name,
            "cost": decision.decision_cost,
            "predicted_delay_days": decision.predicted_delay_days,
            "resulting_delay_days": decision.resulting_delay_days,
            "status": decision.status,
        },
    }
@router.get("")
def get_decision_history(
    db: Session = Depends(get_db),
):
    decisions = (
        db.query(Decision)
        .order_by(Decision.created_at.desc())
        .all()
    )
    return {
        "count": len(decisions),
        "decisions": [
            {
                "id": decision.id,
                "shipment_id": decision.shipment_id,
                "option_id": decision.option_id,
                "option_name": decision.option_name,
                "predicted_delay_days": decision.predicted_delay_days,
                "decision_cost": decision.decision_cost,
                "resulting_delay_days": decision.resulting_delay_days,
                "budget_limit": decision.budget_limit,
                "max_delay_limit": decision.max_delay_limit,
                "status": decision.status,
                "created_at": decision.created_at,
            }
            for decision in decisions
        ],
    }