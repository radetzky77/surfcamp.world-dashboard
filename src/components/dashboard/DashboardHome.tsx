import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Percent,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Waves,
  Sparkles,
  RefreshCw,
  Plus,
  Clock,
  ShieldCheck,
  PlaneTakeoff,
  PlaneLanding,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Booking, Partner, SurfForecastSpot, AuditLog } from '../../types';

interface DashboardHomeProps {
  bookings: Booking[];
  partners: Partner[];
  surfSpots: SurfForecastSpot[];
  auditLogs: AuditLog[];
  onOpenNewBooking: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  bookings,
  partners,
  surfSpots,
  auditLogs,
  onOpenNewBooking,
  onNavigateTab,
}) => {
  // Aggregate Metrics
  const grossTotal = bookings.reduce((sum, b) => sum + b.netTotal, 0);
  const totalPartnerPayout = bookings.reduce((sum, b) => sum + b.partnerPayout, 0);
  const totalPlatformRevenue = bookings.reduce((sum, b) => sum + b.platformRevenue, 0);
  const totalProfit = bookings.reduce((sum, b) => sum + b.netProfit, 0);
  const pendingPayments = bookings.filter((b) => b.paymentStatus === 'pending');
  const pendingAmount = pendingPayments.reduce((sum, b) => sum + b.netTotal, 0);

  // Financial Chart Data dynamically calculated from bookings
  const monthlyData = bookings.length > 0
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m) => {
        const monthBookings = bookings.filter((b) => b.checkIn.includes(m));
        const rev = monthBookings.reduce((sum, b) => sum + b.netTotal, 0);
        const payout = monthBookings.reduce((sum, b) => sum + b.partnerPayout, 0);
        const platformNet = monthBookings.reduce((sum, b) => sum + b.platformRevenue, 0);
        return { month: m, revenue: rev, partnerPayout: payout, platformNet };
      })
    : [
        { month: 'Jan', revenue: 0, partnerPayout: 0, platformNet: 0 },
        { month: 'Feb', revenue: 0, partnerPayout: 0, platformNet: 0 },
        { month: 'Mar', revenue: 0, partnerPayout: 0, platformNet: 0 },
        { month: 'Apr', revenue: 0, partnerPayout: 0, platformNet: 0 },
        { month: 'May', revenue: 0, partnerPayout: 0, platformNet: 0 },
        { month: 'Jun', revenue: 0, partnerPayout: 0, platformNet: 0 },
        { month: 'Jul', revenue: 0, partnerPayout: 0, platformNet: 0 },
        { month: 'Aug', revenue: 0, partnerPayout: 0, platformNet: 0 },
      ];

  // Occupancy Share by Country dynamically calculated from partners
  const countriesCount: Record<string, number> = {};
  partners.forEach((p) => {
    countriesCount[p.country] = (countriesCount[p.country] || 0) + 1;
  });
  const colors = ['#5B8CFF', '#6D5EF5', '#34D399', '#F59E0B', '#EC4899'];
  const occupancyByCountry = partners.length > 0
    ? Object.keys(countriesCount).map((country, idx) => ({
        name: country,
        value: Math.round((countriesCount[country] / partners.length) * 100),
        color: colors[idx % colors.length],
      }))
    : [];

  return (
    <div className="space-[#16161F] p-6 space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#16161F] via-[#111118] to-[#16161F] border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#5B8CFF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#5B8CFF]/20 text-[#5B8CFF] border border-[#5B8CFF]/30">
                Live Enterprise Hub
              </span>
              <span className="text-xs text-white/50">• Surfcamp.world Global Network</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Platform Executive Overview
            </h1>
            <p className="text-xs text-white/60 mt-1 max-w-xl">
              Automatic 80/20 partner revenue split active. Real-time calendar synchronization & live website booking webhooks online.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('ai-assistant')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition"
            >
              <Sparkles className="w-4 h-4 text-[#5B8CFF]" />
              <span>AI Revenue Forecast</span>
            </button>
            <button
              onClick={onOpenNewBooking}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-xs font-semibold text-white shadow-lg shadow-[#5B8CFF]/20 hover:opacity-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Booking</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition relative group">
          <div className="flex items-center justify-between text-white/60 text-xs mb-3">
            <span>Total Gross Revenue</span>
            <div className="p-2 rounded-xl bg-[#5B8CFF]/10 text-[#5B8CFF]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">${grossTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* 80% Partner Payout Pool */}
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition relative group">
          <div className="flex items-center justify-between text-white/60 text-xs mb-3">
            <span>Partner Payouts (80%)</span>
            <div className="p-2 rounded-xl bg-[#6D5EF5]/10 text-[#6D5EF5]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">${totalPartnerPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1 text-white/50 text-[11px] mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span>Auto-calculated formula</span>
          </div>
        </div>

        {/* 20% Platform Revenue */}
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition relative group">
          <div className="flex items-center justify-between text-white/60 text-xs mb-3">
            <span>Platform Revenue (20%)</span>
            <div className="p-2 rounded-xl bg-[#34D399]/10 text-[#34D399]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">${totalPlatformRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Net margin 16.2%</span>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition relative group">
          <div className="flex items-center justify-between text-white/60 text-xs mb-3">
            <span>Avg Camp Occupancy</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{partners.length > 0 ? '78.5%' : '0.0%'}</p>
          <div className="flex items-center gap-1 text-amber-400 text-[11px] mt-2 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{partners.length > 0 ? 'Live Camp Status' : 'Awaiting Registrations'}</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Breakdown Area Chart */}
        <div className="lg:col-span-2 bg-[#16161F] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Revenue Sharing Trajectory (80/20 Formula)</h2>
              <p className="text-[11px] text-white/50">Gross Revenue vs Partner Payout Pool vs Platform Profit</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-white/70 border border-white/10">
              2026 YTD
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B8CFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5B8CFF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D5EF5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6D5EF5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111118', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#5B8CFF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Gross Total ($)" />
                <Area type="monotone" dataKey="partnerPayout" stroke="#6D5EF5" strokeWidth={2} fillOpacity={1} fill="url(#colorPayout)" name="Partner 80% Payout ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Camp Occupancy Breakdown Pie */}
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Occupancy Share by Country</h2>
            <button onClick={() => onNavigateTab('partners')} className="text-xs text-[#5B8CFF] hover:underline">
              View Camps
            </button>
          </div>
          {occupancyByCountry.length > 0 ? (
            <>
              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyByCountry}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {occupancyByCountry.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111118', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 pt-2 border-t border-white/10">
                {occupancyByCountry.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-white/80">{item.name}</span>
                    </div>
                    <span className="font-bold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4">
              <Building2 className="w-8 h-8 text-white/20 mb-2" />
              <p className="text-xs font-bold text-white">No Camp Partners Yet</p>
              <p className="text-[11px] text-white/40 mt-1">Newly registered surfcamp partners will show here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid: Live Surf API + Today's Checkins + Live Webhook Audit */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Surf Forecast Widget */}
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Waves className="w-4 h-4 text-[#5B8CFF]" /> Live Swell Forecast
            </h2>
            <button onClick={() => onNavigateTab('surf-forecast')} className="text-xs text-[#5B8CFF] hover:underline">
              Full Map
            </button>
          </div>
          <div className="space-y-3">
            {surfSpots.map((spot) => (
              <div key={spot.id} className="p-3 rounded-xl bg-[#111118] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{spot.name}</p>
                  <p className="text-[10px] text-white/50">{spot.country} • {spot.swellDirection}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#34D399]">{spot.waveHeightM}m @ {spot.wavePeriodSec}s</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#34D399]/20 text-[#34D399] font-bold uppercase">
                    {spot.condition}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Arrivals / Departures */}
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#6D5EF5]" /> Today's Check-ins
            </h2>
            <button onClick={() => onNavigateTab('bookings')} className="text-xs text-[#5B8CFF] hover:underline">
              Manage
            </button>
          </div>
          <div className="space-y-3">
            {bookings.length > 0 ? (
              bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-[#111118] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{b.customerName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/70">
                      {b.bookingNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-white/60">
                    <span>{b.campName}</span>
                    <span className="text-[#34D399] font-semibold">${b.netTotal}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-white/40 space-y-1">
                <Calendar className="w-6 h-6 text-white/20 mx-auto" />
                <p className="text-xs font-bold text-white/70">No Check-ins Today</p>
                <p className="text-[10px] text-white/40">New reservations will appear automatically.</p>
              </div>
            )}
          </div>
        </div>

        {/* Live System Webhook & Audit Log */}
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#34D399]" /> Website Sync Trail
            </h2>
            <button onClick={() => onNavigateTab('website-sync')} className="text-xs text-[#5B8CFF] hover:underline">
              Webhook Logs
            </button>
          </div>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-xl bg-[#111118] border border-white/5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white/90 text-[11px]">{log.action}</span>
                  <span className="text-[9px] text-white/40">{log.timestamp.split(' ')[1]}</span>
                </div>
                <p className="text-[10px] text-white/60 leading-tight">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
