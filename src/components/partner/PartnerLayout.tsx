import React, { useState } from 'react';
import {
  Building2,
  CalendarDays,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Waves,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Partner, UserProfile } from '../../types';

interface PartnerLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  currentPartner?: Partner;
  onLogout: () => void;
  children: React.ReactNode;
}

export const PartnerLayout: React.FC<PartnerLayoutProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  currentPartner,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'surf-camp', label: 'My Surf Camp', icon: Waves },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'earnings', label: 'Payments & Earnings', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const campName = currentPartner?.companyName || 'My Surf Camp';

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col antialiased">
      {/* Top Header */}
      <header className="h-16 border-b border-white/10 bg-[#111118]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B8CFF] to-[#6D5EF5] flex items-center justify-center shrink-0 shadow">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                {campName}
              </span>
              <span className="text-[10px] text-[#5B8CFF] font-semibold block">
                Surfcamp.world Partner Portal
              </span>
            </div>
          </div>
        </div>

        {/* Right Header User Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#34D399]/10 border border-[#34D399]/30 text-xs font-semibold text-[#34D399]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified 80/20 Partner</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Body Content with Responsive Sidebar */}
      <div className="flex-1 flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r border-white/10 bg-[#111118]/50 p-4 space-y-6 shrink-0">
          <div className="px-3">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">
              Partner Navigation
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white shadow'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Slideout Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex">
            <div className="w-64 bg-[#16161F] h-full p-4 space-y-4 border-r border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-white">Partner Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white/40">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-[#5B8CFF] text-white'
                          : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
