import React, { useState } from 'react';
import { Settings, Lock, Mail, Bell, CheckCircle2, Save } from 'lucide-react';
import { UserProfile, Partner } from '../../types';

interface PartnerSettingsProps {
  currentUser: UserProfile;
  partner?: Partner;
}

export const PartnerSettings: React.FC<PartnerSettingsProps> = ({ currentUser, partner }) => {
  const [email, setEmail] = useState(currentUser.email || partner?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotify, setEmailNotify] = useState(true);
  const [whatsappNotify, setWhatsappNotify] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#5B8CFF]" /> Partner Account Settings
          </h1>
          <p className="text-xs text-white/50">
            Manage credentials and notification alerts for {partner?.companyName || 'your surf camp'}.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#34D399]/20 text-[#34D399] text-xs font-semibold border border-[#34D399]/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        {/* Contact Email */}
        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#5B8CFF]" /> Account Email
          </h3>
          <div>
            <label className="block text-white/70 font-semibold mb-1">Notification Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
            />
          </div>
        </div>

        {/* Change Password */}
        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#5B8CFF]" /> Security & Password
          </h3>
          <div>
            <label className="block text-white/70 font-semibold mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 font-semibold mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>
            <div>
              <label className="block text-white/70 font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#5B8CFF]" /> Notification Preferences
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="w-4 h-4 rounded text-[#5B8CFF] focus:ring-0 bg-[#111118] border-white/20"
              />
              <div>
                <p className="font-semibold text-white">Email Notifications for New Bookings</p>
                <p className="text-[11px] text-white/50">Receive instant email when guests reserve your surf camp</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappNotify}
                onChange={(e) => setWhatsappNotify(e.target.checked)}
                className="w-4 h-4 rounded text-[#5B8CFF] focus:ring-0 bg-[#111118] border-white/20"
              />
              <div>
                <p className="font-semibold text-white">WhatsApp Payout Alerts</p>
                <p className="text-[11px] text-white/50">Receive SMS / WhatsApp notification when monthly 80% payout is processed</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white font-bold shadow hover:opacity-95 transition"
          >
            <Save className="w-4 h-4" />
            <span>Update Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
