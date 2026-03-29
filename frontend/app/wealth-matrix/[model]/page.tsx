"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWealthStore } from "@/lib/store/wealth-store";
import { useMemo } from "react";

// UI Components
function BizHeader({ biz }: { biz: any }) {
  return (
    <header className="relative bg-white p-12 rounded-[60px] border border-slate-100 shadow-2xl overflow-hidden mb-12">
       <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl font-black italic">{biz.category}</div>
       <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-6">
               <span className="w-16 h-16 bg-indigo-600 rounded-[28px] flex items-center justify-center text-3xl shadow-xl shadow-indigo-100">{biz.icon}</span>
               <div>
                  <p className="text-[11px] font-black uppercase text-indigo-500 tracking-widest leading-none mb-1">{biz.category}</p>
                  <p className={`text-[10px] font-bold uppercase ${biz.status === 'ACTIVE' ? 'text-emerald-500' : 'text-amber-500'}`}>{biz.status}</p>
               </div>
            </div>
            <h1 className="text-6xl font-black uppercase italic text-slate-900 tracking-tighter max-w-2xl">{biz.name}</h1>
            <p className="text-lg font-bold text-slate-500 mt-6 leading-relaxed max-w-xl">{biz.description}</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Projected Monthly Revenue</p>
             <p className="text-7xl font-black text-slate-900 italic">${biz.potential.toLocaleString()}</p>
             <p className="text-[11px] font-black uppercase text-indigo-600 mt-4 underline decoration-indigo-200 underline-offset-4">Preferred Payout: {biz.payout}</p>
          </div>
       </div>
    </header>
  );
}

function EngineStatus({ biz, syncing }: { biz: any, syncing: boolean }) {
   return (
      <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" />
         <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${syncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 shadow-[0_0_12px_#10b981]'}`} />
            FLY.AI Neural Engine <span className="text-indigo-400">Live Status</span>
         </h3>
         <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
               <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-tighter">Operation Mode</span>
               <span className="text-xs font-black uppercase">Autonomous_Cluster_v2</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
               <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-tighter">Data Connection</span>
               <span className="text-xs font-black uppercase text-emerald-400">Stable (12ms latency)</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
               <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-tighter">Security Hash</span>
               <span className="text-xs font-black uppercase italic text-slate-400 truncate max-w-[200px]">SHA-256:f7b8c9d0...</span>
            </div>
            <div className="pt-8">
               <button className="w-full bg-white text-slate-900 py-5 rounded-[22px] font-black uppercase text-[10px] shadow-2xl hover:bg-indigo-400 hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50" disabled={syncing}>
                  {syncing ? 'RE-SYNCING MODEL...' : 'REBOOT MODEL AGENTS'}
               </button>
            </div>
         </div>
      </div>
   );
}

function ActionControls({ biz }: { biz: any }) {
   return (
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-xl p-10 flex flex-col justify-between">
         <div>
            <h3 className="text-xl font-black uppercase italic mb-8">Model <span className="text-indigo-600">Controls</span></h3>
            <p className="text-sm font-bold text-slate-500 mb-10 leading-relaxed uppercase tracking-tighter">Control the deployment and configuration of the autonomous agents assigned to this model.</p>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <button className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2 hover:border-indigo-600 transition-all text-left">
               <span className="text-[9px] font-black uppercase text-slate-400">Campaigns</span>
               <span className="text-xs font-black uppercase">Launch New Outreach</span>
            </button>
            <button className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2 hover:border-indigo-600 transition-all text-left">
               <span className="text-[9px] font-black uppercase text-slate-400">Scaling</span>
               <span className="text-xs font-black uppercase">Increase API Quota</span>
            </button>
            <button className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2 hover:border-indigo-600 transition-all text-left">
               <span className="text-[9px] font-black uppercase text-slate-400">Reporting</span>
               <span className="text-xs font-black uppercase">Export Forensic Analysis</span>
            </button>
            <button className="bg-indigo-600 p-6 rounded-3xl text-white flex flex-col gap-2 shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all text-left">
               <span className="text-[9px] font-black uppercase text-indigo-200">Revenue Vault</span>
               <span className="text-xs font-black uppercase italic">Withdraw Balance</span>
            </button>
         </div>
      </div>
   );
}

export default function BusinessModelDetailsPage() {
  const pathname = usePathname();
  const { portfolio, isSyncing } = useWealthStore();

  const modelIdOrSlug = useMemo(() => {
    const parts = pathname.split('/');
    return parts[parts.length - 1];
  }, [pathname]);

  const activeBiz = useMemo(() => {
    return portfolio.find(b => b.slug === modelIdOrSlug || b.id === modelIdOrSlug) || portfolio[0];
  }, [portfolio, modelIdOrSlug]);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 min-h-screen">
      
      <motion.div
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
      >
         <BizHeader biz={activeBiz} />
      </motion.div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <EngineStatus biz={activeBiz} syncing={isSyncing} />
         </motion.div>
         
         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <ActionControls biz={activeBiz} />
         </motion.div>
      </section>

      {/* METRICS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
            { label: 'Current Revenue', value: `$${activeBiz.revenue}`, sub: 'Verified by FLY.AI', color: 'emerald' },
            { label: 'Active Leads', value: '142', sub: 'In pipeline', color: 'blue' },
            { label: 'Agent Health', value: '98%', sub: 'Forensic validation', color: 'indigo' },
            { label: 'Market Volatility', value: 'Low', sub: 'Risk analysis complete', color: 'purple' }
         ].map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.4 + (idx * 0.1) }}
              className={`bg-white p-8 rounded-[40px] border border-slate-100 shadow-md relative overflow-hidden h-48 flex flex-col justify-end`}
            >
               <div className={`absolute top-0 right-0 w-24 h-24 bg-${card.color}-500/5 rounded-full -mr-12 -mt-12`} />
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-2">{card.label}</p>
               <p className="text-3xl font-black text-slate-900 tracking-tighter">{card.value}</p>
               <p className="text-[9px] font-black uppercase text-slate-400 mt-2">{card.sub}</p>
            </motion.div>
         ))}
      </section>
      
      {/* FORENSIC TIMELINE */}
      <section className="bg-white rounded-[60px] p-12 shadow-2xl border border-slate-100">
         <div className="flex justify-between items-center mb-12">
             <h3 className="text-2xl font-black uppercase italic">Forensic <span className="text-indigo-600">Timeline</span></h3>
             <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">Real-Time Event Logging Active</span>
         </div>
         <div className="space-y-8">
            {[
               { time: '14:23:01', event: 'Agent-07 detected new arbitrage opportunity on BINANCE spot.', type: 'SYSTEM' },
               { time: '12:05:45', event: 'Lead validation sequence complete. 12 law firms scored 90+.', type: 'LEADS' },
               { time: '09:00:00', event: 'Global Revenue Sync successfully verified by FLY.AI Engine.', type: 'SYNC' },
               { time: 'Yesterday', event: 'New landing page generated using Creative Agent for high-ticket filter model.', type: 'CREATIVE' }
            ].map((ev, i) => (
               <div key={i} className="flex gap-10 items-start group">
                  <div className="w-24 text-[10px] font-black uppercase text-slate-300 group-hover:text-indigo-600 transition-colors pt-1 italic">{ev.time}</div>
                  <div className="flex-1 pb-8 border-b border-slate-50 group-last:border-none">
                     <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 italic opacity-50">{ev.type}</p>
                     <p className="text-sm font-bold text-slate-900">{ev.event}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

    </div>
  );
}
