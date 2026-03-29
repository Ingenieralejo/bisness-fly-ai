'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, AlertTriangle, PhoneCall, Clock, CheckCircle, ArrowRight } from 'lucide-react';

/**
 * LANDING: SOS CERRAJERIA BOGOTA
 * Fast Extraction Mockup for 24h Emergency Service.
 */
export default function SOSLanding() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Emergency Neural Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,80,0,0.1),transparent_50%)]" />
         <div className="absolute w-full h-px top-[10%] bg-white/5" />
         <div className="absolute w-full h-px top-[30%] bg-white/5" />
         <div className="absolute w-full h-px top-[50%] bg-white/5" />
         <div className="absolute left-[10%] top-0 h-full w-px bg-white/5" />
         <div className="absolute left-[30%] top-0 h-full w-px bg-white/5" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex justify-between items-center px-10 py-10 max-w-7xl mx-auto border-b border-white/5">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center shadow-lg shadow-orange-600/30">
            <Shield size={20} fill="currentColor" />
          </div>
          SOS BOGOTÁ <span className="text-orange-500 text-[10px] font-mono ml-3 border border-orange-500/30 px-2 py-0.5 rounded">HYPER-DISPATCH v1.0</span>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
           <a href="#solucion" className="hover:text-orange-400 transition-colors">Sistema</a>
           <a href="#demo" className="hover:text-orange-400 transition-colors italic border-b border-orange-600/50">Ver Demo 24h</a>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-10 pt-32 pb-40">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
            
            {/* Left Column: Aggressive Pitch */}
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-600/20 px-3 py-1.5 rounded text-[10px] uppercase font-black tracking-widest text-orange-500 mb-8 animate-pulse">
                 <AlertTriangle size={12} fill="currentColor" /> Crítico: Cerrajería SOS 24h
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-12 leading-[0.85] tracking-tighter">
                No pierdas <br/> <span className="text-orange-600 drop-shadow-2xl">una sola llave.</span> <br/>
                <span className="text-slate-400 text-5xl italic font-serif">Ni un solo cliente.</span>
              </h1>
              <p className="text-xl text-slate-400 mb-12 max-w-lg leading-relaxed">
                Las urgencias en Bogotá no dan espera. Si no contestas en el primer minuto, el cliente llama a la competencia. 
                Nuestra <span className="text-white font-bold">Terminal de Despacho Inmediato</span> atiende y califica servicios mientras tu equipo está en campo por solo <span className="text-orange-500 font-bold underline">$100 USD</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-8">
                 <button className="bg-orange-600 text-white px-12 py-6 rounded-none font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-500 transition-all shadow-3xl shadow-orange-600/20 flex items-center gap-3">
                   DESPLEGAR SNIPER <ArrowRight size={16} />
                 </button>
                 <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
                    Protocolo de Extracción Activo
                 </div>
              </div>
            </motion.div>

            {/* Right Column: Tactical Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-orange-600/10 blur-[150px] rounded-full" />
              
              <div className="relative border border-white/10 bg-white/5 backdrop-blur-3xl p-12 rounded-sm shadow-inner overflow-hidden min-h-[500px]">
                <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-4">
                        <PhoneCall size={20} className="text-orange-600 animate-bounce" />
                        <div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 leading-none">Status</div>
                           <div className="text-sm font-black text-white leading-none">RECEPCIÓN 24H ACTIVA</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-12 mb-16">
                    <div className="bg-white/5 p-8 rounded border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-600" />
                        <Clock size={24} className="text-orange-500 mb-4 opacity-50" />
                        <div className="text-4xl font-black mb-2 tracking-tighter">0 SEGUNDOS</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Velocidad de Respuesta del Agente</div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded flex items-center gap-4 group hover:bg-emerald-500/10 transition-all">
                            <CheckCircle size={18} className="text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Pago Stripe Seguro de Emergencia Integrado</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-10 border-t border-white/5">
                   <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em] mb-4">Misión SNIPER #002 — Bogotá 2026</p>
                </div>
              </div>
            </motion.div>
        </div>
      </main>

      {/* Industry Evidence */}
      <section className="py-24 border-t border-white/5 bg-slate-100/5">
         <div className="max-w-7xl mx-auto px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                <div>
                   <Zap size={32} className="text-orange-500 mx-auto mb-6" />
                   <h4 className="text-xl font-black mb-4 tracking-tighter">TRIAGE IA</h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">El bot clasifica la emergencia (Apertura Puerta, Cambio Guarda, Vehículo) antes de pasártelo.</p>
                </div>
                <div>
                   <Shield size={32} className="text-orange-500 mx-auto mb-6" />
                   <h4 className="text-xl font-black mb-4 tracking-tighter">BOT DE AGENDAMIENTO</h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">Captura ubicación y datos del cliente automáticamente mientras manejas.</p>
                </div>
                <div>
                   <ArrowRight size={32} className="text-orange-500 mx-auto mb-6" />
                   <h4 className="text-xl font-black mb-4 tracking-tighter">PAGO ADELANTADO</h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">Opción de cobro de 'Servicio a domicilio' inmediato para asegurar la ruta.</p>
                </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-white/5 opacity-40">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-500">Arquitectura de Ingreso Autónomo by Antigravity</p>
      </footer>
    </div>
  );
}
