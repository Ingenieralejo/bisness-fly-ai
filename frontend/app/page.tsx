'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VAULT_CODE = '120396120396';

function BitcoinLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="coinGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="100" cy="100" r="90" stroke="url(#coinGrad)" strokeWidth="4" fill="none" filter="url(#coinGlow)" />
      <circle cx="100" cy="100" r="78" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" fill="rgba(16,185,129,0.04)" />
      <text x="100" y="125" textAnchor="middle" fontSize="80" fontWeight="900" fill="url(#coinGrad)" filter="url(#coinGlow)" fontFamily="Syne, sans-serif">$</text>
      <line x1="88" y1="30" x2="88" y2="48" stroke="url(#coinGrad)" strokeWidth="3" strokeLinecap="round" />
      <line x1="112" y1="30" x2="112" y2="48" stroke="url(#coinGrad)" strokeWidth="3" strokeLinecap="round" />
      <line x1="88" y1="152" x2="88" y2="170" stroke="url(#coinGrad)" strokeWidth="3" strokeLinecap="round" />
      <line x1="112" y1="152" x2="112" y2="170" stroke="url(#coinGrad)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

import { useRouter } from 'next/navigation';

export default function VaultLoginPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(12).fill(''));
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (unlocked) {
      const timer = setTimeout(() => {
        router.push('/wealth-matrix');
      }, 2500); // Wait for the animation before redirecting
      return () => clearTimeout(timer);
    }
  }, [unlocked, router]);

  const handleDigitChange = useCallback((index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    setError(false);
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 11) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [digits]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 12);
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIdx = Math.min(pasted.length, 11);
    inputRefs.current[focusIdx]?.focus();
  }, [digits]);

  const attemptUnlock = useCallback(async () => {
    const code = digits.join('');
    if (code.length !== 12) return;
    setIsUnlocking(true);
    await new Promise((r) => setTimeout(r, 1800));
    if (code === VAULT_CODE) {
      setUnlocked(true);
    } else {
      setError(true);
      setIsUnlocking(false);
    }
  }, [digits]);

  useEffect(() => {
    if (digits.every((d) => d !== '') && digits.join('').length === 12) {
      attemptUnlock();
    }
  }, [digits, attemptUnlock]);

  const filledCount = digits.filter((d) => d !== '').length;
  const progress = (filledCount / 12) * 100;

  if (unlocked) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'radial-gradient(ellipse at center, #0a1128 0%, #030712 100%)' }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <BitcoinLogo className="w-32 h-32 mx-auto mb-8" />
          </motion.div>
          <h1 className="font-display text-4xl font-black text-emerald-400 mb-3">VAULT OPEN</h1>
          <p className="text-slate-400 text-lg">Neural Swarm activating...</p>
          <motion.div
            className="mt-6 h-1 bg-emerald-500/20 rounded-full overflow-hidden w-64 mx-auto"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#030712] [background-image:radial-gradient(ellipse_at_30%_20%,rgba(16,185,129,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(30,64,175,0.08)_0%,transparent_50%)]"
    >
      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-emerald-500/5 animate-rotate" />
        <div className="absolute w-[450px] h-[450px] rounded-full border border-blue-500/5 [animation:rotate-slow_30s_linear_infinite_reverse]" />
        <div className="absolute w-[750px] h-[750px] rounded-full border border-emerald-500/3 animate-rotate [animation-duration:40s]" />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
          animate={{ y: [0, -80, 0], x: [0, 20 * (i % 2 === 0 ? 1 : -1), 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
          style={{ top: `${20 + i * 12}%`, left: `${10 + i * 15}%` }}
        />
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="glass p-8 sm:p-10">
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
              <div className="absolute inset-0 animate-pulse-ring">
                <div className="w-28 h-28 rounded-full bg-emerald-500/10 blur-xl" />
              </div>
              <BitcoinLogo className="w-28 h-28 relative z-10" />
            </div>
          </motion.div>

          {/* Title */}
          <div className="text-center mb-8 fade-in delay-1">
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent">
                BISNESS FLY
              </span>
              <span className="text-slate-500">.AI</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2 tracking-widest uppercase">Neural Wealth Vault</p>
          </div>

          {/* Security label */}
          <div className="flex items-center justify-center gap-2 mb-6 fade-in delay-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400 tracking-widest uppercase">12-Digit Security Code</span>
          </div>

          {/* Digit inputs — 2 rows of 6 */}
          <div className="space-y-3 mb-6 fade-in delay-3">
            <div className="flex justify-center gap-2 sm:gap-3">
              {digits.slice(0, 6).map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className={`digit-input ${d ? 'filled' : ''} ${error ? '!border-red-500/60 !bg-red-500/5' : ''}`}
                  autoFocus={i === 0}
                  aria-label={`Security code digit ${i + 1} of 12`}
                />
              ))}
            </div>
            <div className="flex justify-center gap-2 sm:gap-3">
              {digits.slice(6, 12).map((d, i) => (
                <input
                  key={i + 6}
                  ref={(el) => { inputRefs.current[i + 6] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigitChange(i + 6, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i + 6, e)}
                  className={`digit-input ${d ? 'filled' : ''} ${error ? '!border-red-500/60 !bg-red-500/5' : ''}`}
                  aria-label={`Security code digit ${i + 7} of 12`}
                />
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-4 fade-in delay-4">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Status */}
          <AnimatePresence mode="wait">
            {isUnlocking ? (
              <motion.div
                key="unlocking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-3 py-3"
              >
                <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-emerald-400 text-sm font-semibold tracking-wider">DECRYPTING VAULT...</span>
              </motion.div>
            ) : error ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-red-400 text-sm font-medium py-3"
              >
                ⛔ INVALID CODE — Access Denied
              </motion.p>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-slate-600 text-xs py-3 tracking-wider"
              >
                {filledCount}/12 digits entered
              </motion.p>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-600 uppercase tracking-widest">AES-256 Encrypted</span>
            </div>
            <span className="text-[10px] text-slate-600 uppercase tracking-widest">v4.0 Neural</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
