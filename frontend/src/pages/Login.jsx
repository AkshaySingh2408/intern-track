import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Compass, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Signed in successfully. Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('alex.chen@university.edu');
    setPassword('DemoPass123!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-navy-950">
      <div className="w-full max-w-md">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-cyan-400 p-0.5 shadow-xl shadow-primary-950/60 mb-4">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Compass className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign in to InternTrack
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your internship applications, interviews, and offers in one place.
          </p>
        </div>

        {/* Card */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-navy-950/90 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-all shadow-md shadow-primary-950/40 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Pill */}
          <div className="mt-6 pt-5 border-t border-navy-800 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/60 transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>Click here to fill Demo Account credentials</span>
            </button>
            <p className="mt-2 text-[11px] text-slate-500">
              Demo: <code className="text-slate-400">alex.chen@university.edu</code> / <code className="text-slate-400">DemoPass123!</code>
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-300 underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
