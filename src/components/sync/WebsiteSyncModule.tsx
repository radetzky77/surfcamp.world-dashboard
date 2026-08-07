import React, { useState } from 'react';
import {
  RefreshCw,
  Globe,
  Database,
  Code2,
  Download,
  CheckCircle2,
  Sparkles,
  Zap,
  Server,
  Key,
} from 'lucide-react';
import { Booking } from '../../types';

interface WebsiteSyncModuleProps {
  onAddBooking: (booking: Booking) => void;
}

export const WebsiteSyncModule: React.FC<WebsiteSyncModuleProps> = ({ onAddBooking }) => {
  const [syncing, setSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [dockerConfig, setDockerConfig] = useState<{ dockerfile: string; githubActions: string } | null>(null);

  const handleSimulateWebsiteBooking = async () => {
    setSyncing(true);
    setSyncLog(['Connecting to public Surfcamp.world webhook payload...']);

    try {
      const payload = {
        booking: {
          customerName: 'Elena Rostova',
          customerEmail: 'elena.r@surfworld.com',
          customerPhone: '+34 600 11 22 33',
          partnerName: 'Ericeira Surf House & Resort',
          campName: 'Ericeira Surf House & Resort',
          roomType: 'Deluxe Ocean View Suite',
          checkIn: '2026-09-10',
          checkOut: '2026-09-17',
          guests: 2,
          grossTotal: 1550,
          discountAmount: 0,
        },
        source: 'Surfcamp.world website',
      };

      const res = await fetch('/api/website-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.booking) {
        onAddBooking(data.booking);
        setSyncLog([
          '✅ Webhook received from Surfcamp.world website',
          `✅ Generated Booking ${data.booking.bookingNumber}`,
          `✅ Calculated 80% Partner Payout ($${data.booking.partnerPayout})`,
          `✅ Calculated 20% Platform Revenue ($${data.booking.platformRevenue})`,
          '✅ Google Calendar API synchronized',
          '✅ Confirmation WhatsApp & Email dispatched',
        ]);
      }
    } catch (err) {
      setSyncLog(['Sync error occurred.']);
    } finally {
      setSyncing(false);
    }
  };

  const handleDownloadSQL = () => {
    window.location.href = '/api/export-supabase-sql';
  };

  const handleLoadDocker = async () => {
    try {
      const res = await fetch('/api/export-docker');
      const data = await res.json();
      setDockerConfig(data);
    } catch (err) {
      alert('Error fetching docker files');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-[#34D399]" /> Live Website Sync & Database Engine
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Seamless bidirectional synchronization with Surfcamp.world public booking engine & Supabase PostgreSQL cluster.
          </p>
        </div>
        <button
          onClick={handleDownloadSQL}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-xs font-semibold text-white shadow-lg"
        >
          <Database className="w-4 h-4" />
          <span>Download Supabase SQL Schema</span>
        </button>
      </div>

      {/* Webhook Tester Box */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Surfcamp.world Live Webhook Simulator
            </h2>
            <p className="text-xs text-white/50">Simulate a guest booking on the public website and watch automatic synchronization in real-time.</p>
          </div>
          <button
            onClick={handleSimulateWebsiteBooking}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#34D399] text-black font-bold text-xs shadow hover:opacity-90"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>Simulate Website Booking</span>
          </button>
        </div>

        {syncLog.length > 0 && (
          <div className="p-4 rounded-xl bg-[#111118] border border-white/10 space-y-1.5 font-mono text-xs text-[#34D399]">
            {syncLog.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Integration Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#5B8CFF]" /> Surfcamp.world Web
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#34D399]/20 text-[#34D399] font-bold">Connected</span>
          </div>
          <p className="text-[11px] text-white/50">Public booking engine endpoint active.</p>
        </div>

        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#6D5EF5]" /> Supabase / Postgres
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#34D399]/20 text-[#34D399] font-bold">RLS Active</span>
          </div>
          <p className="text-[11px] text-white/50">Row Level Security & 80/20 Triggers enabled.</p>
        </div>

        <div className="bg-[#16161F] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-[#34D399]" /> Cloud Run Container
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#34D399]/20 text-[#34D399] font-bold">Port 3000</span>
          </div>
          <p className="text-[11px] text-white/50">Production container deployment ready.</p>
        </div>
      </div>

      {/* Docker Exporter View */}
      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#5B8CFF]" /> Production Docker & CI/CD Pipeline Files
          </h2>
          <button
            onClick={handleLoadDocker}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 text-white text-xs font-semibold border border-white/10"
          >
            Inspect Dockerfile & GitHub Actions
          </button>
        </div>

        {dockerConfig && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs font-bold text-white mb-1">Dockerfile (Production Multi-stage)</p>
              <pre className="p-3 bg-[#111118] border border-white/10 rounded-xl text-[10px] text-white/80 overflow-x-auto font-mono">
                {dockerConfig.dockerfile}
              </pre>
            </div>
            <div>
              <p className="text-xs font-bold text-white mb-1">GitHub Actions (.github/workflows/deploy.yml)</p>
              <pre className="p-3 bg-[#111118] border border-white/10 rounded-xl text-[10px] text-white/80 overflow-x-auto font-mono">
                {dockerConfig.githubActions}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
