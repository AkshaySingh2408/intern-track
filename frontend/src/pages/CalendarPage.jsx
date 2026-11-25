import React, { useState, useEffect } from 'react';
import { applicationService, interviewService, reminderService } from '../services/api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import { formatDate, formatDateTime } from '../utils/formatters';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Video,
  Clock,
  AlertTriangle,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const { showToast } = useToast();

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const [appsRes, invsRes, remsRes] = await Promise.all([
        applicationService.getApplications({ page_size: 500 }),
        interviewService.getInterviews(),
        reminderService.getReminders(),
      ]);

      const calendarEvents = [];

      // 1. Application Deadlines
      (appsRes.data.items || []).forEach((app) => {
        if (app.deadline) {
          calendarEvents.push({
            id: `deadline-${app.id}`,
            title: `${app.company_name} Deadline`,
            subtitle: app.job_title,
            date: new Date(app.deadline),
            type: 'deadline',
            color: 'amber',
            raw: app,
          });
        }
      });

      // 2. Interviews
      (invsRes.data || []).forEach((inv) => {
        if (inv.interview_date) {
          calendarEvents.push({
            id: `interview-${inv.id}`,
            title: `${inv.interview_type} Interview`,
            subtitle: inv.company_name,
            date: new Date(inv.interview_date),
            type: 'interview',
            color: 'cyan',
            raw: inv,
          });
        }
      });

      // 3. Reminders
      (remsRes.data || []).forEach((rem) => {
        if (rem.due_date) {
          calendarEvents.push({
            id: `reminder-${rem.id}`,
            title: rem.title,
            subtitle: rem.company_name || 'Reminder',
            date: new Date(rem.due_date),
            type: 'reminder',
            color: 'purple',
            raw: rem,
          });
        }
      });

      setEvents(calendarEvents);
    } catch (err) {
      console.error('Calendar load error:', err);
      showToast('Failed to load calendar events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get events on a specific date (year, month, day)
  const getEventsForDay = (d) => {
    return events.filter((ev) => {
      const evDate = ev.date;
      return (
        evDate.getFullYear() === year &&
        evDate.getMonth() === month &&
        evDate.getDate() === d
      );
    });
  };

  const today = new Date();
  const isCurrentDay = (d) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === d
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Schedule & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deadlines, scheduled interviews, and due reminders in a unified monthly view.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-navy-900 border border-navy-800 hover:bg-navy-800 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-navy-900 border border-navy-800 rounded-xl p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-white min-w-[130px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 p-3 bg-navy-900/60 rounded-xl border border-navy-800">
        <span className="text-slate-300 font-semibold">Event Types:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Interviews</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Application Deadlines</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span>Reminders</span>
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-card">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-navy-800 bg-navy-950/70 text-center py-2.5 text-xs font-semibold text-slate-400">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-navy-800/60 border-t border-navy-800">
          {/* Days from previous month */}
          {[...Array(firstDayIndex)].map((_, i) => {
            const dayNum = prevMonthDays - firstDayIndex + i + 1;
            return (
              <div
                key={`prev-${i}`}
                className="min-h-[100px] sm:min-h-[120px] p-2 bg-navy-950/40 text-slate-600 select-none"
              >
                <span className="text-xs font-medium">{dayNum}</span>
              </div>
            );
          })}

          {/* Days of current month */}
          {[...Array(totalDaysInMonth)].map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = isCurrentDay(day);

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[100px] sm:min-h-[120px] p-2 transition-colors flex flex-col justify-between ${
                  isToday ? 'bg-primary-950/20 ring-1 ring-inset ring-primary-500/40' : 'bg-navy-900 hover:bg-navy-850/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-bold w-6 h-6 rounded-full ${
                      isToday
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-slate-300'
                    }`}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                      {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                    </span>
                  )}
                </div>

                {/* Event Pills */}
                <div className="space-y-1 flex-1 overflow-y-auto max-h-[85px] scrollbar-thin">
                  {dayEvents.map((ev) => {
                    let badgeClass = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                    if (ev.type === 'interview') badgeClass = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
                    if (ev.type === 'deadline') badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                    if (ev.type === 'reminder') badgeClass = 'bg-purple-500/20 text-purple-300 border-purple-500/30';

                    return (
                      <div
                        key={ev.id}
                        onClick={() => {
                          setSelectedEvent(ev);
                          setIsEventModalOpen(true);
                        }}
                        className={`px-2 py-1 rounded-lg border text-[11px] font-medium truncate cursor-pointer hover:opacity-80 transition-opacity ${badgeClass}`}
                      >
                        <span className="font-bold">{ev.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Popup Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        title="Calendar Event Details"
        maxWidth="max-w-md"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-3 rounded-xl border flex-shrink-0 ${
                  selectedEvent.type === 'interview'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : selectedEvent.type === 'deadline'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                }`}
              >
                {selectedEvent.type === 'interview' && <Video className="w-5 h-5" />}
                {selectedEvent.type === 'deadline' && <AlertTriangle className="w-5 h-5" />}
                {selectedEvent.type === 'reminder' && <Clock className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {selectedEvent.type}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  {selectedEvent.title}
                </h3>
                {selectedEvent.subtitle && (
                  <p className="text-xs text-primary-400 font-semibold mt-0.5">
                    {selectedEvent.subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-800/60 border border-navy-700/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CalendarIcon className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span>
                  Date:{' '}
                  <strong className="text-white">
                    {formatDateTime(selectedEvent.date)}
                  </strong>
                </span>
              </div>

              {selectedEvent.type === 'interview' && selectedEvent.raw?.meeting_link && (
                <div className="flex items-center gap-2 pt-1 border-t border-navy-700">
                  <Video className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <a
                    href={selectedEvent.raw.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline truncate"
                  >
                    Join Meeting Link
                  </a>
                </div>
              )}

              {selectedEvent.type === 'interview' && selectedEvent.raw?.preparation_notes && (
                <div className="pt-1 border-t border-navy-700 text-slate-400">
                  <span className="text-slate-300 font-medium block mb-1">Prep Notes:</span>
                  <p className="text-[11px] leading-relaxed italic">{selectedEvent.raw.preparation_notes}</p>
                </div>
              )}

              {selectedEvent.type === 'reminder' && selectedEvent.raw?.description && (
                <div className="pt-1 border-t border-navy-700 text-slate-400">
                  <span className="text-slate-300 font-medium block mb-1">Details:</span>
                  <p className="text-[11px] leading-relaxed">{selectedEvent.raw.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-navy-800">
              <button
                onClick={() => {
                  setIsEventModalOpen(false);
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-navy-800 hover:bg-navy-700 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
