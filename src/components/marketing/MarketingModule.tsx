import React, { useState } from 'react';
import { Tag, Plus, TrendingUp, CheckCircle2, X } from 'lucide-react';
import { DiscountCode } from '../../types';

interface MarketingModuleProps {
  discounts: DiscountCode[];
  setDiscounts: React.Dispatch<React.SetStateAction<DiscountCode[]>>;
}

export const MarketingModule: React.FC<MarketingModuleProps> = ({ discounts, setDiscounts }) => {
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [percent, setPercent] = useState(5);
  const [campaign, setCampaign] = useState('');

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DiscountCode = {
      id: `dsc_${Date.now()}`,
      code: code.toUpperCase(),
      discountPercent: percent,
      active: true,
      usageCount: 0,
      maxUses: 100,
      campaign,
      validUntil: '2026-12-31',
    };
    setDiscounts([...discounts, created]);
    setShowModal(false);
    setCode('');
    setCampaign('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#5B8CFF]" /> Marketing & Discount Campaigns
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Manage promo codes, affiliate codes, and track discount commission impacts on the 80/20 split.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-xs font-semibold text-white shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      <div className="bg-[#16161F] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#111118] text-white/50 border-b border-white/10 font-semibold uppercase text-[10px]">
              <th className="p-4">Code</th>
              <th className="p-4">Discount %</th>
              <th className="p-4">Campaign</th>
              <th className="p-4">Redemptions</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-white/5 transition">
                <td className="p-4 font-mono font-bold text-[#5B8CFF]">{d.code}</td>
                <td className="p-4 font-bold text-emerald-400">{d.discountPercent}% OFF</td>
                <td className="p-4 text-white font-medium">{d.campaign}</td>
                <td className="p-4 text-white/80">{d.usageCount} / {d.maxUses}</td>
                <td className="p-4 text-white/60">{d.validUntil}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34D399]/20 text-[#34D399]">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDiscount}
            className="bg-[#16161F] border border-white/15 rounded-2xl w-full max-w-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white">Create Promo Code</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Code Name</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. SURFBALI10"
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={25}
                  value={percent}
                  onChange={(e) => setPercent(Number(e.target.value))}
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Campaign Description</label>
                <input
                  type="text"
                  required
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="e.g. Bali Summer Affiliate Code"
                  className="w-full bg-[#111118] text-white border border-white/10 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-white/5 text-white/70">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#5B8CFF] text-white font-semibold">
                Save & Activate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
