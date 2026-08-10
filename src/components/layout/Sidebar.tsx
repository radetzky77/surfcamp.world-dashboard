import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  BedDouble,
  DollarSign,
  FileText,
  Tag,
  MessageSquare,
  Waves,
  Sparkles,
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ClipboardList,
  Compass,
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  currentUser: UserProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  currentUser,
  currentRole,
  setCurrentRole,
}) => {
  const menuSections: MenuSection[] = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: CalendarDays },
        { id: 'calendar', label: 'Calendar', icon: Compass },
        { id: 'crm', label: 'Customers CRM', icon: Users },
        { id: 'partners', label: 'Surf Camp Partners', icon: Building2 },
        { id: 'accommodations', label: 'Accommodations', icon: BedDouble },
        { id: 'surf-forecast', label: 'Surf & Weather API', icon: Waves },
      ],
    },
    {
      title: 'FINANCE & REVENUE',
      items: [
        { id: 'finance', label: 'Finance & P&L', icon: DollarSign },
        { id: 'invoices', label: 'Invoices & Tax', icon: FileText },
        { id: 'discounts', label: 'Discount Codes', icon: Tag },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'messages', label: 'Messages & Alerts', icon: MessageSquare },
        { id: 'tasks', label: 'Tasks & Staff', icon: ClipboardList },
      ],
    },
    {
      title: 'INTELLIGENCE & SYNC',
      items: [
        { id: 'ai-assistant', label: 'AI Booking Analyst', icon: Sparkles, badge: 'Gemini' },
        { id: 'website-sync', label: 'Website Sync Engine', icon: RefreshCw, badge: 'Live' },
        { id: 'settings', label: 'Platform Settings', icon: Settings },
      ],
    },
  ];

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    super_admin: 'Super Admin',
    owner: 'Owner / Executive',
    staff: 'Operations Staff',
    partner: 'Camp Partner',
    instructor: 'Surf Instructor',
    accountant: 'Accountant',
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#111118]/90 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B8CFF] to-[#6D5EF5] flex items-center justify-center shrink-0 shadow-lg shadow-[#5B8CFF]/20">
            <Waves className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                Surfcamp<span className="text-[#5B8CFF]">.world</span>
              </h1>
              <span className="text-[10px] text-white/40 block -mt-0.5">Enterprise Dashboard</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {menuSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">
                {sec.title}
              </p>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white shadow-lg shadow-[#5B8CFF]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded bg-white/20 text-white uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile */}
      <div className="p-3 border-t border-white/10 bg-[#16161F]/80">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-white/40 capitalize truncate">{roleLabels[currentRole]}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
