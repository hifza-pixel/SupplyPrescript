from app.optimization.prescriptive_solver import generate_prescriptions
def run_audit():
    result = generate_prescriptions(
        delay_days=14,
        budget=20000,
        max_delay_days=30,
    )
    print("\n========== CONSTRAINT AUDIT ==========\n")
    print("Solver Status:", result["status"])
    print("Solver:", result.get("solver"))
    for item in result["constraint_audit"]:
        print(
            f"\nOption {item['option_id']}: "
            f"{item['option_name']}"
        )
        print(
            "  Cost:",
            item["cost"],
            "/ Budget:",
            item["budget_limit"],
        )
        print(
            "  Resulting Delay:",
            item["resulting_delay"],
            "/ Maximum:",
            item["delay_limit"],
        )
        print(
            "  Budget Constraint:",
            "PASS"
            if item["budget_feasible"]
            else "FAIL",
        )
        print(
            "  Delay Constraint:",
            "PASS"
            if item["delay_feasible"]
            else "FAIL",
        )
        print("Overall:", item["status"],)
        if item["violations"]:
            print("Violations:", ", ".join(item["violations"]),)
    print("\n========== RECOMMENDATION ==========\n")
    print(result["recommended_option"])
if __name__ == "__main__":
    run_audit()