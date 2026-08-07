import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Download,
  FileText,
  PieChart as PieIcon,
  ShieldCheck,
  Building2,
  Tag,
  ArrowUpRight,
  Calculator,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Booking, Expense, Invoice, Partner } from '../../types';

interface FinanceModuleProps {
  bookings: Booking[];
  expenses: Expense[];
  invoices: Invoice[];
  partners: Partner[];
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  bookings,
  expenses,
  invoices,
  partners,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pnl' | 'payouts' | 'invoices' | 'expenses'>('pnl');

  const grossTotal = bookings.reduce((sum, b) => sum + b.netTotal, 0);
  const totalPartnerPayout = bookings.reduce((sum, b) => sum + b.partnerPayout, 0);
  const totalPlatformRevenue = bookings.reduce((sum, b) => sum + b.platformRevenue, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalTax = bookings.reduce((sum, b) => sum + b.taxAmount, 0);
  const netProfit = totalPlatformRevenue - totalExpenses;
  const margin = grossTotal > 0 ? ((netProfit / grossTotal) * 100).toFixed(1) : '0';

  const financialComparisonData = [
    { name: 'Gross Booking Total', amount: grossTotal, fill: '#5B8CFF' },
    { name: 'Partner 80% Payouts', amount: totalPartnerPayout, fill: '#6D5EF5' },
    { name: 'Platform 20% Cut', amount: totalPlatformRevenue, fill: '#34D399' },
    { name: 'Platform Expenses', amount: totalExpenses, fill: '#EF4444' },
    { name: 'Net Platform Profit', amount: netProfit, fill: '#F59E0B' },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Booking Number,Customer,Camp,Net Total,Partner Payout (80%),Platform Revenue (20%),Tax\n' +
      bookings
        .map(
          (b) =>
            `${b.bookingNumber},"${b.customerName}","${b.campName}",${b.netTotal},${b.partnerPayout},${b.platformRevenue},${b.taxAmount}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'surfcamp_financial_report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#34D399]" /> Financial & Commission Ledger
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Real-time P&L Statement, Partner 80/20 Payout Pool, Expense Tracking, and Tax/VAT Audits.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition"
        >
          <Download className="w-4 h-4 text-[#5B8CFF]" />
          <span>Export Financial CSV</span>
        </button>
      </div>

      {/* Subtabs Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'pnl', label: 'P&L Statement' },
          { id: 'payouts', label: 'Partner 80% Payout Pool' },
          { id: 'invoices', label: 'Issued Invoices' },
          { id: 'expenses', label: 'Platform Expenses' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === tab.id
                ? 'bg-[#5B8CFF] text-white shadow-md shadow-[#5B8CFF]/20'
                : 'bg-[#16161F] text-white/60 hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main P&L Content */}
      {activeSubTab === 'pnl' && (
        <div className="space-y-6">
          {/* P&L Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-white/50">Gross Booking Volume</p>
              <p className="text-2xl font-black text-white mt-1">${grossTotal.toLocaleString()}</p>
            </div>
            <div className="bg-[#16161F] border border-[#6D5EF5]/30 rounded-2xl p-5">
              <p className="text-xs text-[#6D5EF5]">Partner Payouts (80%)</p>
              <p className="text-2xl font-black text-white mt-1">${totalPartnerPayout.toLocaleString()}</p>
            </div>
            <div className="bg-[#16161F] border border-[#34D399]/30 rounded-2xl p-5">
              <p className="text-xs text-[#34D399]">Platform Revenue (20%)</p>
              <p className="text-2xl font-black text-white mt-1">${totalPlatformRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-[#16161F] border border-amber-500/30 rounded-2xl p-5">
              <p className="text-xs text-amber-400">Net Platform Profit</p>
              <p className="text-2xl font-black text-white mt-1">${netProfit.toLocaleString()}</p>
              <p className="text-[10px] text-amber-400 font-semibold mt-1">Margin {margin}%</p>
            </div>
          </div>

          {/* Bar Chart Comparison */}
          <div className="bg-[#16161F] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white">Financial Breakdown & Split Analysis</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialComparisonData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111118',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#5B8CFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Partner Payout Pool Subtab */}
      {activeSubTab === 'payouts' && (
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" /> Partner 80% Automated Payout Ledger
          </h2>
          <div className="space-y-3">
            {partners.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-[#111118] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-bold text-white">{p.companyName}</p>
                  <p className="text-[10px] text-white/50">{p.ownerName} • IBAN: {p.bankDetails.iban}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] text-white/40">Gross Campsite Revenue</p>
                    <p className="text-xs font-bold text-white">${p.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#6D5EF5]">80% Wire Transfer Target</p>
                    <p className="text-sm font-black text-[#6D5EF5]">${p.totalPayout.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => alert(`Wire Transfer of $${p.totalPayout.toLocaleString()} initiated to ${p.companyName}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#6D5EF5] text-white font-semibold text-xs"
                  >
                    Execute SWIFT Wire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoices Subtab */}
      {activeSubTab === 'invoices' && (
        <div className="bg-[#16161F] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#111118] text-white/50 border-b border-white/10 font-semibold uppercase text-[10px]">
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">VAT / Tax</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition">
                  <td className="p-4 font-mono font-bold text-[#5B8CFF]">{inv.invoiceNumber}</td>
                  <td className="p-4 text-white font-medium">{inv.customerName}</td>
                  <td className="p-4 text-white font-bold">${inv.amount}</td>
                  <td className="p-4 text-white/60">${inv.tax}</td>
                  <td className="p-4 text-white/60">{inv.dueDate}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inv.status === 'paid' ? 'bg-[#34D399]/20 text-[#34D399]' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expenses Subtab */}
      {activeSubTab === 'expenses' && (
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Platform Operating Expenses</h2>
          <div className="space-y-3">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-3.5 rounded-xl bg-[#111118] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{exp.description}</p>
                  <p className="text-[10px] text-white/40">{exp.category} • {exp.date}</p>
                </div>
                <span className="text-xs font-bold text-rose-400">-${exp.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
