"use client";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Database,
  Gauge,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Truck,
  GitBranch,
  DollarSign,
} from "lucide-react";
import PredictionPanel from "@/components/PredictionPanel";
import DecisionHistory from "@/components/DecisionHistory";
import ModelExplainability from "@/components/ModelExplainability";
import DecisionROI from "@/components/DecisionROI";
import RiskOverviewChart from "@/components/RiskOverviewChart";
import {
  AnalyticsSummary,
  getAnalyticsSummary,
} from "@/services/analyticsService";

const navigation = [
  {
    name: "Overview",
    Icon: LayoutDashboard,
    target: "overview",
  },
  {
    name: "Shipment Risk",
    Icon: AlertTriangle,
    target: "prediction",
  },
  {
    name: "Prescriptions",
    Icon: BrainCircuit,
    target: "prescriptions",
  },
  {
    name: "Decision",
    Icon: CheckCircle2,
    target: "decision",
  },
  {
    name: "Model Explainability",
    Icon: BarChart3,
    target: "explainability",
  },
  {
    name: "Decision ROI",
    Icon: Gauge,
    target: "roi",
  },
];

export default function Home() {
  const [analytics, setAnalytics] =
    useState<AnalyticsSummary | null>(null);

  const [analyticsLoading, setAnalyticsLoading] =
    useState(true);

  const [analyticsError, setAnalyticsError] =
    useState("");

  // ==========================================
  // LOAD LIVE ANALYTICS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        const response =
          await getAnalyticsSummary();

        if (!cancelled) {
          setAnalytics(response);
          setAnalyticsError("");
          setAnalyticsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setAnalyticsError(
            err instanceof Error
              ? err.message
              : "Unable to load analytics"
          );

          setAnalyticsLoading(false);
        }
      }
    }

    loadAnalytics();

    // Refresh KPIs when a new decision is executed
    function handleDecisionExecuted() {
      loadAnalytics();
    }

    window.addEventListener(
      "decision-executed",
      handleDecisionExecuted
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        "decision-executed",
        handleDecisionExecuted
      );
    };
  }, []);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="flex min-h-screen bg-[#07111f] text-[#e6f1ff]">

      {/* ========================================== */}
      {/* SIDEBAR */}
      {/* ========================================== */}

      <aside className="hidden w-64 border-r border-[#18334a] bg-[#091827] p-5 lg:block">

        <div className="mb-10 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
            <BrainCircuit
              className="text-cyan-400"
              size={23}
            />
          </div>

          <div>
            <h1 className="text-lg font-bold">
              SupplyPrescript
            </h1>

            <p className="text-xs text-slate-500">
              Closed-Loop Analytics
            </p>
          </div>

        </div>

        <nav className="space-y-2">

          {navigation.map((item) => {
            const Icon = item.Icon;

            return (
              <button
                key={item.name}
                onClick={() =>
                  scrollToSection(item.target)
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                  item.target === "overview"
                    ? "bg-cyan-400/10 text-cyan-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}

        </nav>

        <div className="mt-10 border-t border-[#18334a] pt-5">

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
            <Settings size={18} />
            Settings
          </button>

        </div>

      </aside>

      {/* ========================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================== */}

      <section className="flex-1">

        {/* HEADER */}

        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#18334a] bg-[#091827]/90 px-6 py-5 backdrop-blur">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
              Operations Control Center
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Supply Chain Intelligence
            </h2>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-400">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              System Operational

            </div>

          </div>

        </header>

        <div className="p-6">

          {/* ========================================== */}
          {/* OVERVIEW */}
          {/* ========================================== */}

          <div id="overview">

            {/* ========================================== */}
            {/* LIVE KPI CARDS */}
            {/* ========================================== */}

            {analyticsError && (
              <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
                Analytics unavailable:{" "}
                {analyticsError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <KpiCard
                title="Decisions Executed"
                value={
                  analyticsLoading
                    ? "..."
                    : (
                        analytics?.total_decisions ??
                        0
                      ).toLocaleString()
                }
                subtitle="Operational decisions"
                icon={Database}
              />

              <KpiCard
                title="High Risk Decisions"
                value={
                  analyticsLoading
                    ? "..."
                    : (
                        analytics?.high_risk_decisions ??
                        0
                      ).toLocaleString()
                }
                subtitle="Requires attention"
                icon={AlertTriangle}
              />

              <KpiCard
                title="Total Decision Cost"
                value={
                  analyticsLoading
                    ? "..."
                    : `₹${(
                        analytics?.total_decision_cost ??
                        0
                      ).toLocaleString()}`
                }
                subtitle="Optimization spend"
                icon={DollarSign}
              />

              <KpiCard
                title="Constraint Compliance"
                value={
                  analyticsLoading
                    ? "..."
                    : `${analytics?.constraint_compliance_percent ?? 0}%`
                }
                subtitle="Hard constraints passed"
                icon={ShieldCheck}
              />

            </div>

            {/* ========================================== */}
            {/* NETWORK OVERVIEW */}
            {/* ========================================== */}

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

              <div className="rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6">

                <div className="mb-6 flex items-center justify-between">

                  <div>
                    <h3 className="font-semibold text-white">
                      Shipment Risk Overview
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      AI-detected disruption risk across
                      the network
                    </p>
                  </div>

                  <Activity
                    className="text-cyan-400"
                    size={20}
                  />

                </div>

                <RiskOverviewChart />
              </div>

              {/* AI PIPELINE */}

              <div className="rounded-2xl border border-cyan-400/20 bg-[#0d1d2d] p-6">

                <div className="mb-6 flex items-center gap-3">

                  <div className="rounded-lg bg-cyan-400/10 p-2">

                    <GitBranch
                      className="text-cyan-400"
                      size={20}
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      AI Decision Pipeline
                    </h3>

                    <p className="text-xs text-slate-500">
                      Closed-loop workflow
                    </p>

                  </div>

                </div>

                <PipelineStep
                  icon={Truck}
                  title="Shipment Monitoring"
                  status="ACTIVE"
                />

                <PipelineStep
                  icon={BrainCircuit}
                  title="Delay Prediction"
                  status="READY"
                />

                <PipelineStep
                  icon={GitBranch}
                  title="Prescriptive Optimization"
                  status="READY"
                />

                <PipelineStep
                  icon={Database}
                  title="Operational Write-Back"
                  status="READY"
                />

              </div>

            </div>

          </div>

          {/* ========================================== */}
          {/* BACKEND INTELLIGENCE */}
          {/* ========================================== */}

          <div className="mt-8">

            <div className="mb-5">

              <h3 className="text-xl font-semibold text-white">
                Backend Intelligence
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                What powers the decisions behind this
                dashboard
              </p>

            </div>

            {/* PREDICTION */}

            <div id="prediction">
              <PredictionPanel />
            </div>

            {/* PRESCRIPTIONS */}

            <div id="prescriptions" />

            {/* DECISION HISTORY */}

            <div
              id="decision"
              className="mt-6"
            >
              <DecisionHistory />
            </div>

            {/* MODEL */}

            <div
              id="explainability"
              className="mt-6"
            >
              <ModelExplainability />
            </div>

            {/* ROI */}

            <div
              id="roi"
              className="mt-6"
            >
              <DecisionROI />
            </div>

            {/* ========================================== */}
            {/* TECHNOLOGY STACK */}
            {/* ========================================== */}

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <TechCard
                title="ML Prediction"
                value="Random Forest"
                detail="Delay classifier + duration regression"
              />

              <TechCard
                title="Optimization"
                value="SciPy HiGHS"
                detail="Budget + delay constraints"
              />

              <TechCard
                title="Write-Back"
                value="FastAPI + PostgreSQL"
                detail="Transactional decision logging"
              />

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

/* ========================================== */
/* KPI CARD */
/* ========================================== */

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-5 transition hover:border-cyan-400/30">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-2xl font-bold text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {subtitle}
          </p>

        </div>

        <div className="rounded-xl bg-cyan-400/10 p-3">

          <Icon
            size={20}
            className="text-cyan-400"
          />

        </div>

      </div>

    </div>
  );
}

/* ========================================== */
/* PIPELINE STEP */
/* ========================================== */

function PipelineStep({
  icon: Icon,
  title,
  status,
}: {
  icon: React.ElementType;
  title: string;
  status: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-[#18334a] bg-[#10283b] p-4">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-cyan-400/10 p-2">

          <Icon
            size={17}
            className="text-cyan-400"
          />

        </div>

        <span className="text-sm text-slate-300">
          {title}
        </span>

      </div>

      <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-400">
        {status}
      </span>

    </div>
  );
}

/* ========================================== */
/* TECHNOLOGY CARD */
/* ========================================== */

function TechCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-5">

      <p className="text-xs uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-lg font-semibold text-cyan-400">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {detail}
      </p>

    </div>
  );
}