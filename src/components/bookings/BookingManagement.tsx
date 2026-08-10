import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  DollarSign,
  User,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Calculator,
  Download,
  Send,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Booking, Partner, Customer, Accommodation, DiscountCode } from '../../types';

interface BookingManagementProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  partners: Partner[];
  customers: Customer[];
  accommodations: Accommodation[];
  discounts: DiscountCode[];
  initialSearch: string;
}

export const BookingManagement: React.FC<BookingManagementProps> = ({
  bookings,
  setBookings,
  partners,
  customers,
  accommodations,
  discounts,
  initialSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Booking State
  const [newCustomerId, setNewCustomerId] = useState<string>(customers[0]?.id || '');
  const [newPartnerId, setNewPartnerId] = useState<string>(partners[0]?.id || '');
  const [newRoomType, setNewRoomType] = useState<string>('Deluxe Ocean View Suite');
  const [newCheckIn, setNewCheckIn] = useState<string>('2026-09-01');
  const [newCheckOut, setNewCheckOut] = useState<string>('2026-09-08');
  const [newGuests, setNewGuests] = useState<number>(2);
  const [newGrossTotal, setNewGrossTotal] = useState<number>(1400);
  const [newDiscountCode, setNewDiscountCode] = useState<string>('SURFSUMMER26');

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.campName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate live commission formula for new booking modal
  const selectedDiscount = discounts.find((d) => d.code === newDiscountCode);
  const discountPercent = selectedDiscount ? selectedDiscount.discountPercent : 0;
  const calculatedDiscountAmount = (newGrossTotal * discountPercent) / 100;
  const calculatedNetTotal = newGrossTotal - calculatedDiscountAmount;
  const calculatedPartnerPayout = Number((calculatedNetTotal * 0.80).toFixed(2));
  const calculatedPlatformRevenue = Number((calculatedNetTotal * 0.20).toFixed(2));

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newCustomerId) || customers[0];
    const part = partners.find((p) => p.id === newPartnerId) || partners[0];

    const newBookingNumber = `SW-${Math.floor(90000 + Math.random() * 9999)}`;

    const created: Booking = {
      id: `bkg_${Date.now()}`,
      bookingNumber: newBookingNumber,
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      customerPhone: cust.phone,
      partnerId: part.id,
      partnerName: part.companyName,
      campName: part.companyName,
      accommodationId: accommodations[0]?.id || 'acc_01',
      roomType: newRoomType,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      guests: newGuests,
      extras: [{ id: 'ext_new', name: 'Standard Board & Wetsuit Package', price: 100 }],
      grossTotal: newGrossTotal,
      discountCode: newDiscountCode || undefined,
      discountAmount: calculatedDiscountAmount,
      netTotal: calculatedNetTotal,
      partnerPayout: calculatedPartnerPayout,
      platformRevenue: calculatedPlatformRevenue,
      discountCost: calculatedDiscountAmount,
      taxAmount: Number((calculatedNetTotal * 0.13).toFixed(2)),
      netProfit: Number((calculatedPlatformRevenue * 0.85).toFixed(2)),
      profitMargin: 16.0,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      googleCalendarSynced: true,
      createdAt: new Date().toISOString(),
      timeline: [
        { time: new Date().toLocaleTimeString(), event: 'Booking manually issued in dashboard', user: 'Alex Rivera' },
        { time: new Date().toLocaleTimeString(), event: `Auto Commission calculated: 80% ($${calculatedPartnerPayout}) / 20% ($${calculatedPlatformRevenue})`, user: 'Engine' },
      ],
      notes: 'Issued directly from Surfcamp.world admin console.',
    };

    setBookings([created, ...bookings]);
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Booking Management Engine</h1>
          <p className="text-xs text-white/50 mt-1">
            Real-time reservation table with automatic 80% partner payout and 20% platform revenue split.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-xs font-semibold text-white shadow-lg shadow-[#5B8CFF]/20 hover:opacity-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Reservation</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SW-code, customer, camp..."
            className="w-full bg-[#111118] text-xs text-white border border-white/10 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-[#5B8CFF]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <span className="text-xs text-white/50 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Status Filter:
          </span>
          {['all', 'confirmed', 'pending', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-[#5B8CFF] text-white'
                  : 'bg-[#111118] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#111118] text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                <th className="p-4">Booking #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Surf Camp & Room</th>
                <th className="p-4">Dates</th>
                <th className="p-4 text-right">Gross</th>
                <th className="p-4 text-right">Partner 80%</th>
                <th className="p-4 text-right">Platform 20%</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-white/50">
                    <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="font-bold text-white text-sm">No Bookings Recorded Yet</p>
                    <p className="text-xs text-white/40 max-w-sm mx-auto mt-1">
                      New reservations submitted on your website or received via API webhooks will appear here instantly.
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white rounded-xl text-xs font-semibold shadow-lg"
                    >
                      Manual Booking Entry
                    </button>
                  </td>
                </tr>
              )}
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition">
                  <td className="p-4 font-mono font-bold text-[#5B8CFF]">{b.bookingNumber}</td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{b.customerName}</p>
                    <p className="text-[10px] text-white/40">{b.customerEmail}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{b.campName}</p>
                    <p className="text-[10px] text-white/50">{b.roomType}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white/80">{b.checkIn} → {b.checkOut}</p>
                    <p className="text-[10px] text-white/40">{b.guests} guest(s)</p>
                  </td>
                  <td className="p-4 text-right font-bold text-white">${b.netTotal}</td>
                  <td className="p-4 text-right font-bold text-[#6D5EF5]">${b.partnerPayout}</td>
                  <td className="p-4 text-right font-bold text-[#34D399]">${b.platformRevenue}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'confirmed'
                          ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30'
                          : b.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {b.status === 'confirmed' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Booking Detail Drawer Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#16161F] border border-white/15 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-white/10 bg-[#111118] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">{selectedBooking.bookingNumber}</h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#5B8CFF]/20 text-[#5B8CFF] font-semibold">
                    Google Calendar Synced
                  </span>
                </div>
                <p className="text-xs text-white/50">{selectedBooking.campName} • {selectedBooking.roomType}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-white/80">
              {/* Financial Split Box */}
              <div className="bg-[#111118] border border-[#5B8CFF]/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-[#5B8CFF]" /> Automatic Revenue Breakdown
                  </span>
                  <span className="text-[10px] text-[#34D399] font-bold">80/20 Formula Verified</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
                  <div className="p-2 rounded-lg bg-white/5">
                    <p className="text-[10px] text-white/50">Gross Total</p>
                    <p className="text-sm font-black text-white">${selectedBooking.netTotal}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#6D5EF5]/20 border border-[#6D5EF5]/30">
                    <p className="text-[10px] text-[#6D5EF5]">Partner Payout (80%)</p>
                    <p className="text-sm font-black text-white">${selectedBooking.partnerPayout}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#34D399]/20 border border-[#34D399]/30">
                    <p className="text-[10px] text-[#34D399]">Platform Revenue (20%)</p>
                    <p className="text-sm font-black text-white">${selectedBooking.platformRevenue}</p>
                  </div>
                </div>
              </div>

              {/* Guest & Extras */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-white mb-2">Guest Contact</h3>
                  <p className="text-white font-medium">{selectedBooking.customerName}</p>
                  <p className="text-white/60">{selectedBooking.customerEmail}</p>
                  <p className="text-white/60">{selectedBooking.customerPhone}</p>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Dates & Guests</h3>
                  <p className="text-white">{selectedBooking.checkIn} to {selectedBooking.checkOut}</p>
                  <p className="text-white/60">{selectedBooking.guests} guest(s)</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-bold text-white mb-3">Event Timeline</h3>
                <div className="space-y-2 border-l border-white/10 pl-3">
                  {selectedBooking.timeline.map((item, idx) => (
                    <div key={idx} className="relative text-[11px]">
                      <span className="text-white/40 font-mono">{item.time}</span>
                      <p className="text-white font-medium">{item.event}</p>
                      <p className="text-[10px] text-white/50">Triggered by: {item.user}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#111118] flex items-center justify-between">
              <button
                onClick={() => alert(`Generating PDF Invoice for ${selectedBooking.bookingNumber}...`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF Invoice
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-[#5B8CFF] text-white font-semibold text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Booking Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateBooking}
            className="bg-[#16161F] border border-white/15 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#5B8CFF]" /> New Surfcamp Booking
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Select Customer</label>
                <select
                  value={newCustomerId}
                  onChange={(e) => setNewCustomerId(e.target.value)}
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Select Surf Camp Partner</label>
                <select
                  value={newPartnerId}
                  onChange={(e) => setNewPartnerId(e.target.value)}
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.companyName} ({p.country})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={newCheckIn}
                    onChange={(e) => setNewCheckIn(e.target.value)}
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={newCheckOut}
                    onChange={(e) => setNewCheckOut(e.target.value)}
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Gross Price ($)</label>
                  <input
                    type="number"
                    value={newGrossTotal}
                    onChange={(e) => setNewGrossTotal(Number(e.target.value))}
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Apply Discount Code</label>
                  <select
                    value={newDiscountCode}
                    onChange={(e) => setNewDiscountCode(e.target.value)}
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                  >
                    <option value="">No Discount</option>
                    {discounts.map((d) => (
                      <option key={d.id} value={d.code}>
                        {d.code} ({d.discountPercent}% OFF)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Automatic Commission Preview Box */}
              <div className="bg-[#111118] border border-[#34D399]/30 rounded-xl p-3.5 space-y-2">
                <p className="text-[11px] font-bold text-[#34D399] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Instant Live Calculation:
                </p>
                <div className="flex justify-between text-white/80 text-[11px]">
                  <span>Net Price after discount:</span>
                  <span className="font-bold">${calculatedNetTotal}</span>
                </div>
                <div className="flex justify-between text-[#6D5EF5] text-[11px]">
                  <span>Partner 80% Payout:</span>
                  <span className="font-bold">${calculatedPartnerPayout}</span>
                </div>
                <div className="flex justify-between text-[#5B8CFF] text-[11px]">
                  <span>Surfcamp.world 20% Revenue:</span>
                  <span className="font-bold">${calculatedPlatformRevenue}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white font-semibold shadow-lg shadow-[#5B8CFF]/20"
              >
                Confirm & Issue Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
