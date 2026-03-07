import React from "react";
import {
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineLightBulb,
  HiOutlineFire,
  HiOutlineBeaker,
} from "react-icons/hi";

export default function AIInsight({ results, inputs }) {
  if (!results && !inputs) {
    return (
      <div className="glass-card p-6 h-full border border-industrial-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <HiOutlineLightBulb className="text-blue-400 text-lg" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">AI Insights</h2>
            <p className="text-xs text-slate-400">
              Intelligent process analysis
            </p>
          </div>
        </div>
        <div className="bg-navy-900/40 rounded-xl p-4 border border-industrial-border border-dashed">
          <p className="text-sm text-slate-400 italic">
            Run a prediction to generate AI-powered insights on power and
            vibration…
          </p>
        </div>
      </div>
    );
  }

  const insights = [];

  // ── Input-based insights ──────────────────────────────────────
  if (inputs) {
    if (inputs.temperature > 70) {
      insights.push({
        icon: HiOutlineFire,
        title: "High Temperature Warning",
        message: `Temperature (${inputs.temperature}°C) exceeds 70°C safety threshold. Monitor for thermal stress and material degradation.`,
        color: "border-red-500/30 bg-red-500/5",
        iconBg: "bg-red-500/10",
        iconColor: "text-red-400",
      });
    }

    if (inputs.pressure > 2) {
      insights.push({
        icon: HiOutlineExclamation,
        title: "High Pressure Warning",
        message: `Pressure (${inputs.pressure} Bar) exceeds 2 Bar. Verify sealing integrity and consider reducing process pressure.`,
        color: "border-orange-500/30 bg-orange-500/5",
        iconBg: "bg-orange-500/10",
        iconColor: "text-orange-400",
      });
    }
  }

  // ── Output-based insights ─────────────────────────────────────
  if (results) {
    if (results.power > 20) {
      insights.push({
        icon: HiOutlineExclamation,
        title: "High Energy Usage",
        message: `Predicted power (${results.power.toFixed(1)} kW) exceeds 20 kW. Consider optimizing motor load, compression settings, or flow rate to reduce consumption.`,
        color: "border-amber-500/30 bg-amber-500/5",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-400",
      });
    } else {
      insights.push({
        icon: HiOutlineCheckCircle,
        title: "Optimal Energy Usage",
        message: `Power consumption (${results.power.toFixed(1)} kW) is within optimal range. Process is running energy-efficiently.`,
        color: "border-emerald-500/30 bg-emerald-500/5",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
      });
    }

    if (results.vibration > 3) {
      insights.push({
        icon: HiOutlineExclamation,
        title: "Vibration Alert",
        message: `Vibration at ${results.vibration.toFixed(2)} mm/s exceeds 3 mm/s safe threshold. Inspect bearings, coupling alignment, and mounting fixtures.`,
        color: "border-red-500/30 bg-red-500/5",
        iconBg: "bg-red-500/10",
        iconColor: "text-red-400",
      });
    } else if (results.vibration >= 2) {
      insights.push({
        icon: HiOutlineBeaker,
        title: "Moderate Vibration",
        message: `Vibration (${results.vibration.toFixed(2)} mm/s) is in the caution range (2–3 mm/s). Schedule preventive maintenance check.`,
        color: "border-amber-500/30 bg-amber-500/5",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-400",
      });
    } else {
      insights.push({
        icon: HiOutlineCheckCircle,
        title: "Stable Machine Operation",
        message: `Vibration (${results.vibration.toFixed(2)} mm/s) is well within safe limits. Mechanical condition is excellent.`,
        color: "border-blue-500/30 bg-blue-500/5",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-400",
      });
    }
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <HiOutlineLightBulb className="text-blue-400 text-lg" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">AI Insights</h2>
          <p className="text-xs text-slate-400">Intelligent process analysis</p>
        </div>
        <span className="ml-auto text-[10px] text-slate-400 bg-navy-700/50 px-2 py-0.5 rounded border border-industrial-border">
          {insights.length} signal{insights.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-auto pr-1">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`rounded-xl p-4 border ${insight.color} transition-all`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-lg ${insight.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}
              >
                <insight.icon className={`${insight.iconColor} text-base`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-0.5">
                  {insight.title}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
