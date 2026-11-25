import React from 'react';
import { STATUS_COLORS, APPLICATION_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import {
  ExternalLink,
  MapPin,
  Eye,
  Pencil,
  Trash2,
  ChevronDown
} from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { TableRowSkeleton } from '../common/Skeleton';
import { Briefcase } from 'lucide-react';

export default function ApplicationTableView({
  applications,
  loading,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onQuickAdd,
}) {
  if (loading) {
    return (
      <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-card">
        {[...Array(6)].map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="No internship applications found"
        description="Try adjusting your search criteria or add your first internship application."
        actionLabel="Add Internship Application"
        onAction={onQuickAdd}
      />
    );
  }

  return (
    <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-800 bg-navy-950/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-6">Company & Role</th>
              <th className="py-3.5 px-4">Location & Mode</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Compensation</th>
              <th className="py-3.5 px-4">Applied Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/80">
            {applications.map((app) => {
              const statusStyle = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;
              return (
                <tr
                  key={app.id}
                  className="hover:bg-navy-850/60 transition-colors group cursor-pointer"
                  onClick={() => onView(app)}
                >
                  {/* Company & Role */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-800 to-navy-700 border border-navy-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:border-primary-500/40 transition-colors">
                        {app.company_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                            {app.job_title}
                          </span>
                          {app.application_url && (
                            <a
                              href={app.application_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-500 hover:text-primary-400 transition-colors"
                              title="Open Application Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <span className="text-xs font-medium text-slate-400 block truncate">
                          {app.company_name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Location & Work Mode */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{app.location || 'Remote'}</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {app.work_mode || 'Remote'} · {app.employment_type || 'Intern'}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge with inline quick change */}
                  <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="relative inline-block">
                      <select
                        value={app.status}
                        onChange={(e) => onStatusChange(app.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle.badge} bg-navy-950/80 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer appearance-none pr-6`}
                      >
                        {APPLICATION_STATUSES.map((st) => (
                          <option key={st} value={st} className="bg-navy-900 text-white font-medium">
                            {st}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                    </div>
                  </td>

                  {/* Compensation */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-300 font-medium">
                    {app.salary || '—'}
                  </td>

                  {/* Applied Date */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-400">
                    {formatDate(app.application_date)}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-4 px-6 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(app)}
                        title="View Details"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(app)}
                        title="Edit Application"
                        className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-navy-800 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(app)}
                        title="Delete Application"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
