import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  User,
} from 'lucide-react';
import { Booking, Partner } from '../../types';

interface CalendarViewProps {
  bookings: Booking[];
  partners: Partner[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ bookings, partners }) => {
  const [currentMonth, setCurrentMonth] = useState('August 2026');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [googleSync, setGoogleSync] = useState(true);

  // August 2026 Grid days (1 to 31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Map bookings to August days for visual grid preview
  const getBookingsForDay = (dayNum: number) => {
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const dateQuery = `2026-08-${dayStr}`;
    return bookings.filter((b) => b.checkIn <= dateQuery && b.checkOut >= dateQuery);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#5B8CFF]" /> Live Interactive Calendar
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Drag & drop reservations, monitor occupancy conflicts, and auto-sync with Google Calendar API.
          </p>
        </div>

        {/* Sync & View Mode Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGoogleSync(!googleSync)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              googleSync
                ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]/40'
                : 'bg-white/5 text-white/60 border-white/10'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${googleSync ? 'animate-spin' : ''}`} />
            <span>Google Cal Sync: {googleSync ? 'Active' : 'Paused'}</span>
          </button>

          <div className="bg-[#16161F] border border-white/10 p-1 rounded-xl flex items-center gap-1">
            {(['month', 'week', 'day'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1 rounded-lg text-xs capitalize font-medium transition ${
                  viewMode === m ? 'bg-[#5B8CFF] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month Navigator Bar */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl bg-[#111118] text-white/70 hover:text-white border border-white/5">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white">{currentMonth}</span>
          <button className="p-2 rounded-xl bg-[#111118] text-white/70 hover:text-white border border-white/5">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5B8CFF]" />
            <span className="text-white/70">Ericeira Portugal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6D5EF5]" />
            <span className="text-white/70">Taghazout Morocco</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
            <span className="text-white/70">Bali Indonesia</span>
          </div>
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-4 space-y-2">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-white/40 pb-2 border-b border-white/10">
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
          <div>SUN</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((dayNum) => {
            const dayBookings = getBookingsForDay(dayNum);
            const isToday = dayNum === 7;

            return (
              <div
                key={dayNum}
                className={`min-h-[90px] p-2 rounded-xl border transition flex flex-col justify-between ${
                  isToday
                    ? 'bg-[#5B8CFF]/10 border-[#5B8CFF]/50 shadow-inner'
                    : 'bg-[#111118] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isToday ? 'w-5 h-5 rounded-full bg-[#5B8CFF] text-white flex items-center justify-center' : 'text-white/80'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-[9px] text-white/40 font-mono">{dayBookings.length} res</span>
                  )}
                </div>

                {/* Booking Pill */}
                <div className="space-y-1 mt-1">
                  {dayBookings.map((b) => (
                    <div
                      key={b.id}
                      className="px-2 py-1 rounded-md text-[10px] font-semibold text-white bg-[#5B8CFF]/30 border border-[#5B8CFF]/50 truncate cursor-pointer hover:opacity-90"
                      title={`${b.customerName} - ${b.campName}`}
                    >
                      {b.customerName.split(' ')[0]} ({b.bookingNumber})
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
