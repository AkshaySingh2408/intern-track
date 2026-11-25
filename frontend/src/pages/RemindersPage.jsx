import React, { useState, useEffect, useCallback } from 'react';
import { reminderService, noteService, applicationService } from '../services/api';
import { useToast } from '../context/ToastContext';
import ReminderModal from '../components/reminders/ReminderModal';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { formatDateTime, formatRelativeDate } from '../../src/utils/formatters';
import {
  Bell,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Pencil,
  FileText,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reminders modal state
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  // Notes modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', application_id: '' });

  // Delete confirm state
  const [deletingItem, setDeletingItem] = useState(null); // { type: 'reminder' | 'note', item }
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [remsRes, notesRes, appsRes] = await Promise.all([
        reminderService.getReminders(),
        noteService.getNotes(),
        applicationService.getApplications({ page_size: 500 }),
      ]);
      setReminders(remsRes.data || []);
      setNotes(notesRes.data || []);
      setApplications(appsRes.data.items || []);
    } catch (err) {
      console.error('Fetch reminders error:', err);
      showToast('Failed to load reminders and notes', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Toggle Completion
  const handleToggleComplete = async (rem) => {
    const updated = !rem.is_completed;
    try {
      setReminders((prev) =>
        prev.map((r) => (r.id === rem.id ? { ...r, is_completed: updated } : r))
      );
      await reminderService.updateReminder(rem.id, { is_completed: updated });
      showToast(updated ? 'Reminder marked as completed!' : 'Reminder reopened', 'info');
    } catch (err) {
      showToast('Failed to update status', 'error');
      fetchData();
    }
  };

  // Submit Reminder
  const handleReminderSubmit = async (payload) => {
    try {
      setActionLoading(true);
      if (editingReminder?.id) {
        const res = await reminderService.updateReminder(editingReminder.id, payload);
        showToast('Reminder updated', 'success');
        setReminders((prev) =>
          prev.map((r) => (r.id === editingReminder.id ? res.data : r))
        );
      } else {
        const res = await reminderService.createReminder(payload);
        showToast('New reminder created!', 'success');
        setReminders((prev) => [res.data, ...prev]);
      }
      setIsReminderModalOpen(false);
      setEditingReminder(null);
    } catch (err) {
      showToast('Failed to save reminder', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Note
  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      showToast('Title and content are required', 'warning');
      return;
    }
    try {
      setActionLoading(true);
      const payload = {
        title: noteForm.title,
        content: noteForm.content,
        application_id: noteForm.application_id ? parseInt(noteForm.application_id, 10) : null,
      };

      if (editingNote?.id) {
        const res = await noteService.updateNote(editingNote.id, payload);
        showToast('Note updated', 'success');
        setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? res.data : n)));
      } else {
        const res = await noteService.createNote(payload);
        showToast('Note saved!', 'success');
        setNotes((prev) => [res.data, ...prev]);
      }
      setIsNoteModalOpen(false);
      setEditingNote(null);
      setNoteForm({ title: '', content: '', application_id: '' });
    } catch (err) {
      showToast('Failed to save note', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    try {
      setActionLoading(true);
      if (deletingItem.type === 'reminder') {
        await reminderService.deleteReminder(deletingItem.item.id);
        setReminders((prev) => prev.filter((r) => r.id !== deletingItem.item.id));
        showToast('Reminder deleted', 'success');
      } else {
        await noteService.deleteNote(deletingItem.item.id);
        setNotes((prev) => prev.filter((n) => n.id !== deletingItem.item.id));
        showToast('Note deleted', 'success');
      }
      setIsConfirmOpen(false);
      setDeletingItem(null);
    } catch (err) {
      showToast('Failed to delete item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Reminders & Personal Notes
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Never miss an assessment deadline, cold-email follow-up, or key interview reflection.
        </p>
      </div>

      {/* Grid: Left Column (Reminders), Right Column (Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reminders Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Action Items & Reminders
              </h2>
            </div>
            <button
              onClick={() => {
                setEditingReminder(null);
                setIsReminderModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reminder</span>
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-navy-900 border border-navy-800 animate-pulse" />
              ))}
            </div>
          ) : reminders.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No pending reminders"
              description="Stay ahead of deadlines by adding follow-up tasks and assessments."
              actionLabel="Add Reminder"
              onAction={() => {
                setEditingReminder(null);
                setIsReminderModalOpen(true);
              }}
            />
          ) : (
            <div className="space-y-2.5">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    rem.is_completed
                      ? 'bg-navy-950/40 border-navy-800/60 opacity-60'
                      : 'bg-navy-900 border-navy-800 hover:border-navy-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggleComplete(rem)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                    >
                      {rem.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-white" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-sm font-semibold text-white ${
                            rem.is_completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {rem.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${getPriorityStyle(
                            rem.priority
                          )}`}
                        >
                          {rem.priority}
                        </span>
                      </div>

                      {rem.description && (
                        <p className="text-xs text-slate-400 leading-relaxed mb-2">
                          {rem.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-primary-400" />
                          <span>{formatDateTime(rem.due_date)}</span>
                          <span className="text-slate-500 font-medium">({formatRelativeDate(rem.due_date)})</span>
                        </span>
                        {rem.company_name && (
                          <span className="text-primary-400 font-medium">
                            Linked: {rem.company_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingReminder(rem);
                        setIsReminderModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-white hover:bg-navy-800 rounded transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingItem({ type: 'reminder', item: rem });
                        setIsConfirmOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Preparation Notes & Reflections
              </h2>
            </div>
            <button
              onClick={() => {
                setEditingNote(null);
                setNoteForm({ title: '', content: '', application_id: '' });
                setIsNoteModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Note</span>
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-navy-900 border border-navy-800 animate-pulse" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No notes logged"
              description="Keep recruiter screen insights, technical solutions, and behavioral reflections documented."
              actionLabel="Add Note"
              onAction={() => {
                setEditingNote(null);
                setNoteForm({ title: '', content: '', application_id: '' });
                setIsNoteModalOpen(true);
              }}
            />
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl bg-navy-900 border border-navy-800 hover:border-navy-700 transition-all shadow-sm space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {note.title}
                      </h3>
                      {note.company_name && (
                        <span className="text-[11px] font-semibold text-primary-400 mt-0.5 block">
                          Company: {note.company_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingNote(note);
                          setNoteForm({
                            title: note.title,
                            content: note.content,
                            application_id: note.application_id || '',
                          });
                          setIsNoteModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-white hover:bg-navy-800 rounded transition-colors"
                        title="Edit Note"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingItem({ type: 'note', item: note });
                          setIsConfirmOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-navy-950/60 p-3 rounded-lg border border-navy-800/80">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setEditingReminder(null);
        }}
        onSubmit={handleReminderSubmit}
        applications={applications}
        initialData={editingReminder}
        loading={actionLoading}
      />

      {/* Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        title={editingNote ? 'Edit Note' : 'Add Note'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleNoteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Note Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={noteForm.title}
              onChange={(e) => setNoteForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Google System Design Feedback"
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Linked Internship (Optional)
            </label>
            <select
              value={noteForm.application_id}
              onChange={(e) => setNoteForm((prev) => ({ ...prev, application_id: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="" className="bg-navy-900 text-slate-400">
                General Note
              </option>
              {applications.map((app) => (
                <option key={app.id} value={app.id} className="bg-navy-900 text-white">
                  {app.company_name} — {app.job_title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Note Content <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={noteForm.content}
              onChange={(e) => setNoteForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Record interviewer questions, algorithmic edge cases, company culture details..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-800">
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              disabled={actionLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-navy-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deletingItem?.type === 'reminder' ? 'Reminder' : 'Note'}`}
        message="Are you sure you want to delete this record? This cannot be undone."
        confirmText="Yes, Delete"
        loading={actionLoading}
      />
    </div>
  );
}
