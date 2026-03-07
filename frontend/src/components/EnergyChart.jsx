import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HiOutlineTrendingUp } from 'react-icons/hi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function EnergyChart({ history }) {
  const labels = history.map((_, i) => `Batch ${i + 1}`);
  const values = history.map((h) => h.power);

  const data = {
    labels,
    datasets: [
      {
        label: 'Power Consumption (kW)',
        data: values,
        fill: true,
        borderColor: '#14b8a6',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(20, 184, 166, 0.25)');
          gradient.addColorStop(1, 'rgba(20, 184, 166, 0.0)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#0a1628',
        pointBorderWidth: 2,
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => `Power: ${ctx.parsed.y.toLocaleString()} kW`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)', drawBorder: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)', drawBorder: false },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: (v) => v.toLocaleString(),
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <HiOutlineTrendingUp className="text-teal-400 text-lg" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Power Consumption Trend</h2>
            <p className="text-xs text-slate-400">Power kW vs Batch Index</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 bg-navy-700/50 px-2.5 py-1 rounded-lg border border-industrial-border">
          {history.length} batches
        </span>
      </div>

      <div style={{ height: '280px' }}>
        {history.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Run predictions to see energy trends
          </div>
        )}
      </div>
    </div>
  );
}
