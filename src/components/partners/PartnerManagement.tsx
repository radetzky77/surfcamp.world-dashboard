import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  DollarSign,
  Award,
  CheckCircle2,
  FileText,
  Phone,
  Mail,
  Plus,
  ExternalLink,
  ShieldCheck,
  Download,
  X,
  CreditCard,
} from 'lucide-react';
import { Partner } from '../../types';

interface PartnerManagementProps {
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
}

export const PartnerManagement: React.FC<PartnerManagementProps> = ({ partners, setPartners }) => {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);

  // New partner state
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [country, setCountry] = useState('Portugal');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Partner = {
      id: `prt_${Date.now()}`,
      companyName,
      ownerName,
      country,
      location,
      lat: 38.7,
      lng: -9.1,
      bankDetails: {
        bankName: 'Euro Global Bank',
        iban: 'PT50 9988 7766 5544 3322 1100 9',
        swift: 'EURGEUPT',
        accountHolder: companyName,
      },
      commissionRate: 0.20,
      contractStatus: 'active',
      rating: 5.0,
      totalBookings: 0,
      totalRevenue: 0,
      totalPayout: 0,
      photos: ['https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80'],
      phone: '+351 910 000 111',
      email,
      description: 'Luxury oceanfront partner verified for Surfcamp.world 80/20 revenue sharing.',
    };
    setPartners([...partners, created]);
    setShowAddPartner(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#5B8CFF]" /> Surfcamp Partners Network
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Global verified partner camps running on the 80/20 Surfcamp.world automated commission contract.
          </p>
        </div>
        <button
          onClick={() => setShowAddPartner(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-xs font-semibold text-white shadow-lg shadow-[#5B8CFF]/20 hover:opacity-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Camp Partner</span>
        </button>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-[#16161F] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition flex flex-col justify-between group"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={partner.photos[0]}
                alt={partner.companyName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16161F] via-transparent to-black/30" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#34D399] text-black shadow">
                  Verified 80/20 Partner
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur border border-white/20">
                  {partner.country}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <h3 className="text-base font-black text-white">{partner.companyName}</h3>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#5B8CFF]" /> {partner.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 rounded-lg text-amber-300 font-bold text-xs">
                  <Award className="w-3.5 h-3.5" /> {partner.rating}
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-white/60 line-clamp-2 leading-relaxed">{partner.description}</p>

              {/* Financial Stats Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#111118] border border-white/5 text-center">
                <div>
                  <p className="text-[10px] text-white/40">Total Revenue</p>
                  <p className="text-xs font-black text-white">${partner.totalRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6D5EF5]">Partner Payout (80%)</p>
                  <p className="text-xs font-black text-[#6D5EF5]">${partner.totalPayout.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#34D399]">Platform Fee (20%)</p>
                  <p className="text-xs font-black text-[#34D399]">
                    ${(partner.totalRevenue * partner.commissionRate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-white/70 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-white/40" />
                  <span>{partner.phone}</span>
                </div>
                <button
                  onClick={() => setSelectedPartner(partner)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition"
                >
                  Bank & Contract
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Partner Detail Drawer Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#16161F] border border-white/15 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">{selectedPartner.companyName}</h2>
                <p className="text-xs text-white/50">{selectedPartner.ownerName} • Owner</p>
              </div>
              <button onClick={() => setSelectedPartner(null)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bank Details */}
            <div className="bg-[#111118] border border-white/10 rounded-xl p-4 space-y-2 text-xs">
              <h3 className="font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#5B8CFF]" /> Banking & SWIFT Wire Transfer Target
              </h3>
              <div className="grid grid-cols-2 gap-2 text-white/80 pt-2">
                <div>
                  <p className="text-[10px] text-white/40">Bank Name</p>
                  <p className="font-semibold">{selectedPartner.bankDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40">SWIFT / BIC Code</p>
                  <p className="font-mono font-semibold">{selectedPartner.bankDetails.swift}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-white/40">IBAN Number</p>
                  <p className="font-mono font-bold text-[#5B8CFF]">{selectedPartner.bankDetails.iban}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => alert(`Downloaded 80/20 Payout Statement for ${selectedPartner.companyName}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10"
              >
                <Download className="w-4 h-4" /> Export Payout PDF
              </button>
              <button
                onClick={() => setSelectedPartner(null)}
                className="px-4 py-2 rounded-xl bg-[#5B8CFF] text-white font-semibold text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePartner}
            className="bg-[#16161F] border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white">Onboard Surfcamp Partner</h2>
              <button type="button" onClick={() => setShowAddPartner(false)} className="text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Company / Resort Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Hossegor Dunes Surf Villa"
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Jean Dupont"
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                  >
                    <option value="Portugal">Portugal</option>
                    <option value="France">France</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Spain">Spain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Location / Beach Break</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. La Gravière, Hossegor"
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@campsurf.com"
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddPartner(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-white/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white font-semibold"
              >
                Activate Partner Contract
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
