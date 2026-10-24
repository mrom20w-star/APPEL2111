import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSETS } from '../config';

interface SplashScreenProps {
  onComplete: () => void;
  language?: 'ar' | 'en';
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, language = 'ar' }) => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startTime = Date.now();
    let finished = false;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = (elapsed / 2800) * 100;
      setProgress(Math.min(pct, 100));

      if (pct >= 100 && !finished) {
        finished = true;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => setIsClosing(true), 350);
        setTimeout(() => onCompleteRef.current(), 950);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  const isAr = language === 'ar';
  const steps = isAr
    ? ['تشفير الجلسة', 'الاتصال بالسيرفر', 'تحليل الجولات', 'النظام جاهز']
    : ['ENCRYPTING', 'CONNECTING', 'ANALYZING', 'READY'];

  const stepIndex = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`fixed inset-0 z-[100] overflow-hidden bg-[#050B24] transition-all duration-1000 ease-out ${
        isClosing ? 'scale-[1.06] opacity-0 blur-sm pointer-events-none' : 'scale-100 opacity-100'
      }`}
    >
      {/* Background Glow & Matrix grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(47,139,255,0.2)] blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(140,196,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(140,196,255,1) 1px, transparent 1px)`,
            backgroundSize: '38px 38px',
            maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050B24] to-transparent" />
      </div>

      {/* Center Holographic Portal */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-9">
        <div className="relative flex aspect-square w-full max-w-[190px] sm:max-w-[210px] items-center justify-center">
          {[0, 1].map((idx) => (
            <motion.div
              key={idx}
              className="absolute rounded-full border border-[rgba(47,139,255,0.25)]"
              style={{
                inset: `${-18 - idx * 26}%`,
                borderStyle: idx ? 'dashed' : 'solid',
              }}
              animate={{ rotate: idx ? -360 : 360 }}
              transition={{ duration: 20 + idx * 10, repeat: Infinity, ease: 'linear' }}
            >
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#2F8BFF] shadow-[0_0_12px_#2F8BFF]" />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
            className="relative aspect-square w-full"
          >
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[rgba(47,139,255,0.35)] blur-[50px]" />
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[rgba(47,139,255,0.5)] shadow-[0_0_80px_-15px_rgba(47,139,255,0.95)]">
              <img
                src={ASSETS.appleHackLogo}
                alt="APPLE HACK"
                className="h-full w-full object-cover"
              />
              <motion.div
                className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ left: '-40%' }}
                animate={{ left: '140%' }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Progress Bar & Stage Indicator */}
      <div className="absolute inset-x-0 bottom-14 z-10 flex flex-col items-center px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-[10px] font-black uppercase tracking-[0.38em] text-[#8CC4FF]"
          >
            {steps[stepIndex]}
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 w-full max-w-[280px]" dir="ltr">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.08] p-[1px] border border-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#1E6FE0] via-[#2F8BFF] to-[#8CC4FF] shadow-[0_0_14px_rgba(47,139,255,0.9)]"
              style={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
        </div>

        <span
          dir="ltr"
          className="mt-3 font-mono text-[11px] font-black tabular-nums text-[#8CC4FF]"
        >
          {String(Math.round(progress)).padStart(2, '0')}%
        </span>
      </div>
    </div>
  );
};
