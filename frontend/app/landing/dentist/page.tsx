'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Star, Activity, PlusCircle, CheckCircle } from 'lucide-react';

/**
 * LANDING: MEDICAL/DENTAL BOGOTA/COLOMBIA - GENERAL
 */
export default function DentistLanding() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-cyan-500/10 blur-[150px] rounded-full" />
      </div>

      <nav className="relative z-50 flex justify-between items-center px-10 py-10 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-2xl flex items-center justify-center">
            <Activity size={20} fill="currentColor" />
          </div>
          DENT-AI <span className="text-cyan-500 text-[10px] font-mono ml-3 border border-cyan-500/30 px-2 py-0.5 rounded uppercase font-black">Dental Triage</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-10 pt-20 pb-40 grid lg:grid-cols-2 gap-24 items-center">
         <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
           <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tighter">
             Tu consultorio <br/> <span className="text-cyan-500 italic text-5xl">en piloto automático.</span>
           </h1>
           <p className="text-xl text-slate-400 mb-12 max-w-lg leading-relaxed">
             El 40% de tus pacientes intenta agendar fuera de horario. 
             Nuestra **Terminal IA** califica, filtra y agenda citas en tu WhatsApp 24/7 sin que muevas un dedo. Por solo **$100 USD**.
           </p>
           <button className="bg-cyan-600 text-white px-12 py-6 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-cyan-600/20 flex items-center gap-2">
             Activar Agente Dental <Zap size={14} fill="currentColor" />
           </button>
         </motion.div>

         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative bg-slate-900/50 p-10 rounded-[40px] border border-white/5 backdrop-blur-3xl">
            <div className="flex -space-x-3 mb-10">
               {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 bg-slate-800 rounded-full border-2 border-slate-950 flex items-center justify-center font-bold text-[10px]">C{i}</div>)}
            </div>
            <div className="space-y-6">
                <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-3xl border border-white/5">
                   <CheckCircle size={14} className="text-cyan-500" />
                   <span className="text-xs font-bold leading-none">Notificación: Nueva cita agendada (Profilaxis)</span>
                </div>
                <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-3xl border border-white/5">
                   <CheckCircle size={14} className="text-cyan-500" />
                   <span className="text-xs font-bold leading-none">Notificación: Pago verificado vía Stripe ($100)</span>
                </div>
            </div>
         </motion.div>
      </main>
    </div>
  );
}
