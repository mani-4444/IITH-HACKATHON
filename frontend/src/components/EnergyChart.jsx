import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { HiOutlineTrendingUp } from "react-icons/hi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
);

export default function EnergyChart({ history }) {
  const labels = history.map((_, i) => `Batch ${i + 1}`);
  const powerValues = history.map((h) => h.power);
  const vibValues = history.map((h) => h.vibration);

  const data = {
    labels,
    datasets: [
      {
        label: "Power (kW)",
        data: powerValues,
        fill: true,
        borderColor: "#14b8a6",
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(20, 184, 166, 0.22)");
          gradient.addColorStop(1, "rgba(20, 184, 166, 0.0)");
          return gradient;
        },
        tension: 0.45,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: "#14b8a6",
        pointBorderColor: "#0a1628",
        pointBorderWidth: 2,
        borderWidth: 2.5,
        yAxisID: "y",
      },
      {
        label: "Vibration (mm/s)",
        data: vibValues,
        fill: false,
        borderColor: "#a78bfa",
        backgroundColor: "rgba(167, 139, 250, 0.12)",
        tension: 0.45,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: "#a78bfa",
        pointBorderColor: "#0a1628",
        pointBorderWidth: 2,
        borderWidth: 2,
        borderDash: [5, 3],
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      title: {
        display: true,
        text: "Power Prediction History",
        color: "#94a3b8",
        font: { size: 12, weight: "500" },
        padding: { bottom: 12 },
      },
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          color: "#94a3b8",
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          padding: 16,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
        borderColor: "#334155",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const unit = ctx.datasetIndex === 0 ? "kW" : "mm/s";
            return ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)} ${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(51, 65, 85, 0.25)", drawBorder: false },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        position: "left",
        grid: { color: "rgba(51, 65, 85, 0.25)", drawBorder: false },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          callback: (v) => `${v} kW`,
        },
        title: {
          display: true,
          text: "Power (kW)",
          color: "#475569",
          font: { size: 10 },
        },
      },
      y1: {
        position: "right",
        grid: { drawOnChartArea: false },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          callback: (v) => `${v} mm/s`,
        },
        title: {
          display: true,
          text: "Vibration (mm/s)",
          color: "#475569",
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <HiOutlineTrendingUp className="text-teal-400 text-lg" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Energy & Vibration Trends
            </h2>
            <p className="text-xs text-slate-400">
              Batch-by-batch prediction history
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-400 bg-navy-700/50 px-2.5 py-1 rounded-lg border border-industrial-border">
          {history.length} {history.length === 1 ? "batch" : "batches"}
        </span>
      </div>

      <div style={{ height: "280px" }}>
        {history.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-500">
            <HiOutlineTrendingUp className="text-3xl opacity-30" />
            <p className="text-sm">Run predictions to see energy trends</p>
          </div>
        )}
      </div>
    </div>
  );
}
