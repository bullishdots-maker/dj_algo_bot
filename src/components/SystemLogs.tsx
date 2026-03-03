import React, { useEffect, useState, useRef } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Terminal, Cpu, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR';
}

const SystemLogs = ({ isActive }: { isActive: boolean }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'INFO') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      time: format(new Date(), 'HH:mm:ss.SSS'),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  useEffect(() => {
    if (isActive) {
      addLog("Alpha-Pro Engine initialized", "SUCCESS");
      addLog("WebSocket handshake successful", "INFO");
      addLog("Scanning for high-probability setups...", "INFO");
    } else {
      addLog("Alpha-Pro Engine suspended", "WARN");
    }
  }, [isActive]);

  // Simulate periodic system checks
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const events = [
        { msg: "RSI calculation updated: Neutral", type: "INFO" },
        { msg: "Volatility index within optimal range", type: "SUCCESS" },
        { msg: "Order flow imbalance detected", type: "INFO" },
        { msg: "Latency check: 42ms", type: "INFO" },
        { msg: "Liquidity pool depth verified", type: "SUCCESS" }
      ];
      const event = events[Math.floor(Math.random() * events.length)];
      if (Math.random() > 0.7) addLog(event.msg, event.type as any);
    }, 5000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <Card className="bg-slate-950 border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-blue-400" />
          <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">System Logs</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu size={12} className={isActive ? "text-emerald-500 animate-pulse" : "text-slate-600"} />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Core v4.2</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1 font-mono text-[10px]">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 py-0.5 group">
              <span className="text-slate-600 shrink-0">[{log.time}]</span>
              <span className={
                log.type === 'SUCCESS' ? "text-emerald-400" :
                log.type === 'WARN' ? "text-amber-400" :
                log.type === 'ERROR' ? "text-rose-400" :
                "text-blue-400"
              }>
                {log.type}:
              </span>
              <span className="text-slate-300 group-hover:text-white transition-colors">{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default SystemLogs;