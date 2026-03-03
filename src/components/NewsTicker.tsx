import React from 'react';
import { Newspaper } from 'lucide-react';

interface NewsTickerProps {
  news: string[];
}

const NewsTicker = ({ news }: NewsTickerProps) => {
  return (
    <div className="bg-slate-900 border-y border-slate-800 py-2 overflow-hidden whitespace-nowrap relative">
      <div className="flex items-center gap-4 animate-marquee">
        {[...news, ...news].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-4">
            <Newspaper size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{item}</span>
            <span className="text-slate-700 mx-4">|</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;