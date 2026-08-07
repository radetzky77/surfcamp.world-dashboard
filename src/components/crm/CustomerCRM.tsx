import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  ShieldAlert,
  Award,
  Globe,
  MessageSquare,
  Send,
  X,
  Heart,
  FileText,
} from 'lucide-react';
import { Customer } from '../../types';

interface CustomerCRMProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export const CustomerCRM: React.FC<CustomerCRMProps> = ({ customers, setCustomers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeMessageChannel, setActiveMessageChannel] = useState<'whatsapp' | 'email' | null>(null);
  const [messageText, setMessageText] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || c.surfLevel === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleSendMessage = () => {
    if (!messageText || !selectedCustomer) return;
    alert(`[${activeMessageChannel?.toUpperCase()}] Message sent to ${selectedCustomer.name}: "${messageText}"`);
    setMessageText('');
    setActiveMessageChannel(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#5B8CFF]" /> Customer CRM & Guest Directory
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Track guest surf levels, medical requirements, passport verification, and lifetime value (LTV).
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guest name, country, email..."
            className="w-full bg-[#111118] text-xs text-white border border-white/10 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-[#5B8CFF]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-white/50 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Surf Level:
          </span>
          {['all', 'Beginner', 'Intermediate', 'Advanced', 'Pro'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                selectedLevel === lvl
                  ? 'bg-[#5B8CFF] text-white'
                  : 'bg-[#111118] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="bg-[#16161F] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={cust.avatar}
                  alt={cust.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-md"
                />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {cust.name}
                  </h3>
                  <p className="text-[11px] text-white/50 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#5B8CFF]" /> {cust.nationality}
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  cust.loyaltyTier === 'VIP'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : cust.loyaltyTier === 'Gold'
                    ? 'bg-[#5B8CFF]/20 text-[#5B8CFF] border border-[#5B8CFF]/30'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                {cust.loyaltyTier}
              </span>
            </div>

            <div className="space-y-2 text-xs text-white/80 pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-white/50">Surf Level:</span>
                <span className="font-bold text-[#34D399]">{cust.surfLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Lifetime Value (LTV):</span>
                <span className="font-bold text-white">${cust.ltv.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Total Trips Booked:</span>
                <span className="font-semibold text-white">{cust.totalBookings} camps</span>
              </div>
            </div>

            {cust.medicalNotes && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{cust.medicalNotes}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
              <button
                onClick={() => setSelectedCustomer(cust)}
                className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 text-center"
              >
                Full Profile
              </button>
              <button
                onClick={() => {
                  setSelectedCustomer(cust);
                  setActiveMessageChannel('whatsapp');
                }}
                className="p-2 rounded-xl bg-[#34D399]/20 hover:bg-[#34D399]/30 text-[#34D399] border border-[#34D399]/30"
                title="WhatsApp Direct Message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedCustomer(cust);
                  setActiveMessageChannel('email');
                }}
                className="p-2 rounded-xl bg-[#5B8CFF]/20 hover:bg-[#5B8CFF]/30 text-[#5B8CFF] border border-[#5B8CFF]/30"
                title="Email Guest"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guest Profile Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#16161F] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-14 h-14 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h2 className="text-lg font-black text-white">{selectedCustomer.name}</h2>
                  <p className="text-xs text-white/50">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#111118] border border-white/10 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#5B8CFF]" /> Passport & Legal Verification
                </h3>
                <div className="grid grid-cols-2 gap-2 text-white/80 pt-1">
                  <div>
                    <p className="text-[10px] text-white/40">Nationality</p>
                    <p className="font-semibold">{selectedCustomer.nationality}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40">Passport Number</p>
                    <p className="font-mono font-bold text-[#34D399]">{selectedCustomer.passportNumber}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#111118] border border-white/10 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400" /> Emergency Contact
                </h3>
                <p className="text-white font-semibold">{selectedCustomer.emergencyContact.name} ({selectedCustomer.emergencyContact.relation})</p>
                <p className="text-white/60">{selectedCustomer.emergencyContact.phone}</p>
              </div>

              {/* Instant WhatsApp / Email Message Form inside Modal */}
              {activeMessageChannel && (
                <div className="bg-[#111118] border border-[#5B8CFF]/30 rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-white flex items-center gap-1.5 capitalize">
                    <Send className="w-4 h-4 text-[#5B8CFF]" /> Send {activeMessageChannel} Message
                  </h3>
                  <textarea
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Type your ${activeMessageChannel} message to ${selectedCustomer.name}...`}
                    className="w-full bg-[#16161F] text-white border border-white/10 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#5B8CFF]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveMessageChannel(null)}
                      className="px-3 py-1.5 rounded-lg text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-1.5 rounded-lg bg-[#5B8CFF] text-white font-semibold"
                    >
                      Dispatch Now
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-[#5B8CFF] text-white font-semibold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
