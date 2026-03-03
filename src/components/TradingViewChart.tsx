import React, { useEffect, useRef } from 'react';
import { Asset } from '../types/trading';

interface TradingViewChartProps {
  asset: Asset;
}

const TradingViewChart = ({ asset }: TradingViewChartProps) => {
  const container = useRef<HTMLDivElement>(null);

  const getSymbol = (asset: Asset) => {
    switch (asset) {
      case 'BTC/USD': return 'BINANCE:BTCUSDT';
      case 'ETH/USD': return 'BINANCE:ETHUSDT';
      case 'XAU/USD': return 'OANDA:XAUUSD';
      case 'XAG/USD': return 'OANDA:XAGUSD';
      default: return 'BINANCE:BTCUSDT';
    }
  };

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": getSymbol(asset),
      "interval": "1",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });
    
    container.current.innerHTML = '';
    container.current.appendChild(script);
  }, [asset]);

  return (
    <div className="tradingview-widget-container h-full w-full rounded-xl overflow-hidden border border-slate-800" ref={container}>
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
};

export default TradingViewChart;