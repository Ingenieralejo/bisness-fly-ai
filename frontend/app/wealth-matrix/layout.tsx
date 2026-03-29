"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWealthStore } from "@/lib/store/wealth-store";

export default function WealthMatrixLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { portfolio, isSyncing } = useWealthStore();

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans text-slate-900">
      
      {/* GLOBAL STATUS BAR */}
      <div className="bg-slate-900 text-white py-2 px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-indigo-500/20">
         <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
               FLY.AI Engine Status: {isSyncing ? 'SYNCING_UNIVERSES' : 'OPTIMAL'}
            </span>
            <span className="text-slate-500 px-2 italic text-[9px]">v10.0 Corporate Deployment</span>
         </div>
         <div className="flex gap-8">
            <div className="flex gap-2 items-center">
               <span className="text-indigo-400">Total Potential:</span>
               <span>${portfolio.reduce((acc, b) => acc + (b.potential || 0), 0).toLocaleString()} /mo</span>
            </div>
            <div className="flex gap-2 items-center">
               <span className="text-emerald-400">Nodes Active:</span>
               <span>{portfolio.filter(b => b.status === "ACTIVE").length} / 10</span>
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* WEALTH SIDEBAR (Sub-navigation) */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden xl:flex flex-col p-6 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-lg font-black italic text-indigo-600">Wealth Matrix</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Business Model Orchestrator</p>
          </div>

          <nav className="space-y-1">
            <Link 
              href="/wealth-matrix" 
              className={`flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase transition-all ${pathname === '/wealth-matrix' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span>📊</span> Global Overview
            </Link>
            
            <div className="py-4 mt-4">
               <p className="text-[8px] font-black text-slate-300 uppercase px-4 mb-2 tracking-widest">Active Fleet</p>
               {portfolio.map(model => (
                 <Link 
                   key={model.id}
                   href={`/wealth-matrix/${model.slug || model.id}`} 
                   className={`flex items-center justify-between p-3 rounded-xl text-[10px] font-black uppercase transition-all mb-1 ${pathname.includes(model.slug || model.id) ? 'bg-slate-100 text-indigo-600 border border-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                   <div className="flex items-center gap-3">
                      <span>{model.icon}</span>
                      <span className="truncate max-w-[120px]">{model.name}</span>
                   </div>
                   {model.status === 'ACTIVE' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                 </Link>
               ))}
            </div>
          </nav>
        </aside>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-1"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
