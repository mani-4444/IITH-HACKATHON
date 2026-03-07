import React from 'react';
import { HiOutlineLightningBolt, HiOutlineGlobe } from 'react-icons/hi';
import { MdVibration } from 'react-icons/md';

const metrics = [
  {
    key: 'power',
    label: 'Predicted Power Consumption',
    unit: 'kW',
    icon: HiOutlineLightningBolt,
    color: 'from-amber-500 to-orange-500',
    bgGlow: 'rgba(245, 158, 11, 0.08)',
    textColor: 'text-amber-400',
  },
  {
    key: 'vibration',
    label: 'Predicted Vibration',
    unit: 'mm/s',
    icon: MdVibration,
    color: 'from-blue-500 to-cyan-500',
    bgGlow: 'rgba(59, 130, 246, 0.08)',
    textColor: 'text-blue-400',
  }
];

export default function PredictionResults({ results }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metrics.map((m) => {
        const value = results ? results[m.key] : null;
        return (
          <div
            key={m.key}
            id={`metric-${m.key}`}
            className="glass-card p-5 relative overflow-hidden group"
            style={{ background: value != null ? `linear-gradient(135deg, ${m.bgGlow}, transparent)` : undefined }}
          >
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${m.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">{m.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-3xl font-bold ${value != null ? m.textColor : 'text-slate-500'} ${value != null ? 'animate-value' : ''}`}>
                    {value != null ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                  </span>
                  <span className="text-xs text-slate-500">{m.unit}</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shadow-lg`}>
                <m.icon className="text-white text-lg" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
