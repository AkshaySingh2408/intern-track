import React, { useState, useEffect, useCallback } from 'react';
import { interviewService, applicationService } from '../services/api';
import { useToast } from '../context/ToastContext';
import InterviewModal from '../components/interviews/InterviewModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { formatDateTime, formatRelativeDate } from '../../src/utils/formatters';
import { INTERVIEW_STATUSES } from '../utils/constants';
import {
  CalendarCheck,
  Video,
  Clock,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInv, setEditingInv] = useState(null);
  const [deletingInv, setDeletingInv] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [invsRes, appsRes] = await Promise.all([
        interviewService.getInterviews({ status: activeTab !== 'All' ? activeTab : undefined }),
        applicationService.getApplications({ page_size: 500 }),
      ]);
      setInterviews(invsRes.data || []);
      setApplications(appsRes.data.items || []);
    } catch (err) {
      console.error('Interviews load error:', err);
      showToast('Failed to load interviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (payload) => {
    try {
      setActionLoading(true);
      if (editingInv?.id) {
        const res = await interviewService.updateInterview(editingInv.id, payload);
        showToast('Interview session updated', 'success');
        setInterviews((prev) =>
          prev.map((i) => (i.id === editingInv.id ? res.data : i))
        );
      } else {
        const res = await interviewService.createInterview(payload);
        showToast('New interview scheduled!', 'success');
        setInterviews((prev) => [res.data, ...prev]);
      }
      setIsModalOpen(false);
      setEditingInv(null);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save interview';
      showToast(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusQuickChange = async (id, newStatus) => {
    try {
      setInterviews((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
      await interviewService.updateInterview(id, { status: newStatus });
      showToast(`Interview marked as ${newStatus}`, 'info');
    } catch (err) {
      showToast('Failed to update interview status', 'error');
      fetchData();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInv) return;
    try {
      setActionLoading(true);
      await interviewService.deleteInterview(deletingInv.id);
      showToast('Interview deleted', 'success');
      setInterviews((prev) => prev.filter((i) => i.id !== deletingInv.id));
      setIsConfirmOpen(false);
      setDeletingInv(null);
    } catch (err) {
      showToast('Failed to delete interview', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interview Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your upcoming rounds, meeting links, preparation notes, and outcomes.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingInv(null);
            setIsModalOpen(true);
          }}
          disabled={applications.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-950/50 hover:shadow-primary-600/30 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-800 pb-2">
        {['All', ...INTERVIEW_STATUSES].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-primary-600/20 text-primary-300 border border-primary-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Interviews Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-navy-900 border border-navy-800 animate-pulse" />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No interview sessions found"
          description={
            applications.length === 0
              ? 'Add an internship application first to schedule interviews.'
              : 'Keep pushing your applications forward to lock in interview rounds!'
          }
          actionLabel={applications.length > 0 ? 'Schedule First Interview' : 'Add Application'}
          onAction={() => {
            if (applications.length > 0) {
              setEditingInv(null);
              setIsModalOpen(true);
            } else {
              window.location.href = '/applications';
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviews.map((inv) => {
            const isCompleted = inv.status === 'Completed';
            const isCancelled = inv.status === 'Cancelled';
            const isScheduled = inv.status === 'Scheduled';

            return (
              <div
                key={inv.id}
                className="p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-cyan-500/40 transition-all shadow-card flex flex-col justify-between gap-4 group"
              >
                <div>
                  {/* Top: Type badge & Status pill */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      {inv.interview_type}
                    </span>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : isCancelled
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  {/* Company & Role */}
                  <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">
                    {inv.company_name || 'Interview Session'}
                  </h3>
                  {inv.job_title && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {inv.job_title}
                    </p>
                  )}

                  {/* Date & Time */}
                  <div className="mt-4 p-3 rounded-xl bg-navy-850 border border-navy-800 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-white font-medium">
                      <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{formatDateTime(inv.interview_date)}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-6">
                      {formatRelativeDate(inv.interview_date)}
                    </div>
                  </div>

                  {/* Preparation Notes snippet */}
                  {inv.preparation_notes && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-navy-950/60 border border-navy-800/80">
                      <FileText className="w-3.5 h-3.5 text-primary-400 flex-shrink-0 mt-0.5" />
                      <p className="line-clamp-2 text-[11px] leading-relaxed">
                        {inv.preparation_notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-navy-800/80 flex items-center justify-between gap-2">
                  <div>
                    {inv.meeting_link ? (
                      <a
                        href={inv.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-sm"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Call</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">No link</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {isScheduled && (
                      <button
                        onClick={() => handleStatusQuickChange(inv.id, 'Completed')}
                        title="Mark Completed"
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingInv(inv);
                        setIsModalOpen(true);
                      }}
                      title="Edit"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingInv(inv);
                        setIsConfirmOpen(true);
                      }}
                      title="Delete"
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <InterviewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInv(null);
        }}
        onSubmit={handleSubmit}
        applications={applications}
        initialData={editingInv}
        loading={actionLoading}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeletingInv(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Interview"
        message="Are you sure you want to remove this scheduled interview record?"
        confirmText="Delete Interview"
        loading={actionLoading}
      />
    </div>
  );
}
