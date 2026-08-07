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

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  currentUser,
  currentRole,
  setCurrentRole,
}) => {
  const menuSections = [
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
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Surfcamp<span className="text-[#5B8CFF]">.world</span>
              </h1>
              <p className="text-[10px] text-white/50 tracking-wider uppercase font-medium">Enterprise Engine</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Menu Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-white/40 tracking-wider uppercase px-3 mb-2">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#5B8CFF]/20 to-[#6D5EF5]/10 text-white border border-[#5B8CFF]/30 shadow-md shadow-[#5B8CFF]/10'
                        : 'text-white/65 hover:text-white hover:bg-white/5'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5B8CFF]' : 'text-white/60'}`} />
                    {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-[#5B8CFF]/20 text-[#5B8CFF] border border-[#5B8CFF]/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Role Switcher & User Profile */}
      <div className="p-3 border-t border-white/10 bg-[#09090B]/60 space-y-2">
        {!collapsed && (
          <div className="space-y-1">
            <label className="text-[10px] text-white/40 uppercase font-medium flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-[#F59E0B]" /> Role Preview
            </label>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="w-full text-xs bg-[#16161F] text-white/90 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#5B8CFF]"
            >
              {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                <option key={r} value={r} className="bg-[#16161F] text-white">
                  {roleLabels[r]}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-1 py-1'}`}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full border border-white/20 object-cover shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-white/50 truncate">{roleLabels[currentRole]}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
