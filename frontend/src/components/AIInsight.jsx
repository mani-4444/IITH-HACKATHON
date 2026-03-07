import React from 'react';
import { HiOutlineExclamation, HiOutlineCheckCircle, HiOutlineLightBulb } from 'react-icons/hi';

export default function AIInsight({ results }) {
  if (!results) {
    return (
      <div className="glass-card p-6 h-full border border-industrial-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <HiOutlineLightBulb className="text-blue-400 text-lg" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">AI Insights</h2>
            <p className="text-xs text-slate-400">Intelligent process analysis</p>
          </div>
        </div>
        <div className="bg-navy-900/40 rounded-xl p-4 border border-industrial-border border-dashed">
          <p className="text-sm text-slate-400 italic">
            Run a prediction to generate AI-powered insights on power and vibration…
          </p>
        </div>
      </div>
    );
  }

  const insights = [];

  // Assuming high power threshold > 50 kW
  if (results.power > 50) {
    insights.push({
      type: 'warning',
      icon: HiOutlineExclamation,
      title: 'High Power Consumption',
      message: `Power consumption (${results.power.toFixed(1)} kW) approaches upper limits. May indicate excessive motor effort.`,
      color: 'border-amber-500/30 bg-amber-500/5',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    });
  } else {
    insights.push({
      type: 'success',
      icon: HiOutlineCheckCircle,
      title: 'Optimal Power Range',
      message: `Power consumption is well within acceptable limits.`,
      color: 'border-emerald-500/30 bg-emerald-500/5',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    });
  }

  // Assuming > 10 mm/s is dangerous
  if (results.vibration > 10) {
    insights.push({
      type: 'warning',
      icon: HiOutlineExclamation,
      title: 'Structural Vibration Alert',
      message: `Vibration at ${results.vibration.toFixed(2)} mm/s is extremely high. Risk of mechanical failure.`,
      color: 'border-red-500/30 bg-red-500/5',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-400',
    });
  } else if (results.vibration < 3) {
    insights.push({
      type: 'success',
      icon: HiOutlineCheckCircle,
      title: 'Stable Machine Operation',
      message: `Extremely low vibration levels. Smooth mechanical function.`,
      color: 'border-blue-500/30 bg-blue-500/5',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    });
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
      </div>

      <div className="space-y-3 flex-1 overflow-auto pr-2">
        {insights.map((insight, i) => (
          <div key={i} className={`rounded-xl p-4 border ${insight.color} transition-all`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${insight.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <insight.icon className={`${insight.iconColor} text-base`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-0.5">{insight.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{insight.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
