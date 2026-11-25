import React from 'react';
import { APPLICATION_STATUSES, STATUS_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import {
  MapPin,
  Calendar,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Plus
} from 'lucide-react';

export default function ApplicationKanbanView({
  applications,
  loading,
  onView,
  onEdit,
  onStatusChange,
  onQuickAdd,
}) {
  // Group applications by status
  const columns = APPLICATION_STATUSES.map((status) => ({
    status,
    apps: applications ? applications.filter((a) => a.status === status) : [],
  }));

  const handleDragStart = (e, app) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: app.id, fromStatus: app.status }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data && data.id && data.fromStatus !== targetStatus) {
        onStatusChange(data.id, targetStatus);
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const getAdjacentStatuses = (currentStatus) => {
    const idx = APPLICATION_STATUSES.indexOf(currentStatus);
    const prev = idx > 0 ? APPLICATION_STATUSES[idx - 1] : null;
    const next = idx < APPLICATION_STATUSES.length - 1 ? APPLICATION_STATUSES[idx + 1] : null;
    return { prev, next };
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none min-h-[600px] scrollbar-thin">
      {columns.map(({ status, apps }) => {
        const style = STATUS_COLORS[status] || STATUS_COLORS.Applied;
        return (
          <div
            key={status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
            className="flex-shrink-0 w-72 rounded-2xl bg-navy-900/70 border border-navy-800/80 flex flex-col max-h-[780px]"
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                <h4 className="text-xs font-bold text-white tracking-tight">
                  {status}
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-navy-800 px-2 py-0.5 rounded-full border border-navy-700">
                {apps.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {apps.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-navy-800/60 rounded-xl">
                  <span className="text-xs text-slate-500">No applications</span>
                </div>
              ) : (
                apps.map((app) => {
                  const { prev, next } = getAdjacentStatuses(app.status);
                  return (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app)}
                      onClick={() => onView(app)}
                      className="p-4 rounded-xl bg-navy-800/80 border border-navy-750 hover:border-primary-500/40 hover:bg-navy-800 transition-all shadow-sm hover:shadow-card cursor-pointer group flex flex-col gap-2.5"
                    >
                      {/* Top: Company & Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-navy-700 to-navy-600 border border-navy-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {app.company_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-semibold text-primary-400 truncate">
                            {app.company_name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-navy-900 border border-navy-700">
                          {app.work_mode || 'Remote'}
                        </span>
                      </div>

                      {/* Job Title */}
                      <h5 className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors line-clamp-2 leading-snug">
                        {app.job_title}
                      </h5>

                      {/* Details row */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-navy-700/60">
                        {app.location && (
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            {app.location}
                          </span>
                        )}
                        {app.salary && (
                          <span className="flex items-center gap-0.5 text-emerald-400 font-medium">
                            <DollarSign className="w-3 h-3" />
                            {app.salary}
                          </span>
                        )}
                      </div>

                      {/* Footer: Date & Move buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(app.application_date)}
                        </span>

                        {/* Quick move status arrows */}
                        <div
                          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {prev && (
                            <button
                              onClick={() => onStatusChange(app.id, prev)}
                              title={`Move to ${prev}`}
                              className="p-1 text-slate-400 hover:text-white hover:bg-navy-700 rounded transition-colors"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {next && (
                            <button
                              onClick={() => onStatusChange(app.id, next)}
                              title={`Move to ${next}`}
                              className="p-1 text-slate-400 hover:text-white hover:bg-navy-700 rounded transition-colors"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Column Footer: Quick Add button */}
            <div className="p-2 border-t border-navy-800">
              <button
                onClick={onQuickAdd}
                className="w-full py-1.5 px-3 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-800 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Card</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
