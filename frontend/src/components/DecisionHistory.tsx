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
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDecisions() {
    setLoading(true);
    setError("");

    try {
      const response = await getDecisionHistory();
      setDecisions(response.decisions);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load decision history"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchDecisions() {
      try {
        const response = await getDecisionHistory();

        if (!cancelled) {
          setDecisions(response.decisions);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load decision history"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDecisions();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">
            Decision History
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Operational decisions written back to the database
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDecisions}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-[#24445c] px-3 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />

            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <Database
            className="text-cyan-400"
            size={20}
          />
        </div>
      </div>

      {loading && (
        <div className="py-10 text-center text-sm text-slate-500">
          Loading database records...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        decisions.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-500">
            No operational decisions found.
          </div>
        )}

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
                    className="border-b border-[#18334a]/60 hover:bg-white/5"
                  >
                    <td className="px-3 py-4">
                      <div className="font-medium text-white">
                        {decision.shipment_id}
                      </div>

                      <div className="text-xs text-slate-600">
                        Decision #{decision.id}
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <div className="font-medium text-cyan-400">
                        {decision.option_name}
                      </div>

                      <div className="text-xs text-slate-500">
                        Option {decision.option_id}
                      </div>
                    </td>

                    <td className="px-3 py-4 text-slate-300">
                      {decision.predicted_delay_days} days
                    </td>

                    <td className="px-3 py-4 text-slate-300">
                      $
                      {decision.decision_cost.toLocaleString()}
                    </td>

                    <td className="px-3 py-4 text-slate-300">
                      {decision.resulting_delay_days} days
                    </td>

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

      {!loading &&
        !error &&
        decisions.length > 0 && (
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-600">
            <Clock size={13} />
            Live data from operational database
          </div>
        )}
    </div>
  );
}