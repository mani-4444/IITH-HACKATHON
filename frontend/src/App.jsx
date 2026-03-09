import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import BatchInputPanel from "./components/BatchInputPanel";
import PredictionResults from "./components/PredictionResults";
import EnergyChart from "./components/EnergyChart";
import CarbonEmission from "./components/CarbonEmission";
import ModelMetrics from "./components/ModelMetrics";

const API_URL = "http://localhost:5000";

export default function App() {
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [lastInputs, setLastInputs] = useState(null);

  // Poll backend health every 10 s
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        await axios.get(`${API_URL}/health`, { timeout: 3000 });
        if (!cancelled) setBackendConnected(true);
      } catch {
        if (!cancelled) setBackendConnected(false);
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const handlePredict = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setLastInputs(params);
    try {
      const response = await axios.post(`${API_URL}/predict`, params);
      const data = response.data;
      setResults(data);
      setHistory((prev) => [...prev, data]);
      setSuccessMsg("Prediction completed successfully");
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Prediction failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-navy-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Full-screen loading overlay */}
          {loading && (
            <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="glass-card p-8 flex flex-col items-center gap-4 border border-teal-500/30 shadow-2xl">
                <svg
                  className="animate-spin h-10 w-10 text-teal-400"
                  viewBox="0 0 24 24"
                >
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
                <p className="text-sm text-slate-200 font-semibold">
                  Running ML Prediction…
                </p>
                <p className="text-xs text-slate-500">
                  Querying RandomForest · PCA pipeline
                </p>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
              <span>⚠ {error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 text-lg leading-none ml-4"
              >
                ×
              </button>
            </div>
          )}

          {/* Success banner */}
          {successMsg && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
              <span className="text-base">✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column — Input Panel */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3">
              <BatchInputPanel onPredict={handlePredict} loading={loading} />
            </div>

            {/* Right Column — Results & Charts */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
              {/* 4 KPI Prediction Cards */}
              <PredictionResults results={results} />

              {/* Model Performance */}
              <ModelMetrics />

              {/* Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-6">
                <EnergyChart history={history} />
                <CarbonEmission power={results?.power} />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-3 border-t border-industrial-border bg-navy-800/40">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>© 2026 MFG.AI Intelligence Platform</span>
            <span>Powered by ML Pipeline v2.4</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
