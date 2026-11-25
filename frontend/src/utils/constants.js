export const APPLICATION_STATUSES = [
  'Wishlist',
  'Applied',
  'Under Review',
  'Online Assessment',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn'
];

export const STATUS_COLORS = {
  Wishlist: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    dot: 'bg-slate-400',
    hex: '#64748B'
  },
  Applied: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    dot: 'bg-blue-400',
    hex: '#3B82F6'
  },
  'Under Review': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
    hex: '#F59E0B'
  },
  'Online Assessment': {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    dot: 'bg-purple-400',
    hex: '#8B5CF6'
  },
  Interview: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    dot: 'bg-cyan-400',
    hex: '#06B6D4'
  },
  Offer: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
    hex: '#10B981'
  },
  Rejected: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
    hex: '#F43F5E'
  },
  Withdrawn: {
    bg: 'bg-slate-700/20',
    text: 'text-slate-400',
    border: 'border-slate-700/40',
    badge: 'bg-slate-700/30 text-slate-400 border-slate-700/50',
    dot: 'bg-slate-500',
    hex: '#475569'
  }
};

export const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
export const EMPLOYMENT_TYPES = ['Internship', 'Co-op', 'Full-time', 'Contract'];
export const INTERVIEW_TYPES = ['Technical', 'HR', 'Behavioral', 'System Design', 'Other'];
export const INTERVIEW_STATUSES = ['Scheduled', 'Completed', 'Cancelled'];
export const REMINDER_PRIORITIES = ['Low', 'Medium', 'High'];
