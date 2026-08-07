import React from 'react';
import { BedDouble, Users, CheckCircle2 } from 'lucide-react';
import { Accommodation } from '../../types';

interface AccommodationViewProps {
  accommodations: Accommodation[];
}

export const AccommodationView: React.FC<AccommodationViewProps> = ({ accommodations }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BedDouble className="w-6 h-6 text-[#5B8CFF]" /> Accommodations & Surf Rooms
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Capacity, availability matrix, and night rates across global partner villas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accommodations.map((acc) => (
          <div key={acc.id} className="bg-[#16161F] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="h-40 rounded-xl overflow-hidden">
              <img src={acc.photos[0]} alt={acc.roomType} className="w-full h-full object-cover" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{acc.roomType}</h3>
              <p className="text-xs text-white/50">{acc.campName}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#111118] border border-white/5">
                <p className="text-[10px] text-white/40">Night Rate</p>
                <p className="font-bold text-[#34D399]">${acc.pricePerNight}/night</p>
              </div>
              <div className="p-2 rounded-xl bg-[#111118] border border-white/5">
                <p className="text-[10px] text-white/40">Capacity</p>
                <p className="font-bold text-white">{acc.capacity} guests</p>
              </div>
              <div className="p-2 rounded-xl bg-[#111118] border border-white/5">
                <p className="text-[10px] text-white/40">Available</p>
                <p className="font-bold text-[#5B8CFF]">{acc.availableRooms} / {acc.totalRooms}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
