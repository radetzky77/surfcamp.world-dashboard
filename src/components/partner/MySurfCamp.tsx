import React, { useState } from 'react';
import { Building2, MapPin, Globe, Phone, Mail, Image as ImageIcon, Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { Partner } from '../../types';

interface MySurfCampProps {
  partner?: Partner;
  onUpdatePartner?: (updated: Partner) => void;
}

export const MySurfCamp: React.FC<MySurfCampProps> = ({ partner, onUpdatePartner }) => {
  const [companyName, setCompanyName] = useState(partner?.companyName || 'My Surf Camp');
  const [ownerName, setOwnerName] = useState(partner?.ownerName || 'Camp Owner');
  const [country, setCountry] = useState(partner?.country || 'Portugal');
  const [location, setLocation] = useState(partner?.location || 'Ericeira');
  const [phone, setPhone] = useState(partner?.phone || '+351 910 000 111');
  const [email, setEmail] = useState(partner?.email || 'camp@surfcamp.world');
  const [website, setWebsite] = useState(partner?.website || 'https://surfcamp.world');
  const [businessAddress, setBusinessAddress] = useState(partner?.businessAddress || '');
  const [description, setDescription] = useState(partner?.description || '');
  const [photos, setPhotos] = useState<string[]>(
    partner?.photos || [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    ]
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddPhoto = () => {
    if (!newPhotoUrl) return;
    if (photos.length >= 8) {
      alert('Maximum 8 photos allowed per camp listing.');
      return;
    }
    setPhotos([...photos, newPhotoUrl]);
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Partner = {
      id: partner?.id || `prt_${Date.now()}`,
      companyName,
      ownerName,
      country,
      location,
      phone,
      email,
      website,
      businessAddress,
      description,
      photos,
      lat: partner?.lat || 38.9,
      lng: partner?.lng || -9.4,
      bankDetails: partner?.bankDetails || {
        bankName: 'Euro Global Partner Bank',
        iban: 'PT50 0000 0000 0000 0000 0000 0',
        swift: 'EURGEUPT',
        accountHolder: companyName,
      },
      commissionRate: partner?.commissionRate || 0.20,
      contractStatus: partner?.contractStatus || 'active',
      approvalStatus: partner?.approvalStatus || 'approved',
      rating: partner?.rating || 4.9,
      totalBookings: partner?.totalBookings || 0,
      totalRevenue: partner?.totalRevenue || 0,
      totalPayout: partner?.totalPayout || 0,
    };

    if (onUpdatePartner) onUpdatePartner(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#5B8CFF]" /> My Surf Camp Profile
          </h1>
          <p className="text-xs text-white/50">
            Manage your surf camp listing information, contact details, description, and photos.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#34D399]/20 text-[#34D399] text-xs font-semibold border border-[#34D399]/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Basic Info */}
        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white">General Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 font-semibold mb-1">Surf Camp Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>

            <div>
              <label className="block text-white/70 font-semibold mb-1">Contact Person / Owner</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 font-semibold mb-1">Country</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>

            <div>
              <label className="block text-white/70 font-semibold mb-1">Location / Surf Region</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
              placeholder="e.g. Rua das Ondas 42, Ericeira"
              className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
            />
          </div>

          <div>
            <label className="block text-white/70 font-semibold mb-1">Camp Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your surf camp, waves, vibe, and amenities..."
              className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#5B8CFF]"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white">Contact & Web</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/70 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>

            <div>
              <label className="block text-white/70 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>

            <div>
              <label className="block text-white/70 font-semibold mb-1">Website URL</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>
          </div>
        </div>

        {/* Photo Gallery (Max 8 Photos) */}
        <div className="p-5 rounded-2xl bg-[#16161F] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#5B8CFF]" /> Camp Photos ({photos.length}/8 max)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((url, idx) => (
              <div key={idx} className="relative group h-28 rounded-xl overflow-hidden border border-white/10">
                <img src={url} alt={`Camp Photo ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {photos.length < 8 && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Paste photo image URL (e.g. Unsplash URL)"
                className="flex-1 bg-[#111118] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#5B8CFF]"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Photo
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white font-bold shadow-lg shadow-[#5B8CFF]/20 hover:opacity-95 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Camp Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
