import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-navy-800/80 rounded-xl ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 px-6 border-b border-navy-800">
      <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 flex flex-col gap-4 h-72">
      <Skeleton className="h-5 w-40" />
      <div className="flex-1 flex items-end gap-3 pt-6">
        <Skeleton className="h-40% w-full rounded-t-lg" />
        <Skeleton className="h-70% w-full rounded-t-lg" />
        <Skeleton className="h-50% w-full rounded-t-lg" />
        <Skeleton className="h-85% w-full rounded-t-lg" />
        <Skeleton className="h-60% w-full rounded-t-lg" />
      </div>
    </div>
  );
}
