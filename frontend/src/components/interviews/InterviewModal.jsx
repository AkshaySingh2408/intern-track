import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { INTERVIEW_TYPES, INTERVIEW_STATUSES } from '../../utils/constants';

export default function InterviewModal({
  isOpen,
  onClose,
  onSubmit,
  applications = [],
  initialData = null,
  preselectedApplication = null,
  loading = false,
}) {
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState({
    application_id: '',
    interview_type: 'Technical',
    interview_date: '',
    meeting_link: '',
    status: 'Scheduled',
    preparation_notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        application_id: initialData.application_id || '',
        interview_type: initialData.interview_type || 'Technical',
        interview_date: initialData.interview_date
          ? initialData.interview_date.substring(0, 16)
          : '',
        meeting_link: initialData.meeting_link || '',
        status: initialData.status || 'Scheduled',
        preparation_notes: initialData.preparation_notes || '',
      });
    } else if (preselectedApplication) {
      setFormData({
        application_id: preselectedApplication.id || '',
        interview_type: 'Technical',
        interview_date: '',
        meeting_link: '',
        status: 'Scheduled',
        preparation_notes: '',
      });
    } else {
      setFormData({
        application_id: applications.length > 0 ? applications[0].id : '',
        interview_type: 'Technical',
        interview_date: '',
        meeting_link: '',
        status: 'Scheduled',
        preparation_notes: '',
      });
    }
    setErrors({});
  }, [initialData, preselectedApplication, applications, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.application_id) {
      newErrors.application_id = 'Please select an application';
    }
    if (!formData.interview_date) {
      newErrors.interview_date = 'Interview date and time is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      application_id: parseInt(formData.application_id, 10),
      interview_date: new Date(formData.interview_date).toISOString(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Interview Session' : 'Schedule New Interview'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Linked Internship Application <span className="text-rose-400">*</span>
          </label>
          <select
            name="application_id"
            value={formData.application_id}
            onChange={handleChange}
            disabled={isEditing || !!preselectedApplication}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
              errors.application_id ? 'border-rose-500' : 'border-navy-700'
            }`}
          >
            <option value="" disabled className="bg-navy-900 text-slate-500">
              Select an application...
            </option>
            {applications.map((app) => (
              <option key={app.id} value={app.id} className="bg-navy-900 text-white">
                {app.company_name} — {app.job_title}
              </option>
            ))}
          </select>
          {errors.application_id && (
            <p className="text-xs text-rose-400 mt-1">{errors.application_id}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Interview Type
            </label>
            <select
              name="interview_type"
              value={formData.interview_type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {INTERVIEW_TYPES.map((type) => (
                <option key={type} value={type} className="bg-navy-900 text-white">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {INTERVIEW_STATUSES.map((st) => (
                <option key={st} value={st} className="bg-navy-900 text-white">
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Date & Time <span className="text-rose-400">*</span>
            </label>
            <input
              type="datetime-local"
              name="interview_date"
              value={formData.interview_date}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [color-scheme:dark] ${
                errors.interview_date ? 'border-rose-500' : 'border-navy-700'
              }`}
            />
            {errors.interview_date && (
              <p className="text-xs text-rose-400 mt-1">{errors.interview_date}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Meeting URL
            </label>
            <input
              type="url"
              name="meeting_link"
              value={formData.meeting_link}
              onChange={handleChange}
              placeholder="https://meet.google.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Preparation Notes & Topics
          </label>
          <textarea
            name="preparation_notes"
            rows={3}
            value={formData.preparation_notes}
            onChange={handleChange}
            placeholder="Key concepts to review, questions to ask interviewer..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-y"
          />
        </div>

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
            {loading ? 'Saving...' : isEditing ? 'Update Interview' : 'Save Interview'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
