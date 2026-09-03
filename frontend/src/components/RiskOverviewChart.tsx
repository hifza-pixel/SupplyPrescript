"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

interface RiskDistribution {
  total: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
}

export default function RiskOverviewChart() {
  const [data, setData] =
    useState<RiskDistribution | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
  async function loadRiskDistribution() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/analytics/risk-distribution`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load risk distribution"
        );
      }

      const result = await response.json();

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load risk distribution"
      );
    } finally {
      setLoading(false);
    }
  }

  loadRiskDistribution();

  function handleDecisionExecuted() {
    loadRiskDistribution();
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-[#24445c] bg-[#091827]">
        <p className="text-sm text-slate-500">
          Loading risk analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/5">
        <p className="text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }

  if (!data || data.total === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[#24445c]">
        <div className="text-center">
          <MinusCircle
            className="mx-auto mb-3 text-slate-600"
            size={42}
          />

          <p className="text-sm text-slate-400">
            No risk decisions available
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Execute a decision to populate analytics
          </p>
        </div>
      </div>
    );
  }

  const highPercent =
    (data.high_risk / data.total) * 100;

  const mediumPercent =
    (data.medium_risk / data.total) * 100;

  const lowPercent =
    (data.low_risk / data.total) * 100;

  return (
    <div className="space-y-6">

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-3">

        <RiskCard
          label="High Risk"
          value={data.high_risk}
          percent={highPercent}
          icon={<AlertTriangle size={18} />}
          className="text-red-400"
        />

        <RiskCard
          label="Medium Risk"
          value={data.medium_risk}
          percent={mediumPercent}
          icon={<MinusCircle size={18} />}
          className="text-yellow-400"
        />

        <RiskCard
          label="Low Risk"
          value={data.low_risk}
          percent={lowPercent}
          icon={<CheckCircle2 size={18} />}
          className="text-emerald-400"
        />

      </div>

      {/* BAR CHART */}
      <div className="rounded-xl border border-[#18334a] bg-[#091827] p-5">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Risk Distribution
            </p>

            <h4 className="mt-1 font-semibold text-white">
              Executed Decision Risk
            </h4>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">
              Total
            </p>

            <p className="text-xl font-bold text-white">
              {data.total}
            </p>
          </div>

        </div>

        <RiskBar
          label="High Risk"
          value={data.high_risk}
          percent={highPercent}
          barClass="bg-red-400"
          textClass="text-red-400"
        />

        <RiskBar
          label="Medium Risk"
          value={data.medium_risk}
          percent={mediumPercent}
          barClass="bg-yellow-400"
          textClass="text-yellow-400"
        />

        <RiskBar
          label="Low Risk"
          value={data.low_risk}
          percent={lowPercent}
          barClass="bg-emerald-400"
          textClass="text-emerald-400"
        />

      </div>

    </div>
  );
}


/* =========================
   RISK CARD
========================= */

function RiskCard({
  label,
  value,
  percent,
  icon,
  className,
}: {
  label: string;
  value: number;
  percent: number;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <div className="rounded-xl border border-[#18334a] bg-[#091827] p-4">

      <div
        className={`mb-3 flex items-center gap-2 ${className}`}
      >
        {icon}

        <span className="text-xs font-semibold">
          {label}
        </span>
      </div>

      <p className="text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {percent.toFixed(1)}%
      </p>

    </div>
  );
}


/* =========================
   RISK BAR
========================= */

function RiskBar({
  label,
  value,
  percent,
  barClass,
  textClass,
}: {
  label: string;
  value: number;
  percent: number;
  barClass: string;
  textClass: string;
}) {
  return (
    <div className="mb-5">

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm text-slate-300">
          {label}
        </span>

        <span
          className={`text-sm font-semibold ${textClass}`}
        >
          {value} ({percent.toFixed(1)}%)
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">

        <div
          className={`h-full rounded-full transition-all duration-700 ${barClass}`}
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

    </div>
  );
}