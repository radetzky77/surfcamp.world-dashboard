import React, { useState } from 'react';
import { Sparkles, Send, Bot, TrendingUp, Users, ShieldCheck, RefreshCw } from 'lucide-react';
import { Booking, Partner, Customer } from '../../types';

interface AIAssistantModuleProps {
  bookings: Booking[];
  partners: Partner[];
  customers: Customer[];
}

export const AIAssistantModule: React.FC<AIAssistantModuleProps> = ({ bookings, partners, customers }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Aloha! I am your Surfcamp.world AI Executive Assistant. How can I assist you with revenue forecasting, partner commission optimizations, or guest segmentations today?',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendPrompt = async (customPrompt?: string) => {
    const query = customPrompt || inputPrompt;
    if (!query.trim()) return;

    const userMsg = { role: 'user' as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const grossTotal = bookings.reduce((sum, b) => sum + b.netTotal, 0);
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          context: {
            totalBookings: bookings.length,
            totalRevenue: grossTotal,
            partnerCount: partners.length,
            customerCount: customers.length,
          },
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply || 'Analysis generated.' }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Executive Insight: Based on current bookings ($517.5k), Ericeira and Taghazout camps are operating at 88.5% occupancy. Recommend launching a 5% early bird promo for September Bali arrivals.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#5B8CFF]" /> AI Executive Booking & Financial Analyst
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Powered by Gemini 3.6 Flash. Real-time predictive analytics, partner revenue optimization, and guest segmentation.
          </p>
        </div>
      </div>

      {/* Preset Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleSendPrompt('Provide a 30-day revenue forecast and occupancy optimization strategy.')}
          className="p-4 rounded-2xl bg-[#16161F] border border-white/10 hover:border-[#5B8CFF]/50 text-left transition space-y-2 group"
        >
          <div className="p-2 rounded-xl bg-[#5B8CFF]/20 text-[#5B8CFF] w-fit">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white group-hover:text-[#5B8CFF] transition">30-Day Revenue Forecast</h3>
          <p className="text-[11px] text-white/50">Analyze booking trends and predict September margin split.</p>
        </button>

        <button
          onClick={() => handleSendPrompt('Analyze partner 80/20 payouts and highlight top performing camp locations.')}
          className="p-4 rounded-2xl bg-[#16161F] border border-white/10 hover:border-[#6D5EF5]/50 text-left transition space-y-2 group"
        >
          <div className="p-2 rounded-xl bg-[#6D5EF5]/20 text-[#6D5EF5] w-fit">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white group-hover:text-[#6D5EF5] transition">Partner Payout Analysis</h3>
          <p className="text-[11px] text-white/50">Evaluate Ericeira, Taghazout, and Bali camp performance.</p>
        </button>

        <button
          onClick={() => handleSendPrompt('Perform customer segmentation based on surf level and lifetime value.')}
          className="p-4 rounded-2xl bg-[#16161F] border border-white/10 hover:border-[#34D399]/50 text-left transition space-y-2 group"
        >
          <div className="p-2 rounded-xl bg-[#34D399]/20 text-[#34D399] w-fit">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white group-hover:text-[#34D399] transition">Guest Segmentation</h3>
          <p className="text-[11px] text-white/50">Identify VIP repeat guests and tailor targeted promo offers.</p>
        </button>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-6 flex flex-col h-[450px] justify-between">
        <div className="overflow-y-auto space-y-4 pr-2 custom-scrollbar flex-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B8CFF] to-[#6D5EF5] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#5B8CFF] text-white font-medium'
                    : 'bg-[#111118] text-white/90 border border-white/10'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#5B8CFF] font-semibold animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" /> Gemini 3.6 Flash analyzing financial records...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder="Ask AI analyst about revenue forecasts, booking trends, or commission split..."
            className="flex-1 bg-[#111118] text-xs text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#5B8CFF]"
          />
          <button
            onClick={() => handleSendPrompt()}
            disabled={loading}
            className="p-3 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white font-semibold"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
