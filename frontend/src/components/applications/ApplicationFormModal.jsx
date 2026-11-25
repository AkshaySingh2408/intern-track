import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import {
  APPLICATION_STATUSES,
  WORK_MODES,
  EMPLOYMENT_TYPES
} from '../../utils/constants';

export default function ApplicationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const isEditing = !!initialData?.id;

  const getTodayISO = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    job_description: '',
    company_website: '',
    application_url: '',
    location: '',
    work_mode: 'Remote',
    employment_type: 'Internship',
    salary: '',
    application_date: getTodayISO(),
    deadline: '',
    status: 'Applied',
    recruiter_name: '',
    recruiter_email: '',
    interview_date: '',
    notes: '',
    resume_version: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || '',
        job_title: initialData.job_title || '',
        job_description: initialData.job_description || '',
        company_website: initialData.company_website || '',
        application_url: initialData.application_url || '',
        location: initialData.location || '',
        work_mode: initialData.work_mode || 'Remote',
        employment_type: initialData.employment_type || 'Internship',
        salary: initialData.salary || '',
        application_date: initialData.application_date
          ? initialData.application_date.split('T')[0]
          : getTodayISO(),
        deadline: initialData.deadline ? initialData.deadline.split('T')[0] : '',
        status: initialData.status || 'Applied',
        recruiter_name: initialData.recruiter_name || '',
        recruiter_email: initialData.recruiter_email || '',
        interview_date: initialData.interview_date
          ? initialData.interview_date.substring(0, 16)
          : '',
        notes: initialData.notes || '',
        resume_version: initialData.resume_version || '',
      });
    } else {
      setFormData({
        company_name: '',
        job_title: '',
        job_description: '',
        company_website: '',
        application_url: '',
        location: '',
        work_mode: 'Remote',
        employment_type: 'Internship',
        salary: '',
        application_date: getTodayISO(),
        deadline: '',
        status: 'Applied',
        recruiter_name: '',
        recruiter_email: '',
        interview_date: '',
        notes: '',
        resume_version: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

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

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...formData,
      application_date: formData.application_date
        ? new Date(formData.application_date).toISOString()
        : null,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      interview_date: formData.interview_date
        ? new Date(formData.interview_date).toISOString()
        : null,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Internship Application' : 'Add New Internship Application'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Core Company & Role */}
        <div>
          <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-3">
            Company & Role Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g. Google, Stripe, Apple"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                  errors.company_name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-navy-700'
                }`}
              />
              {errors.company_name && (
                <p className="text-xs text-rose-400 mt-1">{errors.company_name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Job / Internship Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="e.g. Software Engineering Intern"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                  errors.job_title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-navy-700'
                }`}
              />
              {errors.job_title && (
                <p className="text-xs text-rose-400 mt-1">{errors.job_title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Mountain View, CA or Remote"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Work Mode
              </label>
              <select
                name="work_mode"
                value={formData.work_mode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                {WORK_MODES.map((mode) => (
                  <option key={mode} value={mode} className="bg-navy-900 text-white">
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Status & Compensation */}
        <div>
          <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-3">
            Status, Compensation & Employment
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                {APPLICATION_STATUSES.map((st) => (
                  <option key={st} value={st} className="bg-navy-900 text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Salary / Hourly Stipend
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $55/hr or $8,000/mo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Employment Type
              </label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-navy-900 text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Important Dates & Timeline */}
        <div>
          <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-3">
            Dates & Deadlines
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application Date
              </label>
              <input
                type="date"
                name="application_date"
                value={formData.application_date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Interview Date (if set)
              </label>
              <input
                type="datetime-local"
                name="interview_date"
                value={formData.interview_date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: URLs, Recruiter Info & Resume */}
        <div>
          <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-3">
            URLs, Recruiter & Resume
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company Website
              </label>
              <input
                type="url"
                name="company_website"
                value={formData.company_website}
                onChange={handleChange}
                placeholder="https://company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application URL / Job Posting
              </label>
              <input
                type="url"
                name="application_url"
                value={formData.application_url}
                onChange={handleChange}
                placeholder="https://company.com/jobs/123"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Recruiter Name
              </label>
              <input
                type="text"
                name="recruiter_name"
                value={formData.recruiter_name}
                onChange={handleChange}
                placeholder="e.g. Jessica Taylor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Recruiter Email
              </label>
              <input
                type="email"
                name="recruiter_email"
                value={formData.recruiter_email}
                onChange={handleChange}
                placeholder="recruiter@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Resume Version or Filename
              </label>
              <input
                type="text"
                name="resume_version"
                value={formData.resume_version}
                onChange={handleChange}
                placeholder="e.g. SWE_Resume_Google_v3.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Description & Notes */}
        <div>
          <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-3">
            Description & Notes
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Job Description / Responsibilities
              </label>
              <textarea
                name="job_description"
                rows={3}
                value={formData.job_description}
                onChange={handleChange}
                placeholder="Key requirements, tech stack, responsibilities..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Personal Notes & Prep Log
              </label>
              <textarea
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Referrals, interview impressions, prep materials..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
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
            {loading ? 'Saving...' : isEditing ? 'Update Application' : 'Save Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
