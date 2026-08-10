import React from 'react';
import { CalendarDays, Users, DollarSign, Building2, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Booking, Partner } from '../../types';

interface PartnerOverviewProps {
  partner?: Partner;
  bookings: Booking[];
  onNavigateTab: (tab: string) => void;
}

export const PartnerOverview: React.FC<PartnerOverviewProps> = ({
  partner,
  bookings,
  onNavigateTab,
}) => {
  const campName = partner?.companyName || 'My Surf Camp';
  const partnerBookings = bookings.filter((b) => !partner?.id || b.partnerId === partner.id);
  const confirmedCount = partnerBookings.filter((b) => b.status === 'confirmed').length;
  const totalPartnerEarnings = partnerBookings.reduce((sum, b) => sum + (b.partnerPayout || b.netTotal * 0.8), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#16161F] via-[#1A1A26] to-[#111118] border border-white/10 relative overflow-hidden space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#5B8CFF]/20 text-[#5B8CFF] border border-[#5B8CFF]/30">
            Camp Partner Overview
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Welcome back, {campName}
        </h1>
        <p className="text-xs text-white/60 max-w-xl">
          Here is what is happening with your surf camp reservations, upcoming guests, and 80% partner payouts.
        </p>
      </div>

      {/* 2 Simple Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 font-semibold">Upcoming Bookings</p>
            <p className="text-2xl font-black text-white mt-1">{partnerBookings.length}</p>
            <p className="text-[11px] text-[#34D399] font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {confirmedCount} Confirmed Guests
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#5B8CFF]/10 text-[#5B8CFF]">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 font-semibold">Partner Earnings (80% Share)</p>
            <p className="text-2xl font-black text-[#34D399] mt-1">${totalPartnerEarnings.toLocaleString()}</p>
            <p className="text-[11px] text-white/40 mt-0.5">Calculated automatically on 80/20 contract</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#34D399]/10 text-[#34D399]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs text-white/50 font-semibold">Camp Location</p>
            <p className="text-sm font-bold text-white mt-1 truncate">{partner?.location || 'Portugal Coast'}</p>
            <p className="text-[11px] text-[#5B8CFF] font-medium mt-0.5">Rating: {partner?.rating || 4.9} ★ Verified</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#6D5EF5]/10 text-[#6D5EF5]">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#5B8CFF]" /> Recent Guest Reservations
          </h3>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs text-[#5B8CFF] font-semibold hover:underline flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase text-[10px] font-bold">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Guests</th>
                <th className="pb-3">Room Type</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {partnerBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-white/40">
                    No reservations for your surf camp yet.
                  </td>
                </tr>
              ) : (
                partnerBookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-white/5">
                    <td className="py-3 font-semibold text-white">{b.customerName}</td>
                    <td className="py-3 text-white/70">{b.checkIn} to {b.checkOut}</td>
                    <td className="py-3 text-white/70">{b.guests} guests</td>
                    <td className="py-3 text-white/70">{b.roomType}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-[#34D399]/20 text-[#34D399]'
                            : 'bg-amber-400/20 text-amber-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onNavigateTab('bookings')}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white text-xs font-semibold shadow hover:opacity-95 text-center"
        >
          Manage All Bookings
        </button>
        <button
          onClick={() => onNavigateTab('surf-camp')}
          className="flex-1 py-3 px-4 rounded-xl bg-[#111118] border border-white/10 hover:bg-white/5 text-white text-xs font-semibold text-center"
        >
          Update Surf Camp Profile
        </button>
      </div>
    </div>
  );
};
