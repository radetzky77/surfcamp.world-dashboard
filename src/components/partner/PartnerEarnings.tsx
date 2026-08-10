import React from 'react';
import { DollarSign, Building2, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Booking, Partner } from '../../types';

interface PartnerEarningsProps {
  partner?: Partner;
  bookings: Booking[];
}

export const PartnerEarnings: React.FC<PartnerEarningsProps> = ({ partner, bookings }) => {
  const partnerBookings = bookings.filter((b) => !partner?.id || b.partnerId === partner.id);

  const totalGrossRevenue = partnerBookings.reduce((sum, b) => sum + (b.netTotal || b.grossTotal || 0), 0);
  const totalPartnerEarnings = partnerBookings.reduce((sum, b) => sum + (b.partnerPayout || b.netTotal * 0.8), 0);
  const confirmedCount = partnerBookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount = partnerBookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#34D399]" /> Payments & 80% Partner Earnings
          </h1>
          <p className="text-xs text-white/50">
            Earnings overview calculated automatically on the 80% partner revenue share contract.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 text-xs font-bold text-[#34D399]">
          <ShieldCheck className="w-4 h-4" />
          <span>80% Partner Share Verified</span>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-1">
          <p className="text-xs text-white/50 font-semibold">Total Reservations</p>
          <p className="text-2xl font-black text-white">{partnerBookings.length}</p>
          <p className="text-[11px] text-[#34D399] font-medium">{confirmedCount} confirmed</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-1">
          <p className="text-xs text-white/50 font-semibold">Total Guest Bookings Value</p>
          <p className="text-2xl font-black text-white">${totalGrossRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-white/40">Gross booking volume</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-1">
          <p className="text-xs text-[#34D399] font-bold">Your Partner Earnings (80%)</p>
          <p className="text-2xl font-black text-[#34D399]">${totalPartnerEarnings.toLocaleString()}</p>
          <p className="text-[11px] text-[#34D399] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Ready for Payout
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-1">
          <p className="text-xs text-amber-300 font-bold">Pending Reservations</p>
          <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
          <p className="text-[11px] text-white/40">Awaiting confirmation</p>
        </div>
      </div>

      {/* Bank Account Payout Information */}
      <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#5B8CFF]" /> Registered Bank Payout Account
          </h3>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#34D399]/20 text-[#34D399]">
            Active Payout Method
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-white/40">Bank Name</p>
            <p className="font-bold text-white mt-0.5">{partner?.bankDetails?.bankName || 'Banco BPI Portugal'}</p>
          </div>
          <div>
            <p className="text-white/40">IBAN Account Number</p>
            <p className="font-mono font-bold text-white mt-0.5">{partner?.bankDetails?.iban || 'PT50 0010 0000 1234 5678 9012 3'}</p>
          </div>
          <div>
            <p className="text-white/40">SWIFT / BIC Code</p>
            <p className="font-mono font-bold text-white mt-0.5">{partner?.bankDetails?.swift || 'BPIPPTPL'}</p>
          </div>
          <div>
            <p className="text-white/40">Account Holder</p>
            <p className="font-bold text-white mt-0.5">{partner?.bankDetails?.accountHolder || partner?.companyName || 'Surf Camp Lda'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
