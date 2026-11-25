import React, { useState, useEffect, useCallback } from 'react';
import { applicationService, interviewService } from '../services/api';
import { useToast } from '../context/ToastContext';
import ApplicationTableView from '../components/applications/ApplicationTableView';
import ApplicationKanbanView from '../components/applications/ApplicationKanbanView';
import ApplicationFormModal from '../components/applications/ApplicationFormModal';
import ApplicationDetailsModal from '../components/applications/ApplicationDetailsModal';
import InterviewModal from '../components/interviews/InterviewModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  APPLICATION_STATUSES,
  WORK_MODES
} from '../utils/constants';
import {
  Search,
  Filter,
  ArrowUpDown,
  Table,
  Kanban,
  Plus,
  RefreshCw,
  X
} from 'lucide-react';

export default function Applications({
  initialQuickAdd = false,
  onResetQuickAdd = () => {},
}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('application_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deletingApp, setDeletingApp] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Interview modal trigger from application
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [appForInterview, setAppForInterview] = useState(null);

  const { showToast } = useToast();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: search.trim() || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        work_mode: workModeFilter !== 'All' ? workModeFilter : undefined,
        sort_by: sortBy,
        order: sortOrder,
        page_size: 500,
      };
      const res = await applicationService.getApplications(params);
      setApplications(res.data.items || []);
    } catch (err) {
      console.error('Fetch applications error:', err);
      showToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, workModeFilter, sortBy, sortOrder, showToast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    if (initialQuickAdd) {
      setEditingApp(null);
      setIsFormOpen(true);
      onResetQuickAdd();
    }
  }, [initialQuickAdd, onResetQuickAdd]);

  // Handle Form Submit (Add / Edit)
  const handleFormSubmit = async (payload) => {
    try {
      setActionLoading(true);
      if (editingApp?.id) {
        const res = await applicationService.updateApplication(editingApp.id, payload);
        showToast(`Updated ${res.data.company_name} application`, 'success');
        setApplications((prev) =>
          prev.map((a) => (a.id === editingApp.id ? res.data : a))
        );
        if (selectedApp?.id === editingApp.id) {
          setSelectedApp(res.data);
        }
      } else {
        const res = await applicationService.createApplication(payload);
        showToast(`Added ${res.data.company_name} to your applications!`, 'success');
        setApplications((prev) => [res.data, ...prev]);
      }
      setIsFormOpen(false);
      setEditingApp(null);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save application';
      showToast(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Status Change (Table select or Kanban drop)
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optimistic update
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      if (selectedApp?.id === id) {
        setSelectedApp((prev) => ({ ...prev, status: newStatus }));
      }
      await applicationService.updateStatus(id, newStatus);
      showToast(`Status updated to "${newStatus}"`, 'info');
    } catch (err) {
      showToast('Failed to update status', 'error');
      fetchApplications();
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingApp) return;
    try {
      setActionLoading(true);
      await applicationService.deleteApplication(deletingApp.id);
      showToast(`Deleted ${deletingApp.company_name} application`, 'success');
      setApplications((prev) => prev.filter((a) => a.id !== deletingApp.id));
      setIsConfirmOpen(false);
      setDeletingApp(null);
      if (selectedApp?.id === deletingApp.id) {
        setIsDetailsOpen(false);
        setSelectedApp(null);
      }
    } catch (err) {
      showToast('Failed to delete application', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Schedule Interview for application
  const handleAddInterview = (app) => {
    setAppForInterview(app);
    setIsInterviewModalOpen(true);
  };

  const handleInterviewSubmit = async (payload) => {
    try {
      setActionLoading(true);
      await interviewService.createInterview(payload);
      showToast('Interview session scheduled successfully!', 'success');
      setIsInterviewModalOpen(false);
      setAppForInterview(null);
      fetchApplications();
    } catch (err) {
      showToast('Failed to schedule interview', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setWorkModeFilter('All');
    setSortBy('application_date');
    setSortOrder('desc');
  };

  const hasActiveFilters = search || statusFilter !== 'All' || workModeFilter !== 'All';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Internship Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track, filter, and advance all your job applications across every hiring phase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher: Table vs Kanban */}
          <div className="flex items-center bg-navy-900 border border-navy-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingApp(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-950/50 hover:shadow-primary-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Application</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-navy-800 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, job title, or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-800/80 border border-navy-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-navy-800/80 border border-navy-700 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="All">All Statuses</option>
              {APPLICATION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Work Mode Filter */}
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-navy-800/80 border border-navy-700 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="All">All Work Modes</option>
              {WORK_MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="px-3 py-2 rounded-xl bg-navy-800/80 border border-navy-700 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="application_date-desc">Newest First</option>
              <option value="application_date-asc">Oldest First</option>
              <option value="company_name-asc">Company (A-Z)</option>
              <option value="company_name-desc">Company (Z-A)</option>
              <option value="deadline-asc">Deadline (Upcoming)</option>
            </select>

            {/* Refresh / Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                title="Clear Filters"
                className="p-2 text-slate-400 hover:text-white bg-navy-800 hover:bg-navy-700 rounded-xl transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={fetchApplications}
              title="Refresh"
              className="p-2 text-slate-400 hover:text-white bg-navy-800 hover:bg-navy-700 rounded-xl transition-colors flex-shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Table or Kanban */}
      {viewMode === 'table' ? (
        <ApplicationTableView
          applications={applications}
          loading={loading}
          onView={(app) => {
            setSelectedApp(app);
            setIsDetailsOpen(true);
          }}
          onEdit={(app) => {
            setEditingApp(app);
            setIsFormOpen(true);
          }}
          onDelete={(app) => {
            setDeletingApp(app);
            setIsConfirmOpen(true);
          }}
          onStatusChange={handleStatusChange}
          onQuickAdd={() => {
            setEditingApp(null);
            setIsFormOpen(true);
          }}
        />
      ) : (
        <ApplicationKanbanView
          applications={applications}
          loading={loading}
          onView={(app) => {
            setSelectedApp(app);
            setIsDetailsOpen(true);
          }}
          onEdit={(app) => {
            setEditingApp(app);
            setIsFormOpen(true);
          }}
          onStatusChange={handleStatusChange}
          onQuickAdd={() => {
            setEditingApp(null);
            setIsFormOpen(true);
          }}
        />
      )}

      {/* Add / Edit Application Modal */}
      <ApplicationFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingApp(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingApp}
        loading={actionLoading}
      />

      {/* View Application Details Modal */}
      <ApplicationDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedApp(null);
        }}
        application={selectedApp}
        onEdit={(app) => {
          setEditingApp(app);
          setIsFormOpen(true);
        }}
        onDelete={(app) => {
          setDeletingApp(app);
          setIsConfirmOpen(true);
        }}
        onStatusChange={handleStatusChange}
        onAddInterview={handleAddInterview}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeletingApp(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Internship Application"
        message={`Are you sure you want to permanently delete the application for "${deletingApp?.company_name} - ${deletingApp?.job_title}"? This will also remove any linked interviews and reminders.`}
        confirmText="Yes, Delete"
        loading={actionLoading}
      />

      {/* Quick Schedule Interview Modal */}
      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => {
          setIsInterviewModalOpen(false);
          setAppForInterview(null);
        }}
        onSubmit={handleInterviewSubmit}
        applications={applications}
        preselectedApplication={appForInterview}
        loading={actionLoading}
      />
    </div>
  );
}
