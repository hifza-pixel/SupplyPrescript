import numpy as np
from scipy.optimize import linprog
def generate_prescriptions(
    delay_days: float,
    budget: float = 20000,
    max_delay_days: float = 30,
):
    """
    SupplyPrescript mathematical optimization engine.
    Decision variables:
        x_A = Air Freight
        x_B = Secondary Supplier
        x_C = Delay Product Launch
    Exactly one intervention must be selected.
    Objective:
        Minimize weighted business cost + resulting delay.
    Hard constraints:
        - Budget
        - Maximum acceptable delay
        - Exactly one decision
    """
    options = [
        {
            "id": "A",
            "name": "Air Freight",
            "cost": 15000,
            "resulting_delay": 3,
            "speed_score": 0.95,
        },
        {
            "id": "B",
            "name": "Secondary Supplier",
            "cost": 12000,
            "resulting_delay": 7,
            "speed_score": 0.80,
        },
        {
            "id": "C",
            "name": "Delay Product Launch",
            "cost": 8000,
            "resulting_delay": delay_days,
            "speed_score": 0.30,
        },
    ]
    cost_weight = 0.55
    delay_weight = 0.45
    objective = np.array(
        [
            (
                cost_weight * (option["cost"] / budget)
                + delay_weight
                * (
                    option["resulting_delay"]
                    / max_delay_days
                )
            )
            for option in options
        ])
    A_eq = np.array(
        [
            [1, 1, 1]
        ])
    b_eq = np.array([1])
    A_budget = np.array([[
                option["cost"]
                for option in options
            ]])
    b_budget = np.array([budget])
    A_delay = np.array([[
                option["resulting_delay"]
                for option in options
            ]])
    b_delay = np.array(
        [max_delay_days]
    )
    A_ub = np.vstack([
            A_budget,
            A_delay,
        ])
    b_ub = np.concatenate([
            b_budget,
            b_delay,
        ])
    bounds = [
        (0, 1),
        (0, 1),
        (0, 1),
    ]
    result = linprog(
        c=objective,
        A_ub=A_ub,
        b_ub=b_ub,
        A_eq=A_eq,
        b_eq=b_eq,
        bounds=bounds,
        method="highs",
    )
    if not result.success:
        return {
            "status": "infeasible",
            "message": result.message,
            "alternatives": [],
        }
    selected_index = int(
        np.argmax(result.x)
    )
    optimal_option = options[
        selected_index
    ]
    alternatives = []
    for index, option in enumerate(options):
        if option["cost"] > budget:
            continue
        if (
            option["resulting_delay"]
            > max_delay_days
        ):
            continue
        option_score = float(
            objective[index]
        )
        alternatives.append(
            {
                **option,
                "objective_score": round(
                    option_score,
                    4,
                ),
                "budget_remaining": round(
                    budget - option["cost"],
                    2,
                ),
                "selected_by_solver": (
                    index == selected_index
                ),
            })
    alternatives.sort(
        key=lambda x: x[
            "objective_score"
        ])
    for rank, option in enumerate(
        alternatives,
        start=1,
    ):
        option["rank"] = rank
    return {
        "status": "optimal",
        "solver": "SciPy HiGHS Linear Programming",
        "delay_days_predicted": delay_days,
        "budget_constraint": budget,
        "max_delay_constraint": max_delay_days,
        "objective_weights": {
            "cost": cost_weight,
            "delay": delay_weight,
        },
        "optimal_objective_value": round(
            float(result.fun),
            4,
        ),
        "recommended_option": {
            **optimal_option,
            "rank": 1,
        },
        "alternatives": alternatives,
    }