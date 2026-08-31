"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
  const [data, setData] =
    useState<AnalyticsSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/analytics/summary`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load decision analytics"
          );
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

  if (loading) {
    return (
      <div
        id="roi"
        className="mt-6 rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6"
      >
        <div className="py-10 text-center text-sm text-slate-500">
          Loading decision analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        id="roi"
        className="mt-6 rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6"
      >
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const delayChartData = [
    {
      name: "Predicted Delay",
      days: data.average_predicted_delay,
    },
    {
      name: "Resulting Delay",
      days: data.average_resulting_delay,
    },
  ];

  const optionChartData = Object.entries(
    data.option_breakdown
  ).map(([name, count]) => ({
    name,
    decisions: count,
  }));

  const delayReduction =
    data.average_predicted_delay -
    data.average_resulting_delay;

  const reductionPercent =
    data.average_predicted_delay > 0
      ? (delayReduction /
          data.average_predicted_delay) *
        100
      : 0;

  return (
    <div
      id="roi"
      className="mt-6 rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6"
    >
      {/* HEADER */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-cyan-400">
          Operational Analytics
        </p>

        <h3 className="mt-1 text-xl font-semibold text-white">
          Decision ROI
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Business impact of executed prescriptive decisions
        </p>
      </div>

      {/* KPI CARDS */}
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

      {/* CHARTS */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* DELAY CHART */}
        <div className="rounded-xl border border-[#18334a] bg-[#091827] p-5">
          <div className="mb-5">
            <h4 className="font-semibold text-white">
              Delay Improvement
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Predicted delay vs resulting delay
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={delayChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#18334a"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: "#18334a",
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: "#18334a",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#091827",
                    border:
                      "1px solid #18334a",
                    borderRadius: "10px",
                    color: "#ffffff",
                  }}
                  formatter={(value) => [
                    `${Number(value).toFixed(2)} days`,
                    "Delay",
                  ]}
                />

                <Legend />

                <Bar
                  dataKey="days"
                  name="Delay"
                  fill="#22d3ee"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* IMPACT */}
          <div className="mt-5 rounded-lg bg-emerald-400/5 p-4">
            <p className="text-xs text-slate-500">
              Delay Reduction
            </p>

            <p className="mt-1 text-xl font-bold text-emerald-400">
              {delayReduction.toFixed(2)} days
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Approximately{" "}
              {reductionPercent.toFixed(1)}%
              improvement from predicted delay
            </p>
          </div>
        </div>

        {/* OPTION CHART */}
        <div className="rounded-xl border border-[#18334a] bg-[#091827] p-5">
          <div className="mb-5">
            <h4 className="font-semibold text-white">
              Executed Options
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Distribution of operational decisions
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={optionChartData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#18334a"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: "#18334a",
                  }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: "#18334a",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#091827",
                    border:
                      "1px solid #18334a",
                    borderRadius: "10px",
                    color: "#ffffff",
                  }}
                  formatter={(value) => [
                    `${Number(value)} decisions`,
                    "Executed",
                  ]}
                />

                <Bar
                  dataKey="decisions"
                  name="Executed Decisions"
                  fill="#22d3ee"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* OPERATIONAL IMPACT */}
      <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <p className="text-sm font-semibold text-emerald-400">
          Operational Impact
        </p>

        <p className="mt-2 text-sm text-slate-300">
          The prescriptive engine reduced the average
          observed delay from{" "}
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
          Total decisions:{" "}
          {data.total_decisions} • Total cost: $
          {data.total_decision_cost.toLocaleString()} •
          Constraint compliance:{" "}
          {data.constraint_compliance_percent}%
        </p>
      </div>
    </div>
  );
}
/* =========================
   ROI CARD
========================= */
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
    <div className="rounded-xl border border-[#18334a] bg-[#091827] p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">
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