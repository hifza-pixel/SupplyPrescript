"use client";
import { useEffect, useState } from "react";
const API_BASE_URL =
process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
interface ModelInfo {
model_type: string;
duration_model: string;
prediction_target: string;
training_records: number;
features: number;
delay_probability_thresholds: {
low: string;
medium: string;
high: string;
};
duration_model_metrics: {
mae_days: number;
rmse_days: number;
r2: number;
};
}
export default function ModelExplainability() {
const [model, setModel] = useState<ModelInfo | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
useEffect(() => {
async function loadModelInfo() {
try {
const response = await fetch(
`${API_BASE_URL}/api/analytics/model`
);
    if (!response.ok) {
      throw new Error("Unable to load model information");
    }
    const data = await response.json();
    setModel(data);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to load model information"
    );
  } finally {
    setLoading(false);
  }
}
loadModelInfo();
}, []);
return ( 
<div id="explainability"
   className="mt-6 rounded-2xl border border-[#18334a] bg-[#0d1d2d] p-6">
    <div className="mb-6"> 
 <p className="text-xs uppercase tracking-wider text-cyan-400">
Machine Learning </p>
    <h3 className="mt-1 text-xl font-semibold text-white">
      Model Explainability
    </h3>
    <p className="mt-1 text-sm text-slate-500">
      Model architecture, training information and performance metrics
    </p>
  </div>
  {loading && (
    <div className="py-10 text-center text-sm text-slate-500">
      Loading model information...
    </div>
  )}
  {error && (
    <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
      {error}
    </div>
  )}
  {model && !loading && !error && (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          title="Prediction Model"
          value={model.model_type}
        />
        <InfoCard
          title="Duration Model"
          value={model.duration_model}
        />
        <InfoCard
          title="Training Records"
          value={model.training_records.toLocaleString()}
        />
        <InfoCard
          title="Features"
          value={model.features.toString()}
        />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#18334a] bg-[#091827] p-5">
          <h4 className="font-semibold text-white">
            Prediction Logic
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Delay probability determines shipment risk level.
          </p>
          <div className="mt-5 space-y-3">
            <RiskRow
              label="Low Risk"
              value={model.delay_probability_thresholds.low}
            />
            <RiskRow
              label="Medium Risk"
              value={model.delay_probability_thresholds.medium}
            />
            <RiskRow
              label="High Risk"
              value={model.delay_probability_thresholds.high}
            />
          </div>
        </div>
        <div className="rounded-xl border border-[#18334a] bg-[#091827] p-5">
          <h4 className="font-semibold text-white">
            Duration Model Performance
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Regression performance for predicted delivery duration.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <MetricCard
              label="MAE"
              value={`${model.duration_model_metrics.mae_days} days`}
            />
            <MetricCard
              label="RMSE"
              value={`${model.duration_model_metrics.rmse_days} days`}
            />
            <MetricCard
              label="R²"
              value={model.duration_model_metrics.r2.toString()}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
        <p className="text-sm font-semibold text-cyan-400">
          Prediction Target
        </p>
        <p className="mt-2 text-lg font-semibold text-white">
          {model.prediction_target}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          The system uses shipment features to estimate delay risk
          and predicted delay duration before prescriptive optimization.
        </p>
      </div>
    </>
  )}
</div>
);
}

function InfoCard({
title,
value,
}: {
title: string;
value: string;
}) {
return ( <div className="rounded-xl border border-[#18334a] bg-[#091827] p-4"> 
<p className="text-xs uppercase tracking-wider text-slate-500">
{title} 
</p>
  <p className="mt-2 font-semibold text-cyan-400">
    {value}
  </p>
</div>
);
}
function RiskRow({
label,
value,
}: {
label: string;
value: string;
}) {
return ( <div className="flex items-center justify-between rounded-lg border border-[#18334a] bg-[#0d1d2d] px-4 py-3"> <span className="text-sm text-slate-300">
{label} </span>
  <span className="text-sm font-semibold text-cyan-400">
    {value}
  </span>
</div>
);
}
function MetricCard({
label,
value,
}: {
label: string;
value: string;
}) {
return ( <div className="rounded-lg bg-[#0d1d2d] p-4 text-center"> <p className="text-xs text-slate-500">
{label} </p>
  <p className="mt-2 font-semibold text-white">
    {value}
  </p>
</div>
);
}
