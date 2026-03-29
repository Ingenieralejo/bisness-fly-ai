'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Shield, Zap, Star, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';

/**
 * LANDING: DENTICARE BOGOTA
 * High-Conversion Strategic Mockup.
 */
export default function DenticareLanding() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Neural Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
         <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
         <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Persistent Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto backdrop-blur-md bg-slate-950/20 border-b border-slate-800/50">
        <div className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <span className="tracking-tighter">DENTICARE <span className="text-cyan-500 text-xs font-mono lowercase tracking-normal">× Fly.AI</span></span>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
           <a href="#" className="hover:text-cyan-400 transition-colors">La Solución</a>
           <a href="#" className="hover:text-cyan-400 transition-colors">Automatización</a>
           <a href="#" className="bg-cyan-500 text-slate-950 px-5 py-2 rounded-full hover:scale-105 transition-all text-center">Activar Demo $100</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-40">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
            
            {/* Left Content / Pitch */}
            <motion.div 
               initial={{ opacity: 0, x: -30 }} 
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full text-[10px] uppercase font-black tracking-wider text-indigo-400 mb-8">
                 <Zap size={10} fill="currentColor" /> Edición Limitada: Bogotá 2026
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[0.95] text-white tracking-tighter">
                No pierdas más <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent italic">pacientes.</span>
              </h1>
              <p className="text-xl text-slate-400 mb-12 max-w-lg leading-relaxed">
                El consultorio <span className="text-cyan-400 font-bold">Denticare</span> tiene la mejor atención en Suba, pero su WhatsApp manual los está frenando. 
                Nuestra <span className="text-white font-medium">Terminal IA</span> convierte cada chat en una cita paga automáticamente.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                 <button className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl shadow-cyan-500/20 flex items-center gap-2">
                   Empezar Ahora <ArrowRight size={14} />
                 </button>
                 <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Agente listo para integrar
                 </div>
              </div>

              {/* Verified Metrics */}
              <div className="mt-20 grid grid-cols-2 gap-10 border-t border-slate-900 pt-10">
                 <div>
                    <div className="text-3xl font-black text-white mb-2 tracking-tighter">+40%</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-4">Citas agendadas fuera de horario clerical</div>
                 </div>
                 <div>
                    <div className="text-3xl font-black text-white mb-2 tracking-tighter">24/7</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-4">Capacidad de respuesta ultra-veloz</div>
                 </div>
              </div>
            </motion.div>

            {/* Right Side: Virtual Agent Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-cyan-600/10 blur-[130px] rounded-full animate-pulse" />
              
              {/* Device Frame */}
              <div className="relative border border-slate-800 bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[40px] shadow-3xl overflow-hidden border-t-slate-700/50">
                <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Fly.AI Agent Active</span>
                    </div>
                    <MessageSquare size={16} className="text-slate-600" />
                </div>

                {/* Simulated Conversation */}
                <div className="space-y-8 min-h-[300px]">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold">P</div>
                     <div className="bg-slate-800/80 p-4 rounded-3xl rounded-tl-none text-xs leading-relaxed max-w-[85%] text-slate-300 border border-slate-700/50">
                       Hola Denticare, ¿qué precio tiene el diseño de sonrisa hoy?
                     </div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-row-reverse items-start gap-4"
                  >
                     <div className="w-10 h-10 rounded-2xl bg-cyan-500 shadow-lg shadow-cyan-500/40 flex items-center justify-center text-white">
                        <Zap size={18} fill="currentColor" />
                     </div>
                     <div className="bg-cyan-500 p-5 rounded-3xl rounded-tr-none text-xs leading-relaxed max-w-[85%] text-white font-medium shadow-2xl shadow-cyan-500/30">
                        ¡Hola! Para Denticare Suba tenemos planes desde $1.2M. ¿Te gustaría agendar una valoración gratuita mañana mismo para confirmarte?
                     </div>
                  </motion.div>
                </div>

                {/* Integration Blocks */}
                <div className="mt-12 grid grid-cols-1 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <CheckCircle size={16} className="text-cyan-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Pago Stripe Seguro</span>
                        </div>
                        <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-bold">ACTIVO</span>
                    </div>
                </div>
              </div>

              {/* Floating Floating Notification */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 hidden md:block"
              >
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                          <Zap size={20} />
                      </div>
                      <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Nueva Cita</div>
                          <div className="text-sm font-black text-slate-950 tracking-tight">Paciente: Camilo R.</div>
                      </div>
                  </div>
              </motion.div>
            </motion.div>
        </div>
      </main>

      {/* Trust Quote */}
      <section className="bg-slate-900/10 py-20 border-t border-slate-900 overflow-hidden">
         <div className="max-w-7xl mx-auto px-8 text-center">
            <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-10 leading-tight">
               "Automatizar nuestro agendamiento fue la decisión financiera más inteligente de 2026."
            </h3>
            <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale invert">
                {/* Brand Logo Placeholders */}
                <div className="font-black text-2xl">BOGOTÁ MEDICAL</div>
                <div className="font-black text-2xl">SUBA-DENT</div>
                <div className="font-black text-2xl">DENTI-PLUS</div>
            </div>
         </div>
      </section>

      {/* Footer / Final CTA */}
      <footer className="py-20 text-center border-t border-slate-900">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-4">Misión SNIPER #001</p>
          <p className="text-slate-500 text-[10px] mb-8">© 2026 Fly.AI by Antigravity. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
