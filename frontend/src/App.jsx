import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ApplicationFormModal from './components/applications/ApplicationFormModal';
import ApplicationDetailsModal from './components/applications/ApplicationDetailsModal';
import InterviewModal from './components/interviews/InterviewModal';
import { applicationService, interviewService } from './services/api';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Interviews from './pages/Interviews';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RemindersPage from './pages/RemindersPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';

function ProtectedLayout({ children, onQuickAdd, onViewApplication }) {
  const { isAuthenticated, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading InternTrack...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Navbar
          onOpenMobile={() => setMobileOpen(true)}
          onQuickAdd={onQuickAdd}
        />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function MainApp() {
  const { showToast } = useToast();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddLoading, setQuickAddLoading] = useState(false);

  // Global View Application modal
  const [viewingApp, setViewingApp] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Interview modal
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [appForInterview, setAppForInterview] = useState(null);

  const handleCreateApplication = async (payload) => {
    try {
      setQuickAddLoading(true);
      const res = await applicationService.createApplication(payload);
      showToast(`Added ${res.data.company_name} application!`, 'success');
      setIsQuickAddOpen(false);
      // If currently on applications page or dashboard, trigger reload/navigation
      window.dispatchEvent(new CustomEvent('application-created', { detail: res.data }));
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to create application', 'error');
    } finally {
      setQuickAddLoading(false);
    }
  };

  const handleViewApplication = (app) => {
    setViewingApp(app);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await applicationService.updateStatus(id, status);
      setViewingApp((prev) => (prev ? { ...prev, status } : null));
      showToast(`Status updated to "${status}"`, 'info');
      window.dispatchEvent(new CustomEvent('application-updated', { detail: { id, status } }));
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleAddInterview = (app) => {
    setAppForInterview(app);
    setIsInterviewModalOpen(true);
  };

  const handleInterviewSubmit = async (payload) => {
    try {
      setQuickAddLoading(true);
      await interviewService.createInterview(payload);
      showToast('Interview scheduled!', 'success');
      setIsInterviewModalOpen(false);
      setAppForInterview(null);
    } catch (err) {
      showToast('Failed to schedule interview', 'error');
    } finally {
      setQuickAddLoading(false);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedLayout
              onQuickAdd={() => setIsQuickAddOpen(true)}
              onViewApplication={handleViewApplication}
            >
              <Dashboard
                onQuickAdd={() => setIsQuickAddOpen(true)}
                onViewApplication={handleViewApplication}
              />
            </ProtectedLayout>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedLayout
              onQuickAdd={() => setIsQuickAddOpen(true)}
              onViewApplication={handleViewApplication}
            >
              <Applications />
            </ProtectedLayout>
          }
        />

        <Route
          path="/interviews"
          element={
            <ProtectedLayout
              onQuickAdd={() => setIsQuickAddOpen(true)}
              onViewApplication={handleViewApplication}
            >
              <Interviews />
            </ProtectedLayout>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedLayout
              onQuickAdd={() => setIsQuickAddOpen(true)}
              onViewApplication={handleViewApplication}
            >
              <CalendarPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedLayout
              onQuickAdd={() => setIsQuickAddOpen(true)}
              onViewApplication={handleViewApplication}
            >
              <AnalyticsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/reminders"
          element={
            <ProtectedLayout
              onQuickAdd={() => setIsQuickAddOpen(true)}
              onViewApplication={handleViewApplication}
            >
              <RemindersPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedLayout
              onQuickAdd={() => setIsQuickAddOpen(true)}
              onViewApplication={handleViewApplication}
            >
              <ProfilePage />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global Quick Add Modal */}
      <ApplicationFormModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSubmit={handleCreateApplication}
        loading={quickAddLoading}
      />

      {/* Global Application Details Modal */}
      <ApplicationDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setViewingApp(null);
        }}
        application={viewingApp}
        onEdit={(app) => {
          setIsDetailsOpen(false);
          window.location.href = '/applications';
        }}
        onDelete={(app) => {
          setIsDetailsOpen(false);
          window.location.href = '/applications';
        }}
        onStatusChange={handleStatusChange}
        onAddInterview={handleAddInterview}
      />

      {/* Global Interview Modal from Details */}
      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => {
          setIsInterviewModalOpen(false);
          setAppForInterview(null);
        }}
        onSubmit={handleInterviewSubmit}
        preselectedApplication={appForInterview}
        loading={quickAddLoading}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
