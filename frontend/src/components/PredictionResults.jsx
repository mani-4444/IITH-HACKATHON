import React from "react";
import {
  HiOutlineLightningBolt,
  HiOutlineGlobe,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
} from "react-icons/hi";
import { MdVibration } from "react-icons/md";

function getThreshold(value, greenMax, yellowMax) {
  if (value == null) return "none";
  if (value < greenMax) return "green";
  if (value < yellowMax) return "yellow";
  return "red";
}

const themeMap = {
  none: {
    border: "border-slate-700/60",
    text: "text-slate-400",
    bg: "bg-slate-700/10",
    badge: "bg-slate-700/30 text-slate-400",
  },
  green: {
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
  yellow: {
    border: "border-amber-500/40",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    badge: "bg-amber-500/20 text-amber-300",
  },
  red: {
    border: "border-red-500/40",
    text: "text-red-400",
    bg: "bg-red-500/10",
    badge: "bg-red-500/20 text-red-300",
  },
};

export default function PredictionResults({ results }) {
  const power = results?.power ?? null;
  const vibration = results?.vibration ?? null;
  const carbon = power != null ? power * 0.5 : null;

  const powerLevel = getThreshold(power, 15, 25);
  const vibLevel = getThreshold(vibration, 2, 3);
  const carbonLevel = getThreshold(carbon, 10, 20);

  let statusLevel = "none";
  let statusLabel = "Awaiting";
  if (results) {
    const isRed = power > 25 || vibration > 3;
    const isYellow = !isRed && (power >= 15 || vibration >= 2);
    if (isRed) {
      statusLevel = "red";
      statusLabel = "Warning";
    } else if (isYellow) {
      statusLevel = "yellow";
      statusLabel = "Caution";
    } else {
      statusLevel = "green";
      statusLabel = "Optimal";
    }
  }

  const cards = [
    {
      id: "power",
      label: "Power Consumption",
      value: power != null ? power.toFixed(2) : "—",
      unit: "kW",
      icon: HiOutlineLightningBolt,
      level: powerLevel,
      badge:
        power != null
          ? powerLevel === "green"
            ? "Normal"
            : powerLevel === "yellow"
              ? "Elevated"
              : "High"
          : "—",
    },
    {
      id: "vibration",
      label: "Vibration",
      value: vibration != null ? vibration.toFixed(3) : "—",
      unit: "mm/s",
      icon: MdVibration,
      level: vibLevel,
      badge:
        vibration != null
          ? vibLevel === "green"
            ? "Stable"
            : vibLevel === "yellow"
              ? "Moderate"
              : "Critical"
          : "—",
    },
    {
      id: "carbon",
      label: "Carbon Emission",
      value: carbon != null ? carbon.toFixed(1) : "—",
      unit: "kg CO₂/hr",
      icon: HiOutlineGlobe,
      level: carbonLevel,
      badge:
        carbon != null
          ? carbonLevel === "green"
            ? "Low"
            : carbonLevel === "yellow"
              ? "Moderate"
              : "High"
          : "—",
    },
    {
      id: "status",
      label: "System Status",
      value: statusLabel,
      unit: "",
      icon:
        statusLevel === "red" || statusLevel === "yellow"
          ? HiOutlineExclamation
          : HiOutlineCheckCircle,
      level: statusLevel,
      badge: results ? "Live" : "Idle",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const theme = themeMap[card.level];
        return (
          <div
            key={card.id}
            id={`metric-${card.id}`}
            className={`glass-card p-5 border ${theme.border} relative overflow-hidden group transition-all duration-300`}
          >
            {/* Glow background */}
            <div
              className={`absolute inset-0 ${theme.bg} pointer-events-none rounded-xl`}
            />

            <div className="relative z-10 flex flex-col gap-3">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                  {card.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.bg} border ${theme.border}`}
                >
                  <card.icon className={`text-base ${theme.text}`} />
                </div>
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-bold ${theme.text} ${results ? "animate-value" : ""}`}
                >
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs text-slate-500">{card.unit}</span>
                )}
              </div>

              {/* Badge */}
              <span
                className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full ${theme.badge}`}
              >
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
