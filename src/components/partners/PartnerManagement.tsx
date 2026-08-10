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
  Check,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Partner } from '../../types';

interface PartnerManagementProps {
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
}

export const PartnerManagement: React.FC<PartnerManagementProps> = ({ partners, setPartners }) => {
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);

  // New partner state
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [country, setCountry] = useState('Portugal');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');

  const approvedPartners = partners.filter((p) => p.approvalStatus !== 'pending_approval' && p.contractStatus !== 'pending');
  const pendingPartners = partners.filter((p) => p.approvalStatus === 'pending_approval' || p.contractStatus === 'pending');

  const handleApprovePartner = (id: string) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, approvalStatus: 'approved', contractStatus: 'active' } : p
      )
    );
    fetch('/api/admin/approve-partner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId: id, action: 'approve' }),
    }).catch(() => null);
  };

  const handleRejectPartner = (id: string) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, approvalStatus: 'rejected', contractStatus: 'terminated' } : p
      )
    );
    fetch('/api/admin/approve-partner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId: id, action: 'reject' }),
    }).catch(() => null);
  };

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
      approvalStatus: 'approved',
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

      {/* Filter Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'approved'
              ? 'bg-[#5B8CFF] text-white shadow'
              : 'bg-[#111118] text-white/60 hover:text-white border border-white/5'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Active Approved Camps ({approvedPartners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition relative ${
            activeTab === 'pending'
              ? 'bg-[#6D5EF5] text-white shadow'
              : 'bg-[#111118] text-white/60 hover:text-white border border-white/5'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>Admin Approval Queue ({pendingPartners.length})</span>
          {pendingPartners.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>
      </div>

      {/* TAB 1: APPROVED PARTNERS */}
      {activeTab === 'approved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approvedPartners.length === 0 && (
            <div className="md:col-span-2 p-12 text-center rounded-2xl bg-[#16161F] border border-white/10 space-y-4">
              <Building2 className="w-12 h-12 text-white/20 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Surfcamp Partners Registered Yet</h3>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                Your platform is set up for automatic 80/20 revenue sharing. As soon as surfcamp operators register on your website, they will appear here automatically.
              </p>
              <button
                onClick={() => setShowAddPartner(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white rounded-xl text-xs font-semibold shadow-lg"
              >
                Onboard First Camp Partner
              </button>
            </div>
          )}

          {approvedPartners.map((partner) => (
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
                    className="flex items-center gap-1 text-[#5B8CFF] font-semibold hover:underline"
                  >
                    <span>View Contract & Bank</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PENDING APPROVAL QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingPartners.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#16161F] border border-white/10 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#34D399] mx-auto" />
              <h3 className="text-base font-bold text-white">No Pending Partner Applications</h3>
              <p className="text-xs text-white/50">All registered surf camp applications have been reviewed.</p>
            </div>
          ) : (
            pendingPartners.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Pending Administrator Review
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{p.companyName}</h3>
                    <p className="text-xs text-white/60">Contact Person: {p.ownerName} • {p.email} • {p.phone}</p>
                    <p className="text-xs text-white/50 mt-1">Location: {p.location}, {p.country} | Address: {p.businessAddress || 'N/A'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRejectPartner(p.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold"
                    >
                      <XCircle className="w-4 h-4" /> Decline Partner
                    </button>
                    <button
                      onClick={() => handleApprovePartner(p.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white text-xs font-semibold shadow"
                    >
                      <Check className="w-4 h-4" /> Accept & Publish Partner
                    </button>
                  </div>
                </div>
                <p className="text-xs text-white/70 bg-[#111118] p-3 rounded-xl border border-white/5">
                  {p.description}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Manual Onboarding Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#16161F] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Manual Partner Onboarding</h3>
              <button onClick={() => setShowAddPartner(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePartner} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 font-semibold mb-1">Company / Camp Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Peniche Ocean Lodge"
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPartner(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5B8CFF] text-white font-semibold"
                >
                  Save & Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
