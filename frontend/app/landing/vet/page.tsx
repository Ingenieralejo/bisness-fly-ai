'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart, Clock, CheckCircle, ArrowRight, Activity } from 'lucide-react';

/**
 * LANDING: VETERINARY BOGOTA/COLOMBIA
 */
export default function VetLanding() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full" />
      </div>

      <nav className="relative z-50 flex justify-between items-center px-10 py-10 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
            <Heart size={20} fill="currentColor" />
          </div>
          VET-AI <span className="text-emerald-500 text-[10px] font-mono ml-3 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">Emergency Dispatch</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-10 pt-20 pb-40 grid lg:grid-cols-2 gap-24 items-center">
         <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
           <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tighter">
             Salva vidas. <br/> <span className="text-emerald-500 italic">Automatiza</span> el triage.
           </h1>
           <p className="text-xl text-slate-400 mb-12 max-w-lg leading-relaxed">
             Las urgencias veterinarias no esperan. Si tu WhatsApp está saturado, los dueños de mascotas buscan otra clínica. 
             Nuestra **Terminal IA** califica la urgencia y agenda la cita de inmediato por solo **$100 USD**.
           </p>
           <button className="bg-emerald-600 text-white px-12 py-6 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
             Activar Demo Veterinaria
           </button>
         </motion.div>

         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative">
            <div className="bg-slate-900/80 backdrop-blur-3xl p-10 rounded-[30px] border border-slate-800 shadow-2xl">
               <div className="flex items-center gap-4 mb-10 text-emerald-500">
                  <Activity size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">Monitor de Triage Activo</span>
               </div>
               <div className="space-y-6">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-300">Paciente: Golden Retriever</span>
                     <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded font-black italic">URGENTE</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center opacity-50">
                     <span className="text-xs font-bold text-slate-300">Paciente: Gato Persa</span>
                     <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded font-black italic">AGENDADO</span>
                  </div>
               </div>
            </div>
         </motion.div>
      </main>
    </div>
  );
}
