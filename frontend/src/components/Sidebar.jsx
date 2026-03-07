import React from 'react';
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineLightningBolt,
  HiOutlineGlobe,
} from 'react-icons/hi';

const navItems = [
  { label: 'Dashboard', icon: HiOutlineChartBar, active: true },
  { label: 'Batch Prediction', icon: HiOutlineCube, active: false },
  { label: 'Energy Analytics', icon: HiOutlineLightningBolt, active: false },
  { label: 'Carbon Impact', icon: HiOutlineGlobe, active: false },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-navy-800/80 backdrop-blur-lg border-r border-industrial-border flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-industrial-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-300 flex items-center justify-center">
            <HiOutlineCube className="text-navy-900 text-xl" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">MFG.AI</h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              item.active
                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="text-lg" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Status indicator */}
      <div className="px-4 py-4 border-t border-industrial-border">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">System Status</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium">All Systems Online</p>
        </div>
      </div>
    </aside>
  );
}
