"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export function TerminalChat() {
  const [messages, setMessages] = useState<{ sender: string; text: string; isAi: boolean }[]>([
    { sender: "System", text: "[SECURE CONNECTION ESTABLISHED]", isAi: true },
    { sender: "BISNESS FLY.AI", text: "Enjambre Neuronal en línea. Esperando directivas tácticas, ANTIGRAVITY.", isAi: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const [token, setToken] = useState<string | null>(null);

  const getUplinkToken = async () => {
    if (token) return token;
    try {
      const res = await fetch("http://localhost:4000/auth/uplink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: process.env.NEXT_PUBLIC_ARCHITECT_KEY }),
      });
      const data = await res.json();
      if (data.accessToken) {
        setToken(data.accessToken);
        return data.accessToken;
      }
      throw new Error("Invalid Architect Key");
    } catch {
      return null;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { sender: "ANTIGRAVITY", text: userMsg, isAi: false }]);
    setIsLoading(true);

    try {
      const jwtToken = await getUplinkToken();
      if (!jwtToken) {
        throw new Error("UNAUTHORIZED_UPLINK");
      }

      const res = await fetch("http://localhost:4000/wealth-matrix/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ prompt: userMsg }),
      });
      
      if (res.status === 401) throw new Error("UNAUTHORIZED_UPLINK");
      
      const data = await res.json();
      setMessages(prev => [...prev, { sender: data.sender || "BISNESS FLY.AI", text: data.message, isAi: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: "System Error", text: "Conexión rechazada. Protocolo de seguridad intruso activado.", isAi: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#030712] rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[500px]">
      <header className="bg-slate-900 border-b border-white/5 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="font-display font-black text-white text-xs tracking-widest uppercase">
            NEURAL COMMS: BISNESS FLY.AI ⟷ ANTIGRAVITY
          </h3>
        </div>
        <span className="text-[9px] text-slate-500 font-bold uppercase">Uplink Active</span>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${m.isAi ? 'items-start' : 'items-end'}`}
          >
            <span className={`text-[10px] font-black uppercase mb-1 tracking-widest ${m.isAi ? 'text-emerald-500' : 'text-indigo-400'}`}>
              {m.sender}
            </span>
            <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${m.isAi ? 'bg-slate-900 text-slate-300 rounded-tl-none border border-slate-800' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-emerald-500 text-[10px] font-black tracking-widest">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-75" />
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150" />
            <span className="ml-2">PROCESANDO DIRECTIVA...</span>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-white/5">
        <label htmlFor="terminal-input" className="sr-only">Mensaje para Neural Swarm</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">❯</span>
          <input
            id="terminal-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Introduce comando táctico..."
            className="w-full bg-black/50 border border-slate-700 text-slate-200 placeholder:text-slate-600 rounded-full py-3 pl-10 pr-14 outline-none focus:border-indigo-500 transition-colors text-sm"
            autoComplete="off"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full disabled:opacity-50 hover:bg-indigo-500 transition-colors"
            aria-label="Enviar directiva"
          >
            ⏎
          </button>
        </div>
      </form>
    </div>
  );
}
