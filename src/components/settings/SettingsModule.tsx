import React from 'react';
import { Settings, ShieldCheck, Key, Globe, DollarSign, Lock } from 'lucide-react';
import { UserRole } from '../../types';

interface SettingsModuleProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ currentRole, setCurrentRole }) => {
  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'super_admin', label: 'Super Admin', desc: 'Full access to all platform parameters, RLS policies, and SQL exports.' },
    { role: 'owner', label: 'Executive Owner', desc: 'Access to financial P&L, revenue forecasts, and partner contracts.' },
    { role: 'staff', label: 'Operations Staff', desc: 'Can manage daily check-ins, guest CRM, and calendar reservations.' },
    { role: 'partner', label: 'Camp Partner', desc: 'Restricted view: sees only their camp bookings & 80% payout statements.' },
    { role: 'instructor', label: 'Surf Instructor', desc: 'View guest surf levels, surfboard sizing, and daily class schedules.' },
    { role: 'accountant', label: 'Accountant', desc: 'Manage wire transfers, VAT invoices, and expense records.' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#5B8CFF]" /> Platform Settings & Governance
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Role-Based Access Control (RBAC), Supabase security rules, and global financial configurations.
          </p>
        </div>
      </div>

      {/* Role-Based Access Matrix */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#34D399]" /> Role-Based Access Control (RBAC) Matrix
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesList.map((r) => (
            <div
              key={r.role}
              onClick={() => setCurrentRole(r.role)}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                currentRole === r.role
                  ? 'bg-[#5B8CFF]/20 border-[#5B8CFF] text-white shadow-lg shadow-[#5B8CFF]/10'
                  : 'bg-[#111118] border-white/5 text-white/70 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{r.label}</span>
                {currentRole === r.role && (
                  <span className="text-[9px] px-2 py-0.5 rounded bg-[#5B8CFF] text-white font-bold">Active</span>
                )}
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Rule Settings */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#34D399]" /> Core Revenue Formula Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#111118] border border-white/5">
            <p className="text-white/40 mb-1">Partner Commission Split</p>
            <p className="text-base font-bold text-[#6D5EF5]">80.0% to Camp Operator</p>
            <p className="text-[10px] text-white/40 mt-1">Automatic SWIFT wire target</p>
          </div>
          <div className="p-4 rounded-xl bg-[#111118] border border-white/5">
            <p className="text-white/40 mb-1">Platform Revenue Cut</p>
            <p className="text-base font-bold text-[#34D399]">20.0% Surfcamp.world</p>
            <p className="text-[10px] text-white/40 mt-1">SaaS operational margin</p>
          </div>
          <div className="p-4 rounded-xl bg-[#111118] border border-white/5">
            <p className="text-white/40 mb-1">Default European VAT Rate</p>
            <p className="text-base font-bold text-white">13.0% Standard VAT</p>
            <p className="text-[10px] text-white/40 mt-1">Invoiced automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
};
