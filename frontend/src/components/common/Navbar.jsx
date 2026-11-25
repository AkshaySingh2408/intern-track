import React from 'react';
import { Menu, Plus, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onOpenMobile, onQuickAdd }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 bg-navy-950/80 backdrop-blur-md border-b border-navy-800/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-navy-800/80 rounded-xl transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-600 to-cyan-400 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-navy-950 rounded-[6px] flex items-center justify-center">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">InternTrack</span>
        </div>

        <div className="hidden sm:block">
          <p className="text-xs text-slate-400">
            Welcome back, <span className="text-white font-medium">{user?.full_name || 'Scholar'}</span>
          </p>
        </div>
      </div>

      {/* Right: Quick Add Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onQuickAdd}
          className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-md shadow-primary-950/40 hover:shadow-primary-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add Application</span>
        </button>
      </div>
    </header>
  );
}
