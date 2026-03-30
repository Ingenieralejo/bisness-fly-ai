"use client";

import { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useWealthStore } from "@/lib/store/wealth-store";
import { TerminalChat } from "@/components/TerminalChat";

// UI Components
function StatCard({ label, value, sub, color = "indigo" }: any) {
  return (
    <div className={`bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform`} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
      <p className="text-[10px] font-bold text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function BizTile({ biz, active, onClick }: { biz: any, active: boolean, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`p-5 rounded-[28px] border-2 transition-all text-left relative overflow-hidden h-full ${active ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-100' : 'bg-white border-slate-50 hover:border-slate-200 shadow-sm'}`}
    >
      <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-lg ${active ? 'bg-white/20' : 'bg-slate-100'}`}>{biz.icon}</div>
      <p className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-indigo-200' : 'text-slate-400'}`}>{biz.category} • {biz.status}</p>
      <p className={`text-xs font-black uppercase mt-1 ${active ? 'text-white' : 'text-slate-900'}`}>{biz.name}</p>
      <div className="flex justify-between items-end mt-4">
         <p className={`text-lg font-black ${active ? 'text-white' : 'text-indigo-600'}`}>${biz.revenue.toLocaleString()}</p>
         <p className={`text-[8px] font-bold uppercase ${active ? 'text-indigo-200' : 'text-slate-400'}`}>Pot: ${biz.potential.toLocaleString()}</p>
      </div>
    </motion.button>
  );
}

const API_BASE = "http://localhost:3003/api/v1";

export default function FlyOSFleetOverview() {
  const { portfolio, globalRevenue, setSyncing, setGlobalRevenue, isSyncing } = useWealthStore();

  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [aiCopies, setAiCopies] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [showCopies, setShowCopies] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/wealth-matrix/dashboard`);
      const json = await res.json();
      if (json.crypto) {
        setCryptoData(json.crypto);
        const btc = json.crypto.find((c: any) => c.symbol === 'BTCUSDT');
        if (btc) setGlobalRevenue(btc.price);
      }
      
      const pipeRes = await fetch(`${API_BASE}/wealth-matrix/pipeline?channel=DROPSHIP`);
      const pipeJson = await pipeRes.json();
      if (Array.isArray(pipeJson)) {
         setAiCopies(pipeJson.filter((p: any) => p.metadata?.includes('adCopy')));
      }

      const signalRes = await fetch(`${API_BASE}/wealth-matrix/signals?limit=5`);
      const signalJson = await signalRes.json();
      if (Array.isArray(signalJson)) {
        setSignals(signalJson);
      }
    } catch (e) {}
  }, [setGlobalRevenue]);

  useEffect(() => {
    loadData();
    const inv = setInterval(loadData, 15000);
    return () => clearInterval(inv);
  }, [loadData]);

  const handleGlobalLogic = async () => {
    setSyncing(true);
    try {
      const tokenRes = await fetch("http://localhost:4000/auth/uplink", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: process.env.NEXT_PUBLIC_ARCHITECT_KEY }),
      });
      const tData = await tokenRes.json();
      const token = tData.accessToken;

      await fetch(`${API_BASE}/wealth-matrix/sync-binance`, { 
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      await loadData();
    } catch (e) {}
    setSyncing(false);
  };

  const executeDropshipScan = async () => {
    try {
      const tokenRes = await fetch("http://localhost:4000/auth/uplink", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: process.env.NEXT_PUBLIC_ARCHITECT_KEY }),
      });
      const tData = await tokenRes.json();
      
      await fetch(`${API_BASE}/wealth-matrix/scan`, { 
        method: "POST", 
        headers: { "Authorization": `Bearer ${tData.accessToken}` } 
      });
      await loadData();
      setShowCopies(true);
    } catch (e) {}
  };

  const handleFireOutreach = async () => {
    try {
      const tokenRes = await fetch("http://localhost:4000/auth/uplink", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: process.env.NEXT_PUBLIC_ARCHITECT_KEY }),
      });
      const tData = await tokenRes.json();
      
      const res = await fetch(`${API_BASE}/wealth-matrix/outreach/fire`, { 
        method: "POST", 
        headers: { "Authorization": `Bearer ${tData.accessToken}` } 
      });
      const data = await res.json();
      alert(data.message || "Neural Outreach Triggered!");
      await loadData();
    } catch (e) {}
  };

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto">
      
      {/* GLOBAL METRICS */}
      <header className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard label="Global Daily Revenue" value={`$${globalRevenue.toLocaleString()}`} sub="Consolidated Profit (Live)" />
         <StatCard label="Business Portfolio" value={portfolio.length.toString()} sub="Active Intl Models" color="emerald" />
         <StatCard label="Wealth Velocity" value="Elite" sub="Optimization Level Max" color="blue" />
         <StatCard label="Active Fleet Health" value={`${portfolio.filter(b => b.status === "ACTIVE").length / portfolio.length * 100}%`} sub="Operational Efficiency" color="purple" />
      </header>

      {/* LIVE BINANCE MATRIX */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <h2 className="text-2xl font-black uppercase text-slate-900 italic mb-6">Binance <span className="text-emerald-500 underline decoration-emerald-200 underline-offset-8">Live Matrix</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {cryptoData.slice(0, 4).map((c: any) => (
                  <div key={c.symbol} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${c.change24h > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
                    </div>
                    <p className="text-emerald-400 text-xs font-black tracking-widest uppercase">{c.symbol}</p>
                    <p className="text-white text-3xl font-black mt-2">${c.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className={`text-xs font-bold mt-1 ${c.change24h > 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {c.change24h > 0 ? "+" : ""}{c.change24h}% (24H)
                    </p>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-[#0a0f1e] p-8 rounded-[40px] border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl font-black text-emerald-500 rotate-12">KELLY</div>
            <h3 className="text-lg font-black uppercase italic mb-6 text-emerald-400">Neural <span className="text-white">Kelly Intel</span></h3>
            <div className="space-y-4">
               {signals.length === 0 ? (
                  <p className="text-slate-500 text-xs italic">Awaiting neural signals...</p>
               ) : (
                  signals.map((s, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-3 last:border-0">
                       <div className="flex justify-between items-start mb-1">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${s.type.includes('BULL') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                             {s.type}
                          </span>
                          <span className="text-slate-500 text-[8px]">{new Date(s.createdAt).toLocaleTimeString()}</span>
                       </div>
                       <p className="text-xs font-bold text-white mb-1">{s.interpretation}</p>
                       <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full progress-bar-fill" style={{ '--progress': `${s.signalStrength * 100}%` } as React.CSSProperties} />
                       </div>
                    </div>
                  ))
               )}
            </div>
         </div>
      </section>

      {/* THE 10 MODELS GRID */}
      <section>
         <div className="flex justify-between items-center mb-10">
            <div>
               <h2 className="text-2xl font-black uppercase text-slate-900 italic">Portfolio <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Fleet</span></h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Distributed Autonomous Nodes across Global Markets</p>
            </div>
            
            <button 
              onClick={handleGlobalLogic}
              disabled={isSyncing}
              className="bg-slate-900 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
            >
               {isSyncing ? 'RE-OPTIMIZING UNIVERSE...' : 'TRIGGER GLOBAL LOGIC'}
            </button>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {portfolio.map(biz => (
               <BizTile key={biz.id} biz={biz} active={false} onClick={() => window.location.href = `/wealth-matrix/${biz.slug || biz.id}`} />
            ))}
         </div>
      </section>

      {/* STRATEGIC INSIGHTS & COMMS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
         <TerminalChat />
         <div className="space-y-8">
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl relative overflow-hidden flex flex-col justify-center">
                <h3 className="text-xl font-black uppercase italic mb-6">Neural Copywriter <span className="text-indigo-600">Engine</span></h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  Llama3 está integrando la data cruda de MercadoLibre para forjar copys persuasivos en tiempo real que disparan el CTR en Meta Ads y TikTok.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={executeDropshipScan} className="bg-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-white shadow-lg hover:bg-indigo-500 transition-all">
                      Scan Markets & Generate Copys
                  </button>
                  <button onClick={handleFireOutreach} className="bg-emerald-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-white shadow-lg hover:bg-emerald-500 transition-all border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1">
                      Fire Neural Outreach
                  </button>
                  <button onClick={() => setShowCopies(!showCopies)} className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-900 hover:bg-slate-100 transition-all">
                      View Copys ({aiCopies.length})
                  </button>
                </div>
            </div>

            {/* AI COPIES MODAL/LIST */}
            {showCopies && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-[#030712] rounded-3xl p-6 shadow-2xl space-y-4">
                 <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest">Generados Recientemente:</h4>
                 {aiCopies.length === 0 ? (
                    <p className="text-slate-500 text-sm">No hay copys persuasivos generados aun. Lanza el escaneo.</p>
                 ) : (
                    aiCopies.map((copy: any, idx: number) => {
                       const meta = JSON.parse(copy.metadata);
                       return (
                         <div key={idx} className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                           <p className="text-indigo-400 text-[10px] font-black uppercase mb-2">{meta.product || 'Unknown Product'}</p>
                           <p className="text-slate-300 text-xs italic">"{meta.adCopy}"</p>
                         </div>
                       );
                    })
                 )}
              </motion.div>
            )}
         </div>
      </section>
    </div>
  );
}
