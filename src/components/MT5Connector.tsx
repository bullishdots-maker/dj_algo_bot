import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Link2, Link2Off, ShieldCheck, Server } from 'lucide-react';
import { toast } from 'sonner';

const MT5Connector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate MT5 Bridge Connection
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast.success("Successfully bridged to MetaTrader 5 Terminal");
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast.info("MT5 Bridge Disconnected");
  };

  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Server className="text-blue-400" size={20} />
          <h3 className="text-slate-200 font-semibold">MT5 Live Bridge</h3>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
          isConnected ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-500"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
          {isConnected ? "Connected" : "Offline"}
        </div>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] text-slate-500 uppercase font-bold">MT5 Account ID</Label>
            <Input placeholder="e.g. 50129384" className="bg-slate-900 border-slate-800 text-white h-9" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] text-slate-500 uppercase font-bold">Broker Server</Label>
            <Input placeholder="e.g. IC-Markets-Live01" className="bg-slate-900 border-slate-800 text-white h-9" />
          </div>
          <Button 
            onClick={handleConnect} 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            {isLoading ? "Establishing Bridge..." : "Connect MT5 Terminal"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={24} />
            <div>
              <div className="text-xs font-bold text-white">Secure Bridge Active</div>
              <div className="text-[10px] text-slate-500">Orders will be mirrored to MT5</div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleDisconnect}
            className="w-full border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            <Link2Off className="mr-2 h-4 w-4" /> Terminate Bridge
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MT5Connector;