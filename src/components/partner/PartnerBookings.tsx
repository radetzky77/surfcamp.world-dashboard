import React, { useState } from 'react';
import { CalendarDays, CheckCircle2, XCircle, Clock, Search, Filter, ShieldCheck } from 'lucide-react';
import { Booking, Partner } from '../../types';

interface PartnerBookingsProps {
  partner?: Partner;
  bookings: Booking[];
  onUpdateBookingStatus?: (bookingId: string, status: 'confirmed' | 'cancelled') => void;
}

export const PartnerBookings: React.FC<PartnerBookingsProps> = ({
  partner,
  bookings,
  onUpdateBookingStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  const partnerBookings = bookings.filter((b) => !partner?.id || b.partnerId === partner.id);

  const filteredBookings = partnerBookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#5B8CFF]" /> Camp Guest Reservations
          </h1>
          <p className="text-xs text-white/50">
            Guest bookings reserved for {partner?.companyName || 'your surf camp'}.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/70">
          <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          <span>{partnerBookings.length} Total Reservations</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter guest name, booking ref, or room..."
            className="w-full bg-[#16161F] text-xs text-white placeholder-white/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#5B8CFF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#5B8CFF] text-white shadow'
                  : 'bg-[#16161F] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table / Mobile Cards */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase text-[10px] font-bold bg-[#111118]">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest Customer</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Room / Package</th>
                <th className="py-3 px-4">Partner Payout (80%)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-white/40">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const partnerEarnings = b.partnerPayout || b.netTotal * 0.8;
                  return (
                    <tr key={b.id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-mono text-[#5B8CFF] font-bold">{b.bookingNumber}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-white">{b.customerName}</p>
                        <p className="text-[10px] text-white/40">{b.customerEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 text-white/80">{b.checkIn} $\rightarrow$ {b.checkOut}</td>
                      <td className="py-3.5 px-4 text-white/80">{b.guests} guest(s)</td>
                      <td className="py-3.5 px-4 text-white/80">{b.roomType}</td>
                      <td className="py-3.5 px-4 font-bold text-[#34D399]">${partnerEarnings.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            b.status === 'confirmed'
                              ? 'bg-[#34D399]/20 text-[#34D399]'
                              : b.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-400/20 text-amber-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {onUpdateBookingStatus && b.status !== 'confirmed' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-[#34D399]/10 hover:bg-[#34D399]/20 text-[#34D399] font-semibold text-[11px] mr-2"
                          >
                            Confirm
                          </button>
                        )}
                        {onUpdateBookingStatus && b.status !== 'cancelled' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-[11px]"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
