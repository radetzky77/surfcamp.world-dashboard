import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, ShieldCheck, X, CheckCircle2, Lock, FileText, ArrowRight } from 'lucide-react';
import { Partner } from '../../types';

interface PartnerRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newPartner: Partner, notificationMsg: string) => void;
}

export const PartnerRegisterModal: React.FC<PartnerRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [country, setCountry] = useState('Portugal');
  const [taxVatId, setTaxVatId] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('You must agree to the Surfcamp.world Partner Terms & Conditions.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        companyName,
        ownerName,
        email,
        phone,
        businessAddress,
        country,
        taxVatId,
        website,
        description,
        password,
        agreedToTerms,
      };

      const res = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const newPartner: Partner = data.partner || {
        id: `prt_${Date.now()}`,
        companyName,
        ownerName,
        email,
        phone: phone || '+351 900 000 000',
        businessAddress: businessAddress || 'Main Ocean Road 1',
        country: country || 'Portugal',
        location: `${country} Coast`,
        taxVatId: taxVatId || 'PT000000000',
        website: website || 'https://surfcamp.world',
        description: description || 'Luxury oceanfront surf partner camp.',
        commissionRate: 0.20,
        contractStatus: 'pending',
        approvalStatus: 'pending_approval',
        rating: 5.0,
        totalBookings: 0,
        totalRevenue: 0,
        totalPayout: 0,
        photos: ['https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80'],
        bankDetails: {
          bankName: 'Euro Global Partner Bank',
          iban: 'PT50 0000 0000 0000 0000 0000 0',
          swift: 'EURGEUPT',
          accountHolder: companyName,
        },
      };

      const notifMessage = `New Surf Camp Application: ${companyName} has registered and is waiting for your review.`;

      onRegisterSuccess(newPartner, notifMessage);
      setSubmittedSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#16161F] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#111118] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B8CFF] bg-[#5B8CFF]/10 px-2.5 py-0.5 rounded-full border border-[#5B8CFF]/20">
              Become a Partner
            </span>
            <h2 className="text-lg font-bold text-white mt-1">Register Your Surf Camp</h2>
            <p className="text-xs text-white/50">Join the Surfcamp.world 80/20 verified partner network</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {submittedSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#34D399]/20 text-[#34D399] flex items-center justify-center mx-auto border border-[#34D399]/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Registration Application Submitted!</h3>
              <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                Thank you for registering <strong className="text-white">{companyName}</strong>. Your account application has been submitted and sent to our team for review. You will receive a confirmation email with your login instructions shortly.
              </p>
              <div className="p-4 rounded-xl bg-[#111118] border border-white/10 text-xs text-[#5B8CFF] font-semibold">
                Status: Pending Administrator Approval
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#5B8CFF] text-white font-bold text-xs shadow"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Company / Surf Camp Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Peniche Ocean Lodge"
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Alexandre Silva"
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="camp@surfcamp.world"
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+351 910 000 111"
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Portugal"
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Tax / VAT ID (Optional)</label>
                  <input
                    type="text"
                    value={taxVatId}
                    onChange={(e) => setTaxVatId(e.target.value)}
                    placeholder="PT509123456"
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Website URL (Optional)</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://mycamp.com"
                    className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Business Address</label>
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="Rua das Ondas 42, Ericeira, Portugal"
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Camp Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your surf camp, waves, packages, and amenities..."
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#5B8CFF]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Create Password for Partner Portal *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5B8CFF] focus:ring-0 bg-[#111118] border-white/20 mt-0.5"
                  />
                  <span className="text-white/70 leading-normal">
                    I agree to the <a href="https://surfcamp.world/terms" target="_blank" rel="noreferrer" className="text-[#5B8CFF] underline">Surfcamp.world Partner Terms & Conditions</a> (80% Partner / 20% Platform revenue share agreement).
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white font-bold shadow hover:opacity-95 flex items-center gap-2"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Partner Registration'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
