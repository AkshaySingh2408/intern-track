import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  BarChart3,
  Bell,
  User,
  LogOut,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Applications', to: '/applications', icon: Briefcase },
    { name: 'Interviews', to: '/interviews', icon: CalendarCheck },
    { name: 'Calendar', to: '/calendar', icon: CalendarDays },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Reminders', to: '/reminders', icon: Bell },
    { name: 'Profile & Settings', to: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy-900 border-r border-navy-800/80 w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-navy-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-cyan-400 p-0.5 shadow-md shadow-primary-950/40 flex items-center justify-center">
          <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
            <Compass className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-white tracking-tight">InternTrack</span>
            <span className="text-[10px] font-semibold text-primary-400 bg-primary-500/10 px-1.5 py-0.2 rounded-md border border-primary-500/20">PRO</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Internship Tracker</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Career Pro Badge Widget */}
      <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-gradient-to-br from-navy-800/90 to-primary-950/40 border border-primary-500/20">
        <div className="flex items-center gap-2 text-primary-400 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Application Season</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {user?.target_role ? `Targeting: ${user.target_role}` : 'Keep up the momentum and apply weekly!'}
        </p>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-navy-800/80 bg-navy-950/40 flex items-center justify-between">
        <div
          onClick={() => {
            navigate('/profile');
            if (onCloseMobile) onCloseMobile();
          }}
          className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0 pr-2"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
              {user?.full_name || 'My Account'}
            </span>
            <span className="text-[11px] text-slate-400 truncate">
              {user?.email || ''}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex-shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop and overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm animate-fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
