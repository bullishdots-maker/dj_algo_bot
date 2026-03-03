import React from 'react';
import { Card } from './ui/card';
import { Newspaper } from 'lucide-react';

const NewsTicker = () => {
  const news = [
    "FED CHAIR POWELL HINTS AT POTENTIAL RATE CUTS IN Q3",
    "BITCOIN WHALE MOVES $500M TO COLD STORAGE",
    "ECB MAINTAINS INTEREST RATES AMID INFLATION CONCERNS",
    "GOLD PRICES HIT ALL-TIME HIGH AS GEOPOLITICAL TENSIONS RISE",
    "US RETAIL SALES EXCEED EXPECTATIONS, DOLLAR STRENGTHENS",
    "TECH STOCKS RALLY AS AI DEMAND CONTINUES TO SURGE"
  ];

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
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;