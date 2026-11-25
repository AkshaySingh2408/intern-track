import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileService } from '../services/api';
import { WORK_MODES } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import {
  User,
  Mail,
  GraduationCap,
  Briefcase,
  MapPin,
  Laptop,
  Save,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    college: '',
    degree: '',
    graduation_year: '',
    target_role: '',
    preferred_locations: '',
    preferred_work_mode: 'Hybrid',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        college: user.college || '',
        degree: user.degree || '',
        graduation_year: user.graduation_year || '',
        target_role: user.target_role || '',
        preferred_locations: user.preferred_locations || '',
        preferred_work_mode: user.preferred_work_mode || 'Hybrid',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'graduation_year' ? (value ? parseInt(value, 10) : '') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      showToast('Full name is required', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await profileService.updateProfile(formData);
      updateUser(res.data);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update profile';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Profile & Career Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal details, target roles, and academic background.
        </p>
      </div>

      {/* Account Overview Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-850 border border-navy-800 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {user?.full_name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-primary-400" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Member since {formatDate(user?.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start sm:self-center">
          <ShieldCheck className="w-4 h-4" />
          <span>Active Student Profile</span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <h3 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-4">
            Personal & Academic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Alex Chen"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address (Permanent)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-950/60 border border-navy-800 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                College / University
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. Stanford University, MIT, UC Berkeley"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Degree & Major
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. B.S. in Computer Science & Mathematics"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Expected Graduation Year
              </label>
              <input
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleChange}
                placeholder="2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-navy-800">
          <h3 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-4">
            Target Roles & Job Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Job Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="target_role"
                  value={formData.target_role}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer Intern, Data Science"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Preferred Work Mode
              </label>
              <div className="relative">
                <Laptop className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  name="preferred_work_mode"
                  value={formData.preferred_work_mode}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                >
                  {WORK_MODES.map((mode) => (
                    <option key={mode} value={mode} className="bg-navy-900 text-white">
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Preferred Locations
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="preferred_locations"
                  value={formData.preferred_locations}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA; New York, NY; Seattle, WA; Remote"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-navy-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 shadow-md shadow-primary-950/50 hover:shadow-primary-600/30 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
