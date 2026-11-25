import React from 'react';
import { Plus } from 'lucide-react';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-navy-800 bg-navy-900/40">
      {Icon && (
        <div className="p-4 rounded-2xl bg-primary-600/10 text-primary-400 border border-primary-500/20 mb-4 shadow-inner">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h4 className="text-base font-semibold text-white tracking-tight">
        {title}
      </h4>
      <p className="mt-1.5 text-sm text-slate-400 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-xl transition-all shadow-md shadow-primary-950/40"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
