import React from "react";
import { HiOutlineChartBar } from "react-icons/hi";

const metrics = [
  {
    label: "R² Score",
    value: "0.9479",
    sub: "Overall accuracy",
    color: "text-teal-400",
    border: "border-teal-500/25",
    bg: "bg-teal-500/8",
  },
  {
    label: "MAE",
    value: "1.53",
    sub: "Mean abs. error",
    color: "text-blue-400",
    border: "border-blue-500/25",
    bg: "bg-blue-500/8",
  },
  {
    label: "RMSE",
    value: "2.93",
    sub: "Root mean sq.",
    color: "text-purple-400",
    border: "border-purple-500/25",
    bg: "bg-purple-500/8",
  },
  {
    label: "CV Score",
    value: "0.9498",
    sub: "5-fold cross-val.",
    color: "text-emerald-400",
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/8",
  },
];

export default function ModelMetrics() {
  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center">
          <HiOutlineChartBar className="text-teal-400 text-lg" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">
            Model Performance
          </h2>
          <p className="text-xs text-slate-400">
            RandomForest · PCA(6) · MultiOutput Regressor
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          ALL PASS
        </div>
      </div>

      {/* Metric cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`bg-navy-900/60 rounded-xl p-4 border ${m.border} flex flex-col gap-1`}
          >
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs font-semibold text-slate-200">{m.label}</p>
            <p className="text-[10px] text-slate-500">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-4 text-[10px] text-slate-500 leading-relaxed">
        Trained on 14,526 batch records · Train/Test split 80/20 · PCA retains
        97.10% variance
      </p>
    </div>
  );
}
