"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface AnalyticsSummary {
total_decisions: number;
high_risk_decisions: number;
total_decision_cost: number;
average_predicted_delay: number;
average_resulting_delay: number;
constraint_compliance_percent: number;
option_breakdown: Record<string, number>;
}

export default function DecisionROI() {
const [data, setData] = useState<AnalyticsSummary | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
async function loadSummary() {
try {
const response = await fetch(
`${API_BASE_URL}/api/analytics/summary`
);
    if (!response.ok) {
      throw new Error("Unable to load decision analytics");
    }
    const result = await response.json();
    setData(result);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to load decision analytics"
    );
  } finally {
    setLoading(false);
  }
}
loadSummary();
}, []);
return ( <div
   id="roi"
   className="mt-6 rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6"
 > <div className="mb-6"> <p className="text-xs uppercase tracking-wider text-cyan-400">
Operational Analytics 
</p>
    <h3 className="mt-1 text-xl font-semibold text-white">
      Decision ROI
    </h3>

    <p className="mt-1 text-sm text-slate-500">
      Business impact of executed prescriptive decisions
    </p>
  </div>

  {loading && (
    <div className="py-10 text-center text-sm text-slate-500">
      Loading decision analytics...
    </div>
  )}

  {error && (
    <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
      {error}
    </div>
  )}

  {data && !loading && !error && (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ROICard
          title="Total Decisions"
          value={data.total_decisions.toLocaleString()}
          detail="Executed decisions"
        />

        <ROICard
          title="Decision Cost"
          value={`$${data.total_decision_cost.toLocaleString()}`}
          detail="Total operational spend"
        />

        <ROICard
          title="Average Delay"
          value={`${data.average_resulting_delay} days`}
          detail={`Predicted ${data.average_predicted_delay} days`}
        />

        <ROICard
          title="Constraint Compliance"
          value={`${data.constraint_compliance_percent}%`}
          detail="Decisions within limits"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#18334a] bg-[#091827] p-5">
          <h4 className="font-semibold text-white">
            Delay Improvement
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Average predicted delay compared with resulting delay
          </p>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  Predicted
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {data.average_predicted_delay} days
                </p>
              </div>

              <div className="text-cyan-400">
                →
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500">
                  Resulting
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-400">
                  {data.average_resulting_delay} days
                </p>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{
                  width: `${Math.min(
                    100,
                    (data.average_resulting_delay /
                      Math.max(
                        data.average_predicted_delay,
                        1
                      )) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#18334a] bg-[#091827] p-5">
          <h4 className="font-semibold text-white">
            Executed Options
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Distribution of operational decisions
          </p>

          <div className="mt-5 space-y-3">
            {Object.entries(data.option_breakdown).map(
              ([option, count]) => (
                <div
                  key={option}
                  className="flex items-center justify-between rounded-lg border border-[#18334a] bg-[#0d1d2d] px-4 py-3"
                >
                  <span className="text-sm text-slate-300">
                    {option}
                  </span>

                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                    {count} decisions
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <p className="text-sm font-semibold text-emerald-400">
          Operational Impact
        </p>
        <p className="mt-2 text-sm text-slate-300">
          The prescriptive engine reduced the average observed
          delay from{" "}
          <span className="font-semibold text-white">
            {data.average_predicted_delay} days
          </span>{" "}
          to{" "}
          <span className="font-semibold text-emerald-400">
            {data.average_resulting_delay} days
          </span>
          .
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Constraint compliance:
          {" "}
          {data.constraint_compliance_percent}%
        </p>
      </div>
    </>
  )}
</div>
);
}
function ROICard({
title,
value,
detail,
}: {
title: string;
value: string;
detail: string;
}) {
return ( 
<div className="rounded-xl border border-[#18334a] bg-[#091827] p-4"> <p className="text-xs uppercase tracking-wider text-slate-500">
{title}
 </p>
  <p className="mt-2 text-2xl font-bold text-cyan-400">
    {value}
  </p>
  <p className="mt-1 text-xs text-slate-500">
    {detail}
  </p>
</div>
);
}
