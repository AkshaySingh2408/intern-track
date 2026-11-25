import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-navy-950 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-600/10 text-primary-400 border border-primary-500/20 mx-auto flex items-center justify-center">
          <Compass className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-200 mt-2">Page Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            The page or record you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-lg"
        >
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
