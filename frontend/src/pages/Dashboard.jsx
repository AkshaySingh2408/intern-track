import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/common/StatCard';
import { StatCardSkeleton, ChartSkeleton } from '../components/common/Skeleton';
import { formatDate, formatDateTime, formatRelativeDate } from '../../src/utils/formatters';
import { STATUS_COLORS } from '../utils/constants';
import {
  Briefcase,
  Send,
  Eye,
  FileQuestion,
  CalendarCheck,
  Award,
  XCircle,
  TrendingUp,
  Clock,
  Video,
  ExternalLink,
  ChevronRight,
  Plus,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function Dashboard({ onQuickAdd, onViewApplication }) {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, anaRes, recRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getAnalytics(),
        dashboardService.getRecent(),
      ]);
      setSummary(sumRes.data);
      setAnalytics(anaRes.data);
      setRecent(recRes.data);
    } catch (err) {
      console.error('Dashboard data error:', err);
      showToast('Failed to load dashboard metrics. Reconnecting...', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900 border border-navy-700/80 p-3 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-white mb-1">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="flex items-center gap-2" style={{ color: entry.color || entry.fill }}>
              <span>{entry.name}:</span>
              <span className="font-bold text-white">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Applications Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time pipeline analytics, scheduled interviews, and application deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onQuickAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-950/50 hover:shadow-primary-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* 7 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {loading ? (
          [...Array(7)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total"
              value={summary?.total || 0}
              icon={Briefcase}
              color="blue"
              onClick={() => navigate('/applications')}
            />
            <StatCard
              title="Applied"
              value={summary?.applied || 0}
              icon={Send}
              color="blue"
              onClick={() => navigate('/applications?status=Applied')}
            />
            <StatCard
              title="Under Review"
              value={summary?.under_review || 0}
              icon={Eye}
              color="amber"
              onClick={() => navigate('/applications?status=Under Review')}
            />
            <StatCard
              title="Online Assess"
              value={summary?.online_assessment || 0}
              icon={FileQuestion}
              color="purple"
              onClick={() => navigate('/applications?status=Online Assessment')}
            />
            <StatCard
              title="Interviews"
              value={summary?.interview || 0}
              icon={CalendarCheck}
              color="cyan"
              trend={`${summary?.interview_conversion_rate || 0}% rate`}
              onClick={() => navigate('/interviews')}
            />
            <StatCard
              title="Offers"
              value={summary?.offer || 0}
              icon={Award}
              color="emerald"
              trend={`${summary?.offer_conversion_rate || 0}% rate`}
              onClick={() => navigate('/applications?status=Offer')}
            />
            <StatCard
              title="Rejected"
              value={summary?.rejected || 0}
              icon={XCircle}
              color="rose"
              onClick={() => navigate('/applications?status=Rejected')}
            />
          </>
        )}
      </div>

      {/* Conversion Rate Highlights */}
      {!loading && summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-850 border border-cyan-500/20 flex items-center justify-between shadow-card">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Interview Conversion Rate
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-white">
                    {summary.interview_conversion_rate}%
                  </span>
                  <span className="text-xs text-cyan-400 font-medium">
                    ({summary.interview} of {summary.total} applications)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/interviews')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              View Interviews <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-850 border border-emerald-500/20 flex items-center justify-between shadow-card">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Offer Conversion Rate
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-white">
                    {summary.offer_conversion_rate}%
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">
                    ({summary.offer} offers secured)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/applications?status=Offer')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              View Offers <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Applications Over Time (Past 30 Days) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Applications Submitted Over Time
              </h3>
              <p className="text-xs text-slate-400">Daily velocity over the past 30 days</p>
            </div>
          </div>
          <div className="h-64 w-full">
            {loading ? (
              <ChartSkeleton />
            ) : analytics?.applications_over_time?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.applications_over_time} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="appColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stop-color="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stop-color="#3B82F6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Applications"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#appColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                No timeline data available
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Status Distribution (Donut) */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-card flex flex-col">
          <h3 className="text-base font-bold text-white tracking-tight mb-1">
            Status Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-2">Current stage distribution</p>
          <div className="h-64 w-full flex items-center justify-center">
            {loading ? (
              <ChartSkeleton />
            ) : analytics?.status_distribution?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.status_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analytics.status_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-slate-500 text-xs">No status data</span>
            )}
          </div>
          {/* Status mini legend */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {analytics?.status_distribution?.map((item) => (
              <span key={item.name} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name} ({item.value})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Statistics Chart & Smart Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-card flex flex-col">
          <h3 className="text-base font-bold text-white tracking-tight mb-1">
            Monthly Pipeline Progression
          </h3>
          <p className="text-xs text-slate-400 mb-4">Volume of applications, interviews, and offers over 6 months</p>
          <div className="h-64 w-full">
            {loading ? (
              <ChartSkeleton />
            ) : analytics?.monthly_stats?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthly_stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="applications" name="Applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interviews" name="Interviews" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="offers" name="Offers" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                No monthly data
              </div>
            )}
          </div>
        </div>

        {/* Actionable Insights Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-850 border border-primary-500/20 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Insights</span>
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight mb-3">
              Application Strategy Coach
            </h4>
            <div className="space-y-3">
              {analytics?.insights?.map((insight, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-navy-800/60 border border-navy-700/60 text-xs text-slate-300 leading-relaxed">
                  {insight}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-navy-800">
            <button
              onClick={() => navigate('/analytics')}
              className="w-full py-2 px-3 text-xs font-semibold text-primary-400 hover:text-white bg-primary-600/10 hover:bg-primary-600 rounded-xl transition-all text-center"
            >
              Explore Full Analytics Dashboard →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 3 Lists: Recent Applications, Upcoming Interviews, Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Recently Added Applications */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-white tracking-tight">
              Recently Logged Applications
            </h4>
            <button
              onClick={() => navigate('/applications')}
              className="text-xs font-semibold text-primary-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="flex-1 space-y-2.5">
            {recent?.recent_applications?.length ? (
              recent.recent_applications.map((app) => {
                const style = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;
                return (
                  <div
                    key={app.id}
                    onClick={() => onViewApplication(app)}
                    className="p-3 rounded-xl bg-navy-800/40 hover:bg-navy-800/80 border border-navy-800 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 group-hover:bg-primary-600 transition-colors">
                        {app.company_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white group-hover:text-primary-300 transition-colors truncate block">
                          {app.job_title}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {app.company_name} · {formatDate(app.application_date)}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.badge} flex-shrink-0`}>
                      {app.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-navy-800 rounded-xl">
                No recent applications
              </div>
            )}
          </div>
        </div>

        {/* 2. Upcoming Interviews */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">
                Upcoming Interviews
              </h4>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                {recent?.upcoming_interviews?.length || 0}
              </span>
            </div>
            <button
              onClick={() => navigate('/interviews')}
              className="text-xs font-semibold text-primary-400 hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="flex-1 space-y-2.5">
            {recent?.upcoming_interviews?.length ? (
              recent.upcoming_interviews.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 rounded-xl bg-navy-800/40 border border-cyan-500/20 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {inv.interview_type} Interview
                      </span>
                      <span className="text-[11px] text-cyan-400 font-semibold block">
                        {inv.company_name || 'Interview Session'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-navy-900 px-2 py-0.5 rounded-md border border-navy-700">
                      {formatRelativeDate(inv.interview_date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-navy-750">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {formatDateTime(inv.interview_date)}
                    </span>

                    {inv.meeting_link && (
                      <a
                        href={inv.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
                      >
                        <Video className="w-3 h-3" />
                        <span>Join</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-navy-800 rounded-xl">
                No upcoming interviews scheduled
              </div>
            )}
          </div>
        </div>

        {/* 3. Upcoming Deadlines */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-white tracking-tight">
              Upcoming Deadlines
            </h4>
            <button
              onClick={() => navigate('/calendar')}
              className="text-xs font-semibold text-primary-400 hover:underline"
            >
              Calendar View
            </button>
          </div>

          <div className="flex-1 space-y-2.5">
            {recent?.upcoming_deadlines?.length ? (
              recent.upcoming_deadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="p-3 rounded-xl bg-navy-800/40 border border-amber-500/20 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white truncate block">
                      {dl.company_name}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {dl.job_title}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 block">
                      {formatDate(dl.deadline)}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {formatRelativeDate(dl.deadline)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-navy-800 rounded-xl">
                No urgent deadlines approaching
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
