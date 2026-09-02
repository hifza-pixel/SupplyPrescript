"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  DollarSign,
  ShieldCheck,
  Zap,
} from "lucide-react";

import {
  generatePrescriptions,
  PrescriptionResponse,
} from "@/services/prescriptionService";

import { executeDecision } from "@/services/decisionService";

interface PredictionResultProps {
  prediction: number;
  probability?: number;
  predictedDelay?: number;
}

export default function PredictionResult({
  prediction,
  probability,
  predictedDelay,
}: PredictionResultProps) {
  const [prescription, setPrescription] =
    useState<PrescriptionResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isHighRisk = prediction === 1;

  const riskPercent =
    probability !== undefined
      ? Math.round(probability * 100)
      : isHighRisk
        ? 75
        : 25;

  function getRiskLabel() {
    if (riskPercent >= 75) return "HIGH RISK";
    if (riskPercent >= 45) return "MEDIUM RISK";
    return "LOW RISK";
  }

  function getRiskStyles() {
    if (riskPercent >= 75) {
      return {
        badge:
          "bg-red-400/10 text-red-400 border-red-400/20",
        bar: "bg-red-400",
        icon: "text-red-400",
      };
    }

    if (riskPercent >= 45) {
      return {
        badge:
          "bg-amber-400/10 text-amber-400 border-amber-400/20",
        bar: "bg-amber-400",
        icon: "text-amber-400",
      };
    }

    return {
      badge:
        "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
      bar: "bg-emerald-400",
      icon: "text-emerald-400",
    };
  }

  const riskStyles = getRiskStyles();
  const riskLabel = getRiskLabel();

  // ==========================================
  // GENERATE PRESCRIPTIONS
  // ==========================================

  async function handleGeneratePrescriptions() {
    if (predictedDelay === undefined) {
      setError("Predicted delay is unavailable.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setPrescription(null);

    try {
      const result = await generatePrescriptions({
        delay_days: predictedDelay,
        budget: 20000,
        max_delay_days: 30,
      });

      setPrescription(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate prescriptions."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // EXECUTE DECISION
  // ==========================================

  async function handleExecuteDecision() {
    if (!prescription?.recommended_option) {
      setError("No recommended decision is available.");
      return;
    }

    const recommended =
      prescription.recommended_option;

    setExecuting(true);
    setError("");
    setSuccess("");

    try {
      await executeDecision({
        shipment_id: `SHIP-${Date.now()}`,
        option_id: recommended.id,
        option_name: recommended.name,
        predicted_delay_days:
          prescription.delay_days_predicted,
        decision_cost: recommended.cost,
        resulting_delay_days:
          recommended.resulting_delay,
        budget_limit:
          prescription.budget_constraint,
        max_delay_limit:
          prescription.max_delay_constraint,
      });

      setSuccess(
        "Decision executed and saved successfully."
      );

      // Notify DecisionHistory to refresh automatically
      window.dispatchEvent(
        new CustomEvent("decision-executed")
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Decision execution failed."
      );
    } finally {
      setExecuting(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6">

      {/* ========================================== */}
      {/* AI PREDICTION HEADER */}
      {/* ========================================== */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            AI Prediction
          </p>

          <h3 className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
            {isHighRisk ? (
              <AlertTriangle
                size={23}
                className={riskStyles.icon}
              />
            ) : (
              <CheckCircle2
                size={23}
                className={riskStyles.icon}
              />
            )}

            {isHighRisk
              ? "Shipment At Risk"
              : "Shipment On Track"}
          </h3>
        </div>

        <div
          className={`rounded-full border px-4 py-2 text-xs font-bold ${riskStyles.badge}`}
        >
          {riskLabel}
        </div>
      </div>

      {/* ========================================== */}
      {/* DELAY PROBABILITY */}
      {/* ========================================== */}

      <div className="mt-8">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-400">
            Delay Probability
          </span>

          <span className="font-semibold text-white">
            {riskPercent}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${riskStyles.bar}`}
            style={{
              width: `${Math.min(
                Math.max(riskPercent, 0),
                100
              )}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-slate-600">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      {/* ========================================== */}
      {/* PREDICTION METRICS */}
      {/* ========================================== */}

      {predictedDelay !== undefined && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <div className="rounded-xl border border-[#18334a] bg-[#10283b] p-5">
            <div className="flex items-center gap-2">
              <Clock3
                size={17}
                className="text-cyan-400"
              />

              <p className="text-xs uppercase tracking-wider text-slate-500">
                Predicted Delay
              </p>
            </div>

            <p className="mt-2 text-3xl font-bold text-white">
              {predictedDelay.toFixed(2)}

              <span className="ml-2 text-base font-normal text-slate-500">
                days
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-[#18334a] bg-[#10283b] p-5">
            <div className="flex items-center gap-2">
              <Zap
                size={17}
                className="text-cyan-400"
              />

              <p className="text-xs uppercase tracking-wider text-slate-500">
                ML Classification
              </p>
            </div>

            <p className="mt-2 text-2xl font-bold text-white">
              {prediction === 1
                ? "Delayed"
                : "On Time"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Random Forest prediction
            </p>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* PRESCRIPTION ACTION */}
      {/* ========================================== */}

      {isHighRisk && (
        <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-cyan-400/10 p-2">
              <Zap
                size={18}
                className="text-cyan-400"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-cyan-400">
                Prescriptive action available
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                The optimization engine will evaluate
                cost, speed, budget and maximum delay
                constraints before recommending the
                best intervention.
              </p>
            </div>
          </div>

          <button
            onClick={handleGeneratePrescriptions}
            disabled={
              loading || predictedDelay === undefined
            }
            className="mt-4 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Running Optimization Engine..."
              : "Generate Prescriptions →"}
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* ERROR */}
      {/* ========================================== */}

      {error && (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ========================================== */}
      {/* SUCCESS */}
      {/* ========================================== */}

      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-400">
          <CheckCircle2 size={17} />
          {success}
        </div>
      )}

      {/* ========================================== */}
      {/* OPTIMIZATION RESULT */}
      {/* ========================================== */}

      {prescription && (
        <div className="mt-7">

          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Prescriptive Optimization
            </p>

            <h4 className="mt-2 text-xl font-semibold text-white">
              Optimization Engine Result
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Solver: {prescription.solver}
            </p>
          </div>

          {/* ========================================== */}
          {/* RECOMMENDED OPTION */}
          {/* ========================================== */}

          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-5">

            <div className="flex items-start justify-between gap-4">

              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={19}
                    className="text-cyan-400"
                  />

                  <p className="text-xs uppercase tracking-wider text-cyan-400">
                    Recommended Decision
                  </p>
                </div>

                <h5 className="mt-3 text-2xl font-bold text-white">
                  {prescription.recommended_option.name}
                </h5>

                <p className="mt-1 text-sm text-slate-400">
                  Selected by SciPy HiGHS optimization
                  engine
                </p>
              </div>

              <div className="rounded-xl bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-400">
                RANK #1
              </div>

            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              <Metric
                icon={<DollarSign size={16} />}
                label="Decision Cost"
                value={`₹${prescription.recommended_option.cost.toLocaleString()}`}
              />

              <Metric
                icon={<Clock3 size={16} />}
                label="Resulting Delay"
                value={`${prescription.recommended_option.resulting_delay} days`}
              />

              <Metric
  icon={<ShieldCheck size={16} />}
  label="Budget Remaining"
  value={`₹${(
    prescription.budget_constraint -
    prescription.recommended_option.cost
  ).toLocaleString()}`}
/>

            </div>
          </div>

          {/* ========================================== */}
          {/* ALTERNATIVES */}
          {/* ========================================== */}

          <div className="mt-6">

            <div className="mb-4">
              <h5 className="font-semibold text-white">
                Feasible Alternatives
              </h5>

              <p className="mt-1 text-xs text-slate-500">
                Ranked by the optimization objective
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {prescription.alternatives.map(
                (option) => (
                  <div
                    key={option.id}
                    className={`rounded-xl border p-4 ${
                      option.selected_by_solver
                        ? "border-cyan-400/40 bg-cyan-400/5"
                        : "border-[#18334a] bg-[#10283b]"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-bold text-slate-500">
                        RANK #{option.rank}
                      </span>

                      {option.selected_by_solver && (
                        <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] font-bold text-cyan-400">
                          RECOMMENDED
                        </span>
                      )}

                    </div>

                    <p className="mt-3 font-semibold text-white">
                      {option.name}
                    </p>

                    <div className="mt-4 space-y-2 text-sm">

                      <p className="flex justify-between">
                        <span className="text-slate-500">
                          Cost
                        </span>

                        <span className="text-white">
                          ₹{option.cost.toLocaleString()}
                        </span>
                      </p>

                      <p className="flex justify-between">
                        <span className="text-slate-500">
                          Resulting Delay
                        </span>

                        <span className="text-white">
                          {option.resulting_delay} days
                        </span>
                      </p>

                      <p className="flex justify-between">
                        <span className="text-slate-500">
                          Budget Remaining
                        </span>

                        <span className="text-white">
                          ₹
                          {option.budget_remaining.toLocaleString()}
                        </span>
                      </p>

                      <p className="flex justify-between">
                        <span className="text-slate-500">
                          Objective Score
                        </span>

                        <span className="font-semibold text-cyan-400">
                          {option.objective_score}
                        </span>
                      </p>

                    </div>
                  </div>
                )
              )}

            </div>
          </div>

          {/* ========================================== */}
          {/* EXECUTE DECISION */}
          {/* ========================================== */}

          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">

            <div className="flex items-start gap-3">

              <div className="rounded-lg bg-emerald-400/10 p-2">
                <CheckCircle2
                  size={19}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-emerald-400">
                  Execute Recommended Decision
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  This sends the optimized decision to
                  the backend and writes the operational
                  decision into the database.
                </p>
              </div>

            </div>

            <button
              onClick={handleExecuteDecision}
              disabled={executing}
              className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {executing
                ? "Executing Decision..."
                : "Execute Recommended Decision"}
            </button>

          </div>

          {/* ========================================== */}
          {/* CONSTRAINT SUMMARY */}
          {/* ========================================== */}

          <div className="mt-6 rounded-xl border border-[#18334a] bg-[#10283b] p-5">

            <div className="flex items-center gap-2">
              <ShieldCheck
                size={18}
                className="text-cyan-400"
              />

              <h5 className="font-semibold text-white">
                Constraint Audit
              </h5>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              <AuditItem
                label="Budget Constraint"
                value={`₹${prescription.budget_constraint.toLocaleString()}`}
              />

              <AuditItem
                label="Maximum Delay"
                value={`${prescription.max_delay_constraint} days`}
              />

              <AuditItem
                label="Predicted Delay"
                value={`${prescription.delay_days_predicted} days`}
              />

              <AuditItem
                label="Optimization Objective"
                value={`${prescription.objective_weights.cost * 100}% Cost / ${prescription.objective_weights.delay * 100}% Delay`}
              />

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

/* ========================================== */
/* METRIC COMPONENT */
/* ========================================== */

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#18334a] bg-[#0d1d2d] p-4">

      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-2 font-semibold text-white">
        {value}
      </p>

    </div>
  );
}

/* ========================================== */
/* AUDIT COMPONENT */
/* ========================================== */

function AuditItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#18334a] bg-[#0d1d2d] px-4 py-3">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-white">
        {value}
      </span>

    </div>
  );
}