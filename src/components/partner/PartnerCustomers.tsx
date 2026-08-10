import React, { useState } from 'react';
import { Users, Mail, Phone, Globe, Award, Search, ShieldCheck } from 'lucide-react';
import { Booking, Partner } from '../../types';

interface PartnerCustomersProps {
  partner?: Partner;
  bookings: Booking[];
}

export const PartnerCustomers: React.FC<PartnerCustomersProps> = ({ partner, bookings }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const partnerBookings = bookings.filter((b) => !partner?.id || b.partnerId === partner.id);

  // Extract unique customers from partner's bookings only
  const guestMap = new Map();
  partnerBookings.forEach((b) => {
    if (!guestMap.has(b.customerEmail)) {
      guestMap.set(b.customerEmail, {
        name: b.customerName,
        email: b.customerEmail,
        phone: b.customerPhone,
        totalBookings: 1,
        lastCheckIn: b.checkIn,
        roomType: b.roomType,
      });
    } else {
      const existing = guestMap.get(b.customerEmail);
      existing.totalBookings += 1;
    }
  });

  const guests = Array.from(guestMap.values()).filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#5B8CFF]" /> Camp Guest Directory
          </h1>
          <p className="text-xs text-white/50">
            Guest contacts associated with bookings at {partner?.companyName || 'your surf camp'}.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/70">
          <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          <span>{guests.length} Registered Guests</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search guest name or email address..."
          className="w-full bg-[#16161F] text-xs text-white placeholder-white/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#5B8CFF]"
        />
      </div>

      {/* Guests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guests.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-[#16161F] border border-white/10 rounded-2xl text-white/40 text-xs">
            No guests found for your camp reservations.
          </div>
        ) : (
          guests.map((g, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#16161F] border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5B8CFF] to-[#6D5EF5] flex items-center justify-center font-bold text-white text-sm">
                  {g.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{g.name}</h3>
                  <p className="text-[11px] text-[#5B8CFF] font-semibold">{g.totalBookings} reservation(s)</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-white/70">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-white/40" />
                  <span>{g.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-white/40" />
                  <span>{g.phone || 'Phone on file'}</span>
                </p>
                <p className="text-[11px] text-white/50 pt-1">
                  Last Stay: <span className="text-white font-medium">{g.lastCheckIn}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
