import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ChartSkeleton } from '../components/common/Skeleton';
import {
  BarChart3,
  TrendingUp,
  Award,
  Briefcase,
  MapPin,
  Laptop,
  CheckCircle,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.error('Analytics load error:', err);
        showToast('Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [showToast]);

  const WORK_MODE_COLORS = {
    Remote: '#38BDF8',
    Hybrid: '#3B82F6',
    'On-site': '#818CF8',
  };

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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Application Analytics & Performance
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Quantitative breakdown of your conversion funnel, location trends, and application pipeline health.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Applications
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white">
              {analytics?.total_applications || 0}
            </span>
            <p className="text-xs text-slate-400 mt-1">Logged in tracker</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Interviews Scheduled
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white">
              {analytics?.total_interviews || 0}
            </span>
            <p className="text-xs text-cyan-400 mt-1 font-medium">
              {analytics?.interview_conversion_rate || 0}% interview rate
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Offers Received
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white">
              {analytics?.total_offers || 0}
            </span>
            <p className="text-xs text-emerald-400 mt-1 font-medium">
              {analytics?.offer_conversion_rate || 0}% offer conversion
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Funnel Health
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-white">
              {analytics?.total_offers ? 'Offer Stage' : analytics?.total_interviews ? 'Interviewing' : 'Active Pipeline'}
            </span>
            <p className="text-xs text-slate-400 mt-1">Based on current status</p>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Status Breakdown & Monthly Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-card flex flex-col">
          <h3 className="text-base font-bold text-white tracking-tight mb-1">
            Applications by Status
          </h3>
          <p className="text-xs text-slate-400 mb-4">Pipeline distribution across all 8 stages</p>
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
                    innerRadius={60}
                    outerRadius={90}
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
              <span className="text-xs text-slate-500">No applications to display</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center mt-3 pt-3 border-t border-navy-800">
            {analytics?.status_distribution?.map((item) => (
              <span key={item.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: <strong>{item.value}</strong></span>
              </span>
            ))}
          </div>
        </div>

        {/* Monthly Applications Progression */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-card flex flex-col">
          <h3 className="text-base font-bold text-white tracking-tight mb-1">
            Applications Per Month
          </h3>
          <p className="text-xs text-slate-400 mb-4">Historical monthly submission pace</p>
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
      </div>

      {/* Row 2 Charts: Location & Work Mode Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Location */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-card flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-primary-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Top Locations Applied
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">Geographic distribution of opportunities</p>
          <div className="h-64 w-full">
            {loading ? (
              <ChartSkeleton />
            ) : analytics?.location_stats?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.location_stats}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Applications" fill="#38BDF8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                No location data
              </div>
            )}
          </div>
        </div>

        {/* Applications by Work Mode */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-card flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Laptop className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Work Mode Breakdown
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">Remote vs Hybrid vs On-site distribution</p>
          <div className="h-64 w-full flex items-center justify-center">
            {loading ? (
              <ChartSkeleton />
            ) : analytics?.work_mode_stats?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.work_mode_stats}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics.work_mode_stats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={WORK_MODE_COLORS[entry.name] || '#3B82F6'}
                        stroke="#0f172a"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-500">No work mode data</span>
            )}
          </div>
        </div>
      </div>

      {/* Actionable Strategy Recommendations */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-850 border border-primary-500/30 shadow-card">
        <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Lightbulb className="w-4 h-4 text-cyan-400" />
          <span>Actionable Guidance Based on Your Data</span>
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight mb-4">
          Recommended Next Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-navy-800/60 border border-navy-750 space-y-1.5">
            <span className="text-xs font-bold text-cyan-400">1. Conversion Optimization</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Target a 15-25% interview conversion rate. If your current rate is below 15%, tailor your bullet points with quantitative impact metrics.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-navy-800/60 border border-navy-750 space-y-1.5">
            <span className="text-xs font-bold text-emerald-400">2. Interview Follow-ups</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Always send a concise thank-you note within 24 hours of technical or behavioral interviews referencing a specific discussion topic.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-navy-800/60 border border-navy-750 space-y-1.5">
            <span className="text-xs font-bold text-purple-400">3. Application Cadence</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aim for a consistent cadence of 10-15 high-quality applications per week during peak recruiting windows to maximize concurrent offers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
