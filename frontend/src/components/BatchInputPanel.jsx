import React, { useState } from "react";
import { HiOutlineBeaker, HiOutlineLightningBolt } from "react-icons/hi";

const defaultParams = {
  time_minutes: 120,
  temperature: 60,
  pressure: 1.0,
  humidity: 45,
  motor_speed: 150,
  compression_force: 30,
  flow_rate: 60,
  phase: "Compression",
  current_power: 35.0, // For feature engineering
};

const demoParams = {
  time_minutes: 120,
  temperature: 60,
  pressure: 1.2,
  humidity: 45,
  motor_speed: 150,
  compression_force: 30,
  flow_rate: 60,
  phase: "Compression",
  current_power: 35,
};

const PHASES = [
  "Preparation",
  "Granulation",
  "Blending",
  "Compression",
  "Drying",
  "Milling",
  "Coating",
  "QualityTesting",
];

export default function BatchInputPanel({ onPredict, loading }) {
  const [params, setParams] = useState(defaultParams);

  const handleChange = (field, value) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleDemo = () => {
    setParams(demoParams);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(params);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center">
          <HiOutlineBeaker className="text-teal-400 text-lg" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Batch Parameters</h2>
          <p className="text-xs text-slate-400">Configure inputs for model</p>
        </div>
      </div>

      {/* Demo button */}
      <button
        type="button"
        onClick={handleDemo}
        className="w-full mb-5 py-2 px-3 rounded-lg text-xs font-medium text-teal-300 bg-teal-500/10 border border-teal-500/25 hover:bg-teal-500/20 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <HiOutlineLightningBolt className="text-sm" />
        Use Demo Values
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Phase */}
          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Manufacturing Phase
            </label>
            <select
              value={params.phase}
              onChange={(e) => handleChange("phase", e.target.value)}
              className="w-full text-sm p-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white focus:border-teal-500/50 focus:outline-none transition-colors"
            >
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Time (min)
            </label>
            <input
              type="number"
              value={params.time_minutes}
              onChange={(e) =>
                handleChange("time_minutes", Number(e.target.value))
              }
              className="w-full text-sm p-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white focus:border-teal-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Temp (°C)
            </label>
            <input
              type="number"
              value={params.temperature}
              onChange={(e) =>
                handleChange("temperature", Number(e.target.value))
              }
              className="w-full text-sm p-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white focus:border-teal-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Pressure */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Pressure (Bar)
            </label>
            <input
              type="number"
              step="0.1"
              value={params.pressure}
              onChange={(e) => handleChange("pressure", Number(e.target.value))}
              className="w-full text-sm p-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white focus:border-teal-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Humidity */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Humidity (%)
            </label>
            <input
              type="number"
              value={params.humidity}
              onChange={(e) => handleChange("humidity", Number(e.target.value))}
              className="w-full text-sm p-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white focus:border-teal-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Motor Speed */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Motor Speed (RPM)
            </label>
            <input
              type="number"
              value={params.motor_speed}
              onChange={(e) =>
                handleChange("motor_speed", Number(e.target.value))
              }
              className="w-full text-sm p-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white focus:border-teal-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Compression Force */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Comp Force (kN)
            </label>
            <input
              type="number"
              value={params.compression_force}
              onChange={(e) =>
                handleChange("compression_force", Number(e.target.value))
              }
              className="w-full text-sm p-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white focus:border-teal-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Flow Rate */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Flow Rate (LPM)
            </label>
            <input
              type="number"
              value={params.flow_rate}
              onChange={(e) =>
                handleChange("flow_rate", Number(e.target.value))
              }
              className="w-full text-sm p-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white focus:border-teal-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Current Power */}
          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Current Power (kW)
            </label>
            <input
              type="number"
              step="0.1"
              title="Used for feature engineering"
              value={params.current_power}
              onChange={(e) =>
                handleChange("current_power", Number(e.target.value))
              }
              className="w-full text-sm p-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white focus:border-teal-500/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          id="predict-btn"
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-navy-900 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 transition-all duration-300 pulse-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Running Prediction...
            </>
          ) : (
            <>
              <HiOutlineBeaker />
              Predict Phase Metrics
            </>
          )}
        </button>
      </form>
    </div>
  );
}
