import React from "react";
import { HiOutlineBell, HiOutlineCog, HiOutlineWifi } from "react-icons/hi";

export default function Header({ backendConnected }) {
  return (
    <header className="h-16 bg-navy-800/60 backdrop-blur-lg border-b border-industrial-border flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-white">AI-Driven </span>
          <span className="gradient-text">Manufacturing Intelligence</span>
        </h1>
        <p className="text-[10px] text-slate-500 tracking-wider uppercase mt-0.5">
          Industrial AI Analytics Platform
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend connection status */}
        <div
          className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border font-medium ${
            backendConnected
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
              : "text-red-400 bg-red-500/10 border-red-500/25"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
            }`}
          />
          {backendConnected ? "Backend Connected" : "Backend Disconnected"}
        </div>

        <span className="text-xs text-slate-400 bg-navy-700/50 px-3 py-1.5 rounded-lg border border-industrial-border">
          Model v2.4 • Active
        </span>

        <button
          id="notifications-btn"
          className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <HiOutlineBell className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-400 rounded-full" />
        </button>
        <button
          id="settings-btn"
          className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <HiOutlineCog className="text-xl" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-navy-900">
          AI
        </div>
      </div>
    </header>
  );
}
