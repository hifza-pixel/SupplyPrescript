"use client";

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
} from "lucide-react";

import PredictionPanel from "@/components/PredictionPanel";
import DecisionHistory from "@/components/DecisionHistory";
import ModelExplainability from "@/components/ModelExplainability";
import DecisionROI from "@/components/DecisionROI";
import RiskOverviewChart from "@/components/RiskOverviewChart";
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
  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="flex min-h-screen bg-[#07111f] text-[#e6f1ff]">
      {/* SIDEBAR */}
      <aside className="hidden w-64 border-r border-[#18334a] bg-[#091827] p-5 lg:block">
        {/* LOGO */}
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

        {/* NAVIGATION */}
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

        {/* SETTINGS */}
        <div className="mt-10 border-t border-[#18334a] pt-5">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <Settings size={18} />

            Settings
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
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

        {/* PAGE CONTENT */}
        <div className="p-6">
          {/* OVERVIEW */}
          <div id="overview">
            {/* KPI CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Shipments Analyzed"
                value="9,459"
                subtitle="Processed records"
                icon={Database}
              />

              <KpiCard
                title="High Risk Shipments"
                value="1,284"
                subtitle="Requires attention"
                icon={AlertTriangle}
              />

              <KpiCard
                title="Active Prescriptions"
                value="37"
                subtitle="Optimization recommendations"
                icon={BrainCircuit}
              />

              <KpiCard
                title="Constraint Compliance"
                value="100%"
                subtitle="Hard constraints passed"
                icon={ShieldCheck}
              />
            </div>

            {/* RISK + PIPELINE */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              {/* RISK OVERVIEW */}
              <div className="rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      Shipment Risk Overview
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      AI-detected disruption risk across the network
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
                    <h3 className="font-semibold">
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

          {/* BACKEND INTELLIGENCE */}
          <div className="mt-6">
            <div className="mb-5">
              <h3 className="text-xl font-semibold">
                Backend Intelligence
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                What powers the decisions behind this dashboard
              </p>
            </div>

            {/* SHIPMENT RISK */}
            <div id="prediction">
              <PredictionPanel />
            </div>

            {/* PRESCRIPTION */}
            <div id="prescriptions">
              {/* 
                Prescription result is generated
                inside PredictionResult after prediction.
              */}
            </div>

            {/* DECISION HISTORY */}
            <div id="decision">
              <DecisionHistory />
            </div>

            {/* MODEL EXPLAINABILITY */}
            <ModelExplainability />

            {/* DECISION ROI */}
            <DecisionROI />

            {/* TECHNOLOGY STACK */}
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

/* =========================
   KPI CARD
========================= */

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
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {title}
        </p>

        <Icon
          size={19}
          className="text-cyan-400"
        />
      </div>

      <p className="text-3xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

/* =========================
   PIPELINE STEP
========================= */

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
    <div className="mb-3 flex items-center justify-between rounded-xl border border-[#18334a] bg-[#091827] p-4">
      <div className="flex items-center gap-3">
        <Icon
          size={18}
          className="text-cyan-400"
        />

        <span className="text-sm">
          {title}
        </span>
      </div>

      <span className="text-[10px] font-semibold tracking-wider text-emerald-400">
        {status}
      </span>
    </div>
  );
}

/* =========================
   TECHNOLOGY CARD
========================= */

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
    <div className="rounded-xl border border-[#18334a] bg-[#091827] p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <p className="mt-2 font-semibold text-cyan-400">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {detail}
      </p>
    </div>
  );
}