import React, { useState } from 'react';
import {
  Search,
  Bell,
  Waves,
  Plus,
  Globe,
  Sun,
  Moon,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NavbarProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onQuickCreateBooking: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  liveSurfInfo: { spot: string; waveHeightM: number; condition: string };
}

export const Navbar: React.FC<NavbarProps> = ({
  notifications,
  setNotifications,
  darkMode,
  setDarkMode,
  onQuickCreateBooking,
  searchTerm,
  setSearchTerm,
  liveSurfInfo,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#09090B]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bookings, customers, surf camps..."
            className="w-full bg-[#16161F] text-xs text-white placeholder-white/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-[#5B8CFF] transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Center Live Surf Pill */}
      <div className="hidden lg:flex items-center gap-2 bg-[#16161F] border border-white/10 px-3.5 py-1.5 rounded-full text-xs">
        <Waves className="w-3.5 h-3.5 text-[#5B8CFF] animate-pulse" />
        <span className="text-white/80 font-medium">{liveSurfInfo.spot}:</span>
        <span className="text-[#34D399] font-bold">{liveSurfInfo.waveHeightM}m</span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-[#34D399]/20 text-[#34D399] font-semibold uppercase text-[9px]">
          {liveSurfInfo.condition}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Sync Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30 text-[11px] font-medium text-[#34D399]">
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
          <span>Surfcamp.world Sync</span>
        </div>

        {/* Quick Create Button */}
        <button
          onClick={onQuickCreateBooking}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white text-xs font-semibold shadow-md shadow-[#5B8CFF]/20 hover:opacity-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Booking</span>
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-[#16161F] border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-[#16161F] border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-[9px] font-bold text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#16161F] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-[#111118]">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#5B8CFF]" /> Live Notifications ({notifications.length})
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-[#5B8CFF] hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 transition hover:bg-white/5 ${
                      !notif.read ? 'bg-[#5B8CFF]/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-white">{notif.title}</p>
                      <span className="text-[9px] text-white/40 shrink-0">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
