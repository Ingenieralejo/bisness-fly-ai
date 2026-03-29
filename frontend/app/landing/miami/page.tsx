'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, TrendingUp, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';

/**
 * LANDING: MIAMI LUXURY REAL ESTATE AI FILTER
 * High-Ticket Extraction Strategy for the U.S. Market.
 */
export default function MiamiLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-amber-100 overflow-x-hidden">
      {/* Background - Soft Luxe Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-amber-500/10 blur-[150px] rounded-full animate-pulse" />
         <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Luxury Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-12 py-10 max-w-7xl mx-auto border-b border-slate-100">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 group">
            <Globe size={24} className="text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span className="tracking-widest uppercase text-lg">MIAMI <span className="text-amber-600 font-serif italic lowercase tracking-tight">elites</span></span>
        </div>
        <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
           <a href="#leads" className="hover:text-slate-950 transition-colors">Portfolio</a>
           <a href="#tech" className="hover:text-slate-950 transition-colors">Neural Intake</a>
           <a href="#" className="bg-slate-950 text-white px-8 py-3 rounded-full hover:bg-amber-600 shadow-xl shadow-slate-950/10 transition-all">Luxe Demo</a>
        </div>
      </nav>

      {/* Main Luxury Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-12 pt-32 pb-40">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
            
            {/* Left Column: The $1M+ Pitch */}
            <motion.div 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-12">
                 <Shield size={12} fill="currentColor" /> Tier-1 Real Estate Tech v3.0
              </div>
              <h1 className="text-7xl md:text-[110px] font-black mb-12 leading-[0.82] tracking-tighter text-slate-950">
                Automate the <br/> <span className="text-amber-600 font-serif italic">Ultra-Luxury</span> <br/> Triage.
              </h1>
              <p className="text-xl text-slate-500 mb-16 max-w-md leading-relaxed font-medium">
                Miami agents like <span className="text-slate-950 font-black">Eduardo Lima</span> handle inquiries from 70+ countries. 
                Stop manual chats. Our **Neural Concierge** qualifies global investors before they reach your phone. 
                One-time Digital Fee: <span className="text-slate-950 font-black decoration-amber-500 underline decoration-4">$100 USD</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 items-start">
                 <button className="bg-slate-950 text-white px-12 py-7 rounded-none font-black uppercase text-xs tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-4xl shadow-slate-900/20 flex items-center gap-4">
                   Activate International Test <ArrowRight size={16} />
                 </button>
                 <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                       {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">M{i}</div>)}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trusted by Key Biscayne Teams</div>
                 </div>
              </div>

              {/* Verified Metrics */}
              <div className="mt-24 grid grid-cols-2 gap-12 border-t border-slate-100 pt-16">
                 <div>
                    <div className="text-5xl font-black text-slate-950 mb-3 tracking-tighter font-serif">$2.5M+</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-4">Smart Lead Filter Minimum</div>
                 </div>
                 <div>
                    <div className="text-5xl font-black text-slate-950 mb-3 tracking-tighter font-serif">73+</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-4">Countries Supported Instantly</div>
                 </div>
              </div>
            </motion.div>

            {/* Right Column: Virtual Concierge Preview */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative lg:pl-20"
            >
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-amber-500/5 blur-[120px] rounded-full" />
              
              {/* Luxury Device Stand */}
              <div className="relative border-[16px] border-slate-50 bg-white p-2 rounded-[60px] shadow-6xl overflow-hidden aspect-[9/18] max-w-[360px] mx-auto border-t-slate-100/50 scale-110">
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-50 rounded-full z-20" />
                 <div className="w-full h-full bg-slate-50 relative flex flex-col p-6 pt-12 overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-[8px] font-black text-white">EL</div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Miami Concierge</span>
                        </div>
                        <TrendingUp size={14} className="text-amber-600" />
                    </div>

                    {/* Chat Bubbles */}
                    <div className="space-y-8 flex-1">
                        <div className="flex items-start gap-4">
                           <div className="bg-white p-4 rounded-2xl rounded-tl-none text-[10px] leading-relaxed text-slate-500 shadow-sm font-medium">
                             "Bom dia Eduardo, I'm from Brazil and I want to see the Star Island property."
                           </div>
                        </div>
                        <motion.div 
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: 2 }}
                           className="flex flex-row-reverse items-start gap-4"
                        >
                           <div className="bg-slate-950 p-5 rounded-3xl rounded-tr-none text-[10px] leading-relaxed text-white font-black shadow-3xl shadow-slate-950/20">
                             "Olá! I am Eduardo's Neural Agent. To provide the best service, do you have a US company for this acquisition or personal financing?"
                           </div>
                        </motion.div>
                    </div>

                    {/* Live Triage Tag */}
                    <div className="mt-8 p-5 bg-amber-50 rounded-3xl border border-amber-100 text-center">
                        <UserCheck size={20} className="mx-auto text-amber-600 mb-3" />
                        <div className="text-[11px] font-black text-amber-900 tracking-tight uppercase mb-1">Lead Qualified: Level A+</div>
                        <div className="text-[9px] font-black text-amber-600 tracking-widest uppercase">Brazil Investor | $3M Budget</div>
                    </div>
                 </div>
              </div>

              {/* Floating Floating Notification */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -right-4 bg-slate-950 p-6 rounded-4xl shadow-5xl hidden xl:block"
              >
                  <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
                          <Zap size={24} fill="currentColor" />
                      </div>
                      <div>
                          <div className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Concierge Alert</div>
                          <div className="text-md font-black text-white">$10.5M Deal Identified</div>
                      </div>
                  </div>
              </motion.div>
            </motion.div>
        </div>
      </main>

      {/* Social Proof Section */}
      <section className="py-32 border-t border-slate-50 bg-slate-50/20">
         <div className="max-w-7xl mx-auto px-12 text-center text-slate-300">
            <h3 className="text-[10px] font-black uppercase tracking-[1em] mb-16 text-slate-400">Global Neural Expansion</h3>
            <div className="flex flex-wrap justify-between items-center gap-16 px-10">
               <div className="font-serif italic text-3xl font-black text-slate-950 opacity-20 hover:opacity-100 transition-opacity">Key Biscayne Luxury</div>
               <div className="font-serif italic text-3xl font-black text-slate-950 opacity-20 hover:opacity-100 transition-opacity">Fisher Island Residences</div>
               <div className="font-serif italic text-3xl font-black text-slate-950 opacity-20 hover:opacity-100 transition-opacity">The Ritz-Carlton Miami</div>
               <div className="font-serif italic text-3xl font-black text-slate-950 opacity-20 hover:opacity-100 transition-opacity">Sotheby's Intl.</div>
            </div>
         </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-20 border-t border-slate-50 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Architecture of Infinite Wealth by Antigravity v3.0</p>
      </footer>
    </div>
  );
}
