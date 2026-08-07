import React from 'react';
import { MessageSquare, Send, Mail, Phone } from 'lucide-react';
import { Message } from '../../types';

interface MessagesViewProps {
  messages: Message[];
}

export const MessagesView: React.FC<MessagesViewProps> = ({ messages }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-[#5B8CFF]" /> Guest & Partner Communication Center
        </h1>
        <p className="text-xs text-white/50 mt-1">
          WhatsApp API & Email dispatch logs, automated booking confirmations, and concierge threads.
        </p>
      </div>

      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-6 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="p-4 rounded-xl bg-[#111118] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">{m.sender}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#5B8CFF]/20 text-[#5B8CFF] font-semibold uppercase">
                  {m.channel}
                </span>
                {m.bookingNumber && (
                  <span className="text-[10px] text-white/40 font-mono">Ref: {m.bookingNumber}</span>
                )}
              </div>
              <span className="text-[10px] text-white/40">{new Date(m.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">{m.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
