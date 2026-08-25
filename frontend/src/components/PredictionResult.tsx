
"use client";

import { useState } from "react";
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

  async function handleGeneratePrescriptions() {
    if (predictedDelay === undefined) {
      setError("Predicted delay is unavailable.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

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

  async function handleExecuteDecision() {
    if (!prescription) return;

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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            AI Prediction
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {isHighRisk
              ? "Shipment At Risk"
              : "Shipment On Track"}
          </h3>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            isHighRisk
              ? "bg-red-400/10 text-red-400"
              : "bg-emerald-400/10 text-emerald-400"
          }`}
        >
          {isHighRisk ? "HIGH RISK" : "LOW RISK"}
        </div>
      </div>

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
            className="h-full rounded-full bg-cyan-400 transition-all"
            style={{
              width: `${riskPercent}%`,
            }}
          />
        </div>
      </div>

      {predictedDelay !== undefined && (
        <div className="mt-6 rounded-xl bg-[#10283b] p-5">
          <p className="text-xs text-slate-500">
            Predicted Delay
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {predictedDelay.toFixed(2)}
            <span className="ml-2 text-base font-normal text-slate-500">
              days
            </span>
          </p>
        </div>
      )}

      {isHighRisk && (
        <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
          <p className="text-sm font-semibold text-cyan-400">
            Prescriptive action available
          </p>

          <p className="mt-1 text-sm text-slate-400">
            The optimization engine will evaluate cost,
            speed and business constraints.
          </p>

          <button
            onClick={handleGeneratePrescriptions}
            disabled={loading}
            className="mt-4 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {loading
              ? "Optimizing..."
              : "Generate Prescriptions →"}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-400/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-lg bg-emerald-400/10 p-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      {prescription && (
        <div className="mt-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Optimization Result
            </p>

            <h4 className="mt-1 text-xl font-semibold text-white">
              {prescription.recommended_option.name}
            </h4>

            <p className="mt-1 text-sm text-slate-400">
              Recommended by the optimization engine
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {prescription.alternatives.map(
              (option) => (
                <div
                  key={option.id}
                  className={`rounded-xl border p-4 ${
                    option.selected_by_solver
                      ? "border-cyan-400 bg-cyan-400/5"
                      : "border-[#18334a] bg-[#10283b]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      Option {option.id}
                    </span>

                    {option.selected_by_solver && (
                      <span className="text-xs font-semibold text-cyan-400">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <p className="mt-3 font-medium text-white">
                    {option.name}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    <p>
                      Cost:{" "}
                      <span className="text-white">
                        $
                        {option.cost.toLocaleString()}
                      </span>
                    </p>

                    <p>
                      Resulting delay:{" "}
                      <span className="text-white">
                        {option.resulting_delay} days
                      </span>
                    </p>

                    <p>
                      Budget remaining:{" "}
                      <span className="text-white">
                        $
                        {option.budget_remaining.toLocaleString()}
                      </span>
                    </p>

                    <p>
                      Objective score:{" "}
                      <span className="text-white">
                        {option.objective_score}
                      </span>
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5">
            <p className="text-sm font-semibold text-emerald-400">
              Recommended Decision
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              {prescription.recommended_option.name}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Cost: $
              {prescription.recommended_option.cost.toLocaleString()}
              {" • "}
              Resulting delay:{" "}
              {prescription.recommended_option.resulting_delay} days
            </p>

            <button
              onClick={handleExecuteDecision}
              disabled={executing}
              className="mt-4 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {executing
                ? "Executing Decision..."
                : "Execute Recommended Decision"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

