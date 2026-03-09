import React from "react";
export default function Header() {
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
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-navy-900">
          AI
        </div>
      </div>
    </header>
  );
}
