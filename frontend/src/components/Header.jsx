import React from 'react';
import { HiOutlineBell, HiOutlineCog } from 'react-icons/hi';

export default function Header() {
  return (
    <header className="h-16 bg-navy-800/60 backdrop-blur-lg border-b border-industrial-border flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-white">AI-Driven </span>
          <span className="gradient-text">Manufacturing Intelligence</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
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
