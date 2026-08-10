import React from 'react';
import { X, Building2, Shield, ArrowRight, Waves } from 'lucide-react';

interface LoginChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPartner: () => void;
  onSelectAdmin: () => void;
}

export const LoginChooserModal: React.FC<LoginChooserModalProps> = ({
  isOpen,
  onClose,
  onSelectPartner,
  onSelectAdmin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#16161F] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111118]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B8CFF] to-[#6D5EF5] flex items-center justify-center shrink-0 shadow-lg shadow-[#5B8CFF]/20">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">surfcamp.world Login</h2>
              <p className="text-xs text-white/50">Select your account portal to sign in</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-semibold text-white/70 text-center uppercase tracking-wider mb-2">
            Who are you?
          </p>

          {/* Partner Option */}
          <button
            onClick={() => {
              onClose();
              onSelectPartner();
            }}
            className="w-full p-4 rounded-xl bg-[#111118] hover:bg-white/5 border border-white/10 hover:border-[#5B8CFF]/50 transition group text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#5B8CFF]/10 text-[#5B8CFF] group-hover:bg-[#5B8CFF] group-hover:text-black transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#5B8CFF] transition">
                  Surf Camp Partner
                </h3>
                <p className="text-xs text-white/50">Manage your camp, packages, bookings & 80% earnings</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#5B8CFF] group-hover:translate-x-1 transition" />
          </button>

          {/* Admin Option */}
          <button
            onClick={() => {
              onClose();
              onSelectAdmin();
            }}
            className="w-full p-4 rounded-xl bg-[#111118] hover:bg-white/5 border border-white/10 hover:border-[#6D5EF5]/50 transition group text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#6D5EF5]/10 text-[#6D5EF5] group-hover:bg-[#6D5EF5] group-hover:text-white transition">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#6D5EF5] transition">
                  Admin / Staff
                </h3>
                <p className="text-xs text-white/50">Full business operations, P&L, and global platform controls</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#6D5EF5] group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
