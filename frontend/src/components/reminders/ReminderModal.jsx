import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { REMINDER_PRIORITIES } from '../../utils/constants';

export default function ReminderModal({
  isOpen,
  onClose,
  onSubmit,
  applications = [],
  initialData = null,
  loading = false,
}) {
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium',
    application_id: '',
    is_completed: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        due_date: initialData.due_date ? initialData.due_date.substring(0, 16) : '',
        priority: initialData.priority || 'Medium',
        application_id: initialData.application_id || '',
        is_completed: !!initialData.is_completed,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        priority: 'Medium',
        application_id: '',
        is_completed: false,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      application_id: formData.application_id ? parseInt(formData.application_id, 10) : null,
      due_date: new Date(formData.due_date).toISOString(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Reminder' : 'Set New Reminder'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Reminder Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Complete Stripe CodeSignal OA"
            className={`w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
              errors.title ? 'border-rose-500' : 'border-navy-700'
            }`}
          />
          {errors.title && (
            <p className="text-xs text-rose-400 mt-1">{errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Due Date & Time <span className="text-rose-400">*</span>
            </label>
            <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [color-scheme:dark] ${
                errors.due_date ? 'border-rose-500' : 'border-navy-700'
              }`}
            />
            {errors.due_date && (
              <p className="text-xs text-rose-400 mt-1">{errors.due_date}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {REMINDER_PRIORITIES.map((p) => (
                <option key={p} value={p} className="bg-navy-900 text-white">
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Linked Internship (Optional)
          </label>
          <select
            name="application_id"
            value={formData.application_id}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="" className="bg-navy-900 text-slate-400">
              None (General Reminder)
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
            Details & Checklist
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any specific tasks, links, or instructions..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-y"
          />
        </div>

        {isEditing && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_completed"
              name="is_completed"
              checked={formData.is_completed}
              onChange={handleChange}
              className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 bg-navy-800 border-navy-700"
            />
            <label htmlFor="is_completed" className="text-xs text-slate-300 select-none">
              Mark this reminder as completed
            </label>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-xl transition-all shadow-md shadow-primary-950/40 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Reminder' : 'Set Reminder'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
