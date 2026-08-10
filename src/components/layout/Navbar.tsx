import React, { useState } from 'react';
import {
  Search,
  Bell,
  Waves,
  Plus,
  Sun,
  Moon,
  X,
  LogIn,
  LogOut,
  Building2,
  Shield,
  UserPlus,
} from 'lucide-react';
import { NotificationItem, UserRole } from '../../types';

interface NavbarProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onQuickCreateBooking: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  liveSurfInfo: { spot: string; waveHeightM: number; condition: string };
  currentRole?: UserRole;
  isAuthenticated?: boolean;
  onOpenLoginChooser?: () => void;
  onOpenPartnerRegisterModal?: () => void;
  onLogout?: () => void;
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
  currentRole,
  isAuthenticated,
  onOpenLoginChooser,
  onOpenPartnerRegisterModal,
  onLogout,
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
        {/* Become a Partner Link */}
        {onOpenPartnerRegisterModal && currentRole !== 'partner' && (
          <button
            onClick={onOpenPartnerRegisterModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#5B8CFF]" />
            <span>Become a Partner</span>
          </button>
        )}

        {/* Intelligent Login / Dashboard Button */}
        {onOpenLoginChooser && (
          <button
            onClick={onOpenLoginChooser}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white text-xs font-bold shadow-md shadow-[#5B8CFF]/20 hover:opacity-95 transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
        )}

        {/* Quick Create Button */}
        {currentRole !== 'partner' && (
          <button
            onClick={onQuickCreateBooking}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-semibold border border-white/20 hover:bg-white/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        )}

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-[#16161F] border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-[#16161F] border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#5B8CFF] text-black text-[9px] font-black flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#16161F] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="text-xs font-bold text-white">Notifications ({unreadCount})</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-[#5B8CFF] hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs space-y-0.5 ${
                      n.read ? 'bg-[#111118] border-white/5 text-white/60' : 'bg-[#5B8CFF]/10 border-[#5B8CFF]/30 text-white'
                    }`}
                  >
                    <p className="font-bold text-[11px]">{n.title}</p>
                    <p className="text-[10px] leading-tight text-white/70">{n.message}</p>
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
