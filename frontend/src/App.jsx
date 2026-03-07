import React, { useState, useCallback } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BatchInputPanel from './components/BatchInputPanel';
import PredictionResults from './components/PredictionResults';
import EnergyChart from './components/EnergyChart';
import CarbonEmission from './components/CarbonEmission';
import AIInsight from './components/AIInsight';

const API_URL = 'http://localhost:5000';

export default function App() {
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/predict`, params);
      const data = response.data;
      setResults(data);
      setHistory((prev) => [...prev, data]);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Prediction failed';
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
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
              <span>⚠ {error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column — Input Panel */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3">
              <BatchInputPanel onPredict={handlePredict} loading={loading} />
            </div>

            {/* Right Column — Results & Charts */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Prediction Metric Cards */}
              <PredictionResults results={results} />

              {/* Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-6">
                <EnergyChart history={history} />
                <div className="space-y-6 flex flex-col items-stretch">
                  <CarbonEmission power={results?.power} />
                  <div className="flex-1">
                    <AIInsight results={results} />
                  </div>
                </div>
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
