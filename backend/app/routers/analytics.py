from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.decision import Decision

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
)


@router.get("/summary")
def analytics_summary(
    db: Session = Depends(get_db),
):
    decisions = (
        db.query(Decision)
        .order_by(Decision.created_at.desc())
        .all()
    )

    total_decisions = len(decisions)

    high_risk_decisions = sum(
        1
        for decision in decisions
        if decision.predicted_delay_days > 30
    )

    total_decision_cost = sum(
        decision.decision_cost
        for decision in decisions
    )

    average_predicted_delay = (
        sum(
            decision.predicted_delay_days
            for decision in decisions
        ) / total_decisions
        if total_decisions > 0
        else 0
    )

    average_resulting_delay = (
        sum(
            decision.resulting_delay_days
            for decision in decisions
        ) / total_decisions
        if total_decisions > 0
        else 0
    )

    compliant_decisions = sum(
        1
        for decision in decisions
        if (
            decision.decision_cost <= decision.budget_limit
            and
            decision.resulting_delay_days <= decision.max_delay_limit
        )
    )

    constraint_compliance = (
        (compliant_decisions / total_decisions) * 100
        if total_decisions > 0
        else 0
    )

    option_breakdown = {}

    for decision in decisions:
        option_name = decision.option_name

        if option_name not in option_breakdown:
            option_breakdown[option_name] = 0

        option_breakdown[option_name] += 1

    return {
        "total_decisions": total_decisions,
        "high_risk_decisions": high_risk_decisions,
        "total_decision_cost": round(
            total_decision_cost,
            2,
        ),
        "average_predicted_delay": round(
            average_predicted_delay,
            2,
        ),
        "average_resulting_delay": round(
            average_resulting_delay,
            2,
        ),
        "constraint_compliance_percent": round(
            constraint_compliance,
            2,
        ),
        "option_breakdown": option_breakdown,
    }