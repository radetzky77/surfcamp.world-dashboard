import React, { useState } from 'react';
import { Waves, Wind, Compass, Thermometer, RefreshCw, MapPin, Sparkles } from 'lucide-react';
import { SurfForecastSpot } from '../../types';

interface SurfForecastModuleProps {
  surfSpots: SurfForecastSpot[];
}

export const SurfForecastModule: React.FC<SurfForecastModuleProps> = ({ surfSpots }) => {
  const [loading, setLoading] = useState(false);
  const [liveLog, setLiveLog] = useState<string | null>(null);

  const handleRefreshAPI = async () => {
    setLoading(true);
    setLiveLog('Querying Open-Meteo Marine API live forecast...');
    try {
      const res = await fetch('/api/surf-forecast');
      const data = await res.json();
      setLiveLog(`Fetched Live Swell for ${data.spot}: Wave ${data.waveHeightM}m @ ${data.wavePeriodSec}s (${data.condition})`);
    } catch (err) {
      setLiveLog('Marine API fallback loaded.');
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
            <Waves className="w-6 h-6 text-[#5B8CFF]" /> Live Ocean & Swell Telemetry
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Real-time wave heights, swell periods, wind offshore vectors, and water temperatures across partner spots.
          </p>
        </div>
        <button
          onClick={handleRefreshAPI}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-xs font-semibold text-white shadow-lg shadow-[#5B8CFF]/20 hover:opacity-95 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live NOAA / Open-Meteo API</span>
        </button>
      </div>

      {liveLog && (
        <div className="p-3 rounded-xl bg-[#5B8CFF]/10 border border-[#5B8CFF]/30 text-xs text-[#5B8CFF] font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{liveLog}</span>
        </div>
      )}

      {/* Spot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {surfSpots.map((spot) => (
          <div
            key={spot.id}
            className="bg-[#16161F] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition space-y-5"
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">{spot.name}</h3>
                <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#5B8CFF]" /> {spot.location}, {spot.country}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  spot.condition === 'Epic'
                    ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                }`}
              >
                {spot.condition}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#111118] border border-white/5">
                <p className="text-[10px] text-white/40 flex items-center justify-center gap-1">
                  <Waves className="w-3 h-3 text-[#5B8CFF]" /> Swell Height
                </p>
                <p className="text-lg font-black text-white mt-1">{spot.waveHeightM}m</p>
              </div>

              <div className="p-3 rounded-xl bg-[#111118] border border-white/5">
                <p className="text-[10px] text-white/40 flex items-center justify-center gap-1">
                  <Compass className="w-3 h-3 text-[#6D5EF5]" /> Period
                </p>
                <p className="text-lg font-black text-white mt-1">{spot.wavePeriodSec}s</p>
              </div>

              <div className="p-3 rounded-xl bg-[#111118] border border-white/5">
                <p className="text-[10px] text-white/40 flex items-center justify-center gap-1">
                  <Wind className="w-3 h-3 text-[#34D399]" /> Wind
                </p>
                <p className="text-sm font-bold text-white mt-1">{spot.windSpeedKts} kts</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#111118] border border-white/5 text-xs text-white/70 space-y-1.5">
              <div className="flex justify-between">
                <span>Swell Angle:</span>
                <span className="font-semibold text-white">{spot.swellDirection}</span>
              </div>
              <div className="flex justify-between">
                <span>Wind Vector:</span>
                <span className="font-semibold text-white">{spot.windDirection}</span>
              </div>
              <div className="flex justify-between">
                <span>Water Temp:</span>
                <span className="font-semibold text-white">{spot.waterTempC}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Tide State:</span>
                <span className="font-semibold text-[#34D399]">{spot.tide}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
