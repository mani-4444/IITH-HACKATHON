import React from 'react';
import { HiOutlineGlobe } from 'react-icons/hi';

export default function CarbonEmission({ power }) {
  const carbon = power != null ? (power * 0.5).toFixed(1) : null;
  const maxCarbon = 100; // scale reference
  const pct = carbon != null ? Math.min((carbon / maxCarbon) * 100, 100) : 0;

  const impactLevel =
    carbon == null ? 'N/A' :
    carbon < 300 ? 'Low' :
    carbon < 600 ? 'Moderate' :
    'High';

  const impactColor =
    carbon == null ? 'text-slate-500' :
    carbon < 300 ? 'text-emerald-400' :
    carbon < 600 ? 'text-amber-400' :
    'text-red-400';

  const barColor =
    carbon == null ? 'from-slate-600 to-slate-500' :
    carbon < 300 ? 'from-emerald-500 to-green-400' :
    carbon < 600 ? 'from-amber-500 to-yellow-400' :
    'from-red-500 to-orange-400';

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <HiOutlineGlobe className="text-emerald-400 text-lg" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Carbon Emission Estimate</h2>
          <p className="text-xs text-slate-400">Environmental impact assessment</p>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-3xl font-bold text-white mb-1">
          {carbon != null ? (
            <span className="animate-value">{Number(carbon).toLocaleString()}</span>
          ) : (
            <span className="text-slate-500">—</span>
          )}
        </p>
        <p className="text-xs text-slate-400">kg CO₂ estimated output</p>
      </div>

      {/* Progress bar */}
      <div className="mt-2 mb-3">
        <div className="w-full bg-navy-900/50 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">Impact Level</span>
        <span className={`text-xs font-semibold ${impactColor}`}>{impactLevel}</span>
      </div>

      {carbon != null && (
        <p className="mt-3 text-[11px] text-slate-500 leading-relaxed max-w-sm">
          Formula: Power ({power?.toLocaleString()} kW) × 0.5 = {Number(carbon).toLocaleString()} kg CO₂ / hr
        </p>
      )}
    </div>
  );
}
