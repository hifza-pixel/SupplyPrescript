"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Database,
  RefreshCw,
} from "lucide-react";

import {
  Decision,
  getDecisionHistory,
} from "@/services/decisionService";

export default function DecisionHistory() {
  const [decisions, setDecisions] =
    useState<Decision[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  async function loadDecisions(
    showRefreshing = false
  ) {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getDecisionHistory();

      setDecisions(response.decisions);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load decision history"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Initial database load
  // ==========================================
// INITIAL DATABASE LOAD
// ==========================================

useEffect(() => {
  let cancelled = false;

  async function initialLoad() {
    try {
      const response = await getDecisionHistory();

      if (!cancelled) {
        setDecisions(response.decisions);
        setError("");
        setLoading(false);
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load decision history"
        );
        setLoading(false);
      }
    }
  }

  initialLoad();

  return () => {
    cancelled = true;
  };
}, []);

// ==========================================
// LISTEN FOR NEW EXECUTED DECISIONS
// ==========================================

useEffect(() => {
  function handleDecisionExecuted() {
    loadDecisions(true);
  }

  window.addEventListener(
    "decision-executed",
    handleDecisionExecuted
  );

  return () => {
    window.removeEventListener(
      "decision-executed",
      handleDecisionExecuted
    );
  };
}, []);

  return (
    <div className="rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-cyan-400/10 p-2">
            <Database
              className="text-cyan-400"
              size={20}
            />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Decision History
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Operational decisions written back to
              the database
            </p>
          </div>

        </div>

        <button
          onClick={() => loadDecisions(true)}
          disabled={refreshing}
          title="Refresh decision history"
          className="rounded-lg border border-[#18334a] p-2 text-slate-400 transition hover:bg-white/5 hover:text-cyan-400 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />
        </button>

      </div>

      {/* ========================================== */}
      {/* LOADING */}
      {/* ========================================== */}

      {loading && (
        <div className="py-10 text-center">

          <RefreshCw
            className="mx-auto mb-3 animate-spin text-cyan-400"
            size={22}
          />

          <p className="text-sm text-slate-500">
            Loading database records...
          </p>

        </div>
      )}

      {/* ========================================== */}
      {/* ERROR */}
      {/* ========================================== */}

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4">

          <p className="text-sm font-medium text-red-400">
            Unable to load decision history
          </p>

          <p className="mt-1 text-xs text-red-400/70">
            {error}
          </p>

          <button
            onClick={() => loadDecisions(true)}
            className="mt-3 rounded-lg border border-red-400/20 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-400/10"
          >
            Try Again
          </button>

        </div>
      )}

      {/* ========================================== */}
      {/* EMPTY STATE */}
      {/* ========================================== */}

      {!loading &&
        !error &&
        decisions.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#24445c] py-12 text-center">

            <Database
              className="mx-auto mb-3 text-slate-600"
              size={30}
            />

            <p className="text-sm text-slate-400">
              No operational decisions found.
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Execute a recommended decision to
              create the first database record.
            </p>

          </div>
        )}

      {/* ========================================== */}
      {/* DECISION TABLE */}
      {/* ========================================== */}

      {!loading &&
        !error &&
        decisions.length > 0 && (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead>
                <tr className="border-b border-[#18334a] text-xs uppercase tracking-wider text-slate-500">

                  <th className="px-3 py-3">
                    Shipment
                  </th>

                  <th className="px-3 py-3">
                    Decision
                  </th>

                  <th className="px-3 py-3">
                    Predicted Delay
                  </th>

                  <th className="px-3 py-3">
                    Cost
                  </th>

                  <th className="px-3 py-3">
                    Resulting Delay
                  </th>

                  <th className="px-3 py-3">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {decisions.map((decision) => (
                  <tr
                    key={decision.id}
                    className="border-b border-[#18334a]/60 transition hover:bg-white/2"
                  >

                    {/* SHIPMENT */}

                    <td className="px-3 py-4">

                      <div className="font-medium text-white">
                        {decision.shipment_id ||
                          "Unknown Shipment"}
                      </div>

                      <div className="text-xs text-slate-600">
                        Decision #{decision.id}
                      </div>

                    </td>

                    {/* DECISION */}

                    <td className="px-3 py-4">

                      <div className="font-medium text-cyan-400">
                        {decision.option_name}
                      </div>

                      <div className="text-xs text-slate-500">
                        Option {decision.option_id}
                      </div>

                    </td>

                    {/* PREDICTED DELAY */}

                    <td className="px-3 py-4 text-slate-300">
                      {decision.predicted_delay_days}{" "}
                      days
                    </td>

                    {/* COST */}

                    <td className="px-3 py-4 text-slate-300">
                      ₹
                      {decision.decision_cost.toLocaleString()}
                    </td>

                    {/* RESULTING DELAY */}

                    <td className="px-3 py-4 text-slate-300">
                      {decision.resulting_delay_days}{" "}
                      days
                    </td>

                    {/* STATUS */}

                    <td className="px-3 py-4">

                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">

                        <CheckCircle2 size={13} />

                        {decision.status}

                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      {/* ========================================== */}
      {/* FOOTER */}
      {/* ========================================== */}

      {!loading &&
        !error &&
        decisions.length > 0 && (
          <div className="mt-5 flex items-center justify-between">

            <div className="flex items-center gap-2 text-xs text-slate-600">

              <Clock size={13} />

              Live data from operational database

            </div>

            <span className="text-xs text-slate-600">
              {decisions.length} decision
              {decisions.length !== 1
                ? "s"
                : ""}
            </span>

          </div>
        )}

    </div>
  );
}