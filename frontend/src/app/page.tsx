import DecisionHistory from "@/components/DecisionHistory";
import PredictionPanel from "@/components/PredictionPanel";
import { Activity,
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
  GitBranch
 } from "lucide-react";
 const navigation = [
  {name:"Overview", Icon:LayoutDashboard, active:true},
  {name:"Shipment Risk", Icon:AlertTriangle},
  {name:"Prescriptions", Icon:BrainCircuit},
  {name:"Decision", Icon:CheckCircle2},
  {name:"Model Expainability", Icon:BarChart3},
  {name:"Decision ROI", Icon:Gauge},
 ];
 export default function Home(){
  return(
    <main className="flex min-h-screen bg-[#07111f] text-[#e6f1ff]">
      <aside className="hidden w-64 border-r border-[#18334a] bg-[#091827] p-5 lg:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
          <BrainCircuit className="text-cyan-400" size={23} />
          </div>
          <div>
            <h1 className="text-lg font-bold">SupplyPrescript</h1>
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
                key={item.name} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  item.active
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
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>
      <section className="flex-1">
        <header className="flex items-center justify-between border-b border-[#18334a] bg-[#091827]/80 px-6 py-5 backdrop-blur">
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Shipments Analyzed"
              value="9,459"
              subtitle="Processed records"
              icon={Database}/>
            <KpiCard
              title="High Risk Shipments"
              value="1,284"
              subtitle="Requires attention"
              icon={AlertTriangle}/>
            <KpiCard
              title="Active Prescriptions"
              value="37"
              subtitle="Optimization recommendations"
              icon={BrainCircuit}/>
            <KpiCard
              title="Constraint Compliance"
              value="100%"
              subtitle="Hard constraints passed"
              icon={ShieldCheck}/>
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Shipment Risk Overview</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    AI-detected disruption risk across the network
                  </p>
                </div>
                <Activity className="text-cyan-400" size={20} />
              </div>
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[#24445c]">
                <div className="text-center">
                  <BarChart3
                    className="mx-auto mb-3 text-slate-600"
                    size={42}/>
                  <p className="text-sm text-slate-400">
                    Risk analytics will appear here
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Connected to prediction API in the next step
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-[#0d1d2d] p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-cyan-400/10 p-2">
                  <GitBranch className="text-cyan-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">AI Decision Pipeline</h3>
                  <p className="text-xs text-slate-500">
                    Closed-loop workflow
                  </p>
                </div>
              </div>
              <PipelineStep
                icon={Truck}
                title="Shipment Monitoring"
                status="ACTIVE"/>
              <PipelineStep
                icon={BrainCircuit}
                title="Delay Prediction"
                status="READY"/>
              <PipelineStep
                icon={GitBranch}
                title="Prescriptive Optimization"
                status="READY"/>
              <PipelineStep
                icon={Database}
                title="Operational Write-Back"
                status="READY"/>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6">
            <div className="mb-5">
              <h3 className="font-semibold">Backend Intelligence</h3>
              <p className="mt-1 text-sm text-slate-500">
                What powers the decisions behind this dashboard
              </p>
            </div>
            <PredictionPanel />
            <DecisionHistory />
            <div className="grid gap-4 md:grid-cols-3">
              <TechCard
                title="ML Prediction"
                value="Delay Classifier"
                detail="Feature pipeline + trained model"/>
              <TechCard
                title="Optimization"
                value="SciPy HiGHS"
                detail="Budget + delay constraints"/>
              <TechCard
                title="Write-Back"
                value="FastAPI + Database"
                detail="Transactional decision logging"/>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
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
    <div className="rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-5">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <Icon size={19} className="text-cyan-400" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
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
        <Icon size={18} className="text-cyan-400" />
        <span className="text-sm">{title}</span>
      </div>
      <span className="text-[10px] font-semibold tracking-wider text-emerald-400">
        {status}
      </span>
    </div>
  );
}
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
      <p className="mt-2 font-semibold text-cyan-400">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}