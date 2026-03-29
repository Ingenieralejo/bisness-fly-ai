'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Scale, Clock, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

/**
 * LANDING: LAW FIRM BOGOTA/COLOMBIA
 */
export default function LegalLanding() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-serif selection:bg-amber-100 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-amber-100/10 blur-[150px] rounded-full" />
      </div>

      <nav className="relative z-50 flex justify-between items-center px-10 py-10 max-w-7xl mx-auto border-b border-white/5">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100/10 border border-amber-100/20 rounded-lg flex items-center justify-center">
            <Scale size={20} className="text-amber-100" />
          </div>
          LEGAL-AI <span className="text-amber-100 text-[10px] font-mono ml-3 border border-amber-100/30 px-2 py-0.5 rounded uppercase font-black">Elite Intake</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-10 pt-20 pb-40 grid lg:grid-cols-2 gap-24 items-center">
         <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
           <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tighter text-amber-50">
             Transformar el <br/> <span className="text-amber-100 italic">Prestigio</span> en Facturación.
           </h1>
           <p className="text-xl text-neutral-400 mb-12 max-w-lg leading-relaxed font-sans font-medium">
             Los abogados de alto nivel en Colombia no deberían estar respondiendo chats básicos de WhatsApp. 
             Nuestra **Terminal de Triaje Legal** filtra leads no calificados y agenda solo a clientes con potencial de retainer por solo **$100 USD**.
           </p>
           <button className="bg-amber-100 text-neutral-950 px-12 py-6 rounded-none font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl shadow-amber-100/10">
             Activar Intake Legal
           </button>
         </motion.div>

         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative">
            <div className="bg-neutral-900 border border-neutral-800 p-12 shadow-3xl">
               <div className="flex items-center gap-4 mb-10 text-amber-100">
                  <BookOpen size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Legal Swarm Integration</span>
               </div>
               <div className="space-y-8 font-sans">
                  <div className="flex items-start gap-4 pb-8 border-b border-neutral-800 opacity-30 italic text-neutral-500">
                     <span className="text-xs uppercase font-black">Consulta:</span>
                     <p className="text-xs">¿Tienen cita para divorcio express mañana?</p>
                  </div>
                  <div className="flex items-start gap-4">
                     <span className="text-xs uppercase font-black text-amber-100">Agente IA:</span>
                     <p className="text-xs leading-relaxed text-neutral-300">
                        "Claro. Antes de agendar, por favor envíanos la ciudad del registro civil y confirmaremos la disponibilidad del Dr. Herrera de inmediato."
                     </p>
                  </div>
               </div>
            </div>
         </motion.div>
      </main>
    </div>
  );
}
