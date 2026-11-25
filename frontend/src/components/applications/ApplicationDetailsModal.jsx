import React from 'react';
import Modal from '../common/Modal';
import {
  STATUS_COLORS,
  APPLICATION_STATUSES
} from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/formatters';
import {
  Globe,
  ExternalLink,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  User,
  Mail,
  FileText,
  Pencil,
  Trash2,
  CalendarPlus
} from 'lucide-react';

export default function ApplicationDetailsModal({
  isOpen,
  onClose,
  application,
  onEdit,
  onDelete,
  onStatusChange,
  onAddInterview,
}) {
  if (!application) return null;

  const statusStyle = STATUS_COLORS[application.status] || STATUS_COLORS.Applied;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Overview"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-navy-800/60 border border-navy-700/60">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
              {application.company_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {application.job_title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-primary-400">
                  {application.company_name}
                </span>
                {application.location && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {application.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Status Selector */}
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <span className="text-[11px] font-medium text-slate-400">Change Status</span>
            <select
              value={application.status}
              onChange={(e) => onStatusChange(application.id, e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusStyle.badge} bg-navy-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500`}
            >
              {APPLICATION_STATUSES.map((st) => (
                <option key={st} value={st} className="bg-navy-900 text-white font-medium">
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-navy-800/40 border border-navy-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Briefcase className="w-3.5 h-3.5 text-primary-400" />
              <span>Work Mode</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {application.work_mode || 'Remote'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-800/40 border border-navy-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compensation</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {application.salary || 'Unspecified'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-800/40 border border-navy-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Applied On</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {formatDate(application.application_date)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-800/40 border border-navy-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Deadline</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {formatDate(application.deadline)}
            </span>
          </div>
        </div>

        {/* Links & Recruiter Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-800/40 border border-navy-800 space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Links & Resume
            </h4>
            <div className="space-y-2 text-sm">
              {application.company_website ? (
                <a
                  href={application.company_website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-primary-400 hover:text-primary-300 hover:underline"
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{application.company_website}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Globe className="w-4 h-4" /> No company website listed
                </div>
              )}

              {application.application_url ? (
                <a
                  href={application.application_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-primary-400 hover:text-primary-300 hover:underline"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Application Portal / Listing</span>
                </a>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <ExternalLink className="w-4 h-4" /> No application URL listed
                </div>
              )}

              {application.resume_version && (
                <div className="flex items-center gap-2 text-slate-300 pt-1 text-xs">
                  <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Resume: <strong className="text-white">{application.resume_version}</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-navy-800/40 border border-navy-800 space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Recruiter & Interview
            </h4>
            <div className="space-y-2 text-sm">
              {application.recruiter_name ? (
                <div className="flex items-center gap-2 text-slate-200">
                  <User className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{application.recruiter_name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <User className="w-4 h-4" /> Recruiter name not provided
                </div>
              )}

              {application.recruiter_email ? (
                <a
                  href={`mailto:${application.recruiter_email}`}
                  className="flex items-center gap-2 text-primary-400 hover:text-primary-300 hover:underline"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{application.recruiter_email}</span>
                </a>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Mail className="w-4 h-4" /> Recruiter email not provided
                </div>
              )}

              {application.interview_date && (
                <div className="flex items-center gap-2 text-cyan-300 pt-1 text-xs font-medium">
                  <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Scheduled Interview: {formatDateTime(application.interview_date)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Description */}
        {application.job_description && (
          <div className="p-4 rounded-xl bg-navy-800/40 border border-navy-800 space-y-1.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Role Description
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {application.job_description}
            </p>
          </div>
        )}

        {/* Personal Notes */}
        {application.notes && (
          <div className="p-4 rounded-xl bg-navy-800/40 border border-navy-800 space-y-1.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Notes & Follow-up Log
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {application.notes}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-navy-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onAddInterview(application);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-colors"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Schedule Interview</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(application);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-navy-800 hover:bg-navy-700 rounded-xl transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onDelete(application);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
