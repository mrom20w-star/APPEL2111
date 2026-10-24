import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Plane, Users, History, Activity, Cpu, Radio, Zap } from 'lucide-react';
import { ASSETS } from '../config';
import { sound } from '../sound';

interface CrashGameScreenProps {
  onLogout: () => void;
  userId?: string;
}

export const CrashGameScreen: React.FC<CrashGameScreenProps> = ({ onLogout, userId }) => {
  const [multiplier, setMultiplier] = useState('0.00x');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeUsers, setActiveUsers] = useState(1894);
  const [history, setHistory] = useState(['1.42x', '2.15x', '1.83x', '1.18x', '3.20x', '2.45x', '1.67x']);
  const [progressPercent, setProgressPercent] = useState(0);
  const isUpdating = useRef(false);

  // Active users slight fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Realistic multiplier generator:
  // - 55% in 1.xx range (واحد وحاجة)
  // - 30% in 2.xx range (اتنين وحاجة)
  // - 11% in 3.xx range (تلاتة وحاجة)
  // - 4% rare higher odd between 4.00x and 6.20x (نادر جدًا)
  const generateRealisticMultiplier = (): string => {
    const rand = Math.random();
    if (rand < 0.55) {
      // واحد وحاجة
      const val = 1.1 + Math.random() * 0.88;
      return `${val.toFixed(2)}x`;
    } else if (rand < 0.85) {
      // اتنين وحاجة
      const val = 2.05 + Math.random() * 0.9;
      return `${val.toFixed(2)}x`;
    } else if (rand < 0.96) {
      // تلاتة وحاجة
      const val = 3.05 + Math.random() * 0.85;
      return `${val.toFixed(2)}x`;
    } else {
      // نادر أوي
      const val = 4.05 + Math.random() * 2.15;
      return `${val.toFixed(2)}x`;
    }
  };

  // Smooth roll-up animation of multiplier
  const animateMultiplierTo = async (targetStr: string) => {
    const targetVal = parseFloat(targetStr.replace('x', '')) || 1.85;
    const steps = 18;
    for (let step = 0; step <= steps; step++) {
      await new Promise((r) => setTimeout(r, 45));
      if (step < steps) {
        const current = 1 + (targetVal - 1) * (step / steps);
        setMultiplier(`${current.toFixed(2)}x`);
      } else {
        setMultiplier(targetStr);
      }
    }
  };

  // Triggered EXCLUSIVELY when user clicks the button
  const handleManualPredict = async () => {
    if (isUpdating.current || isAnalyzing) return;
    isUpdating.current = true;
    setIsAnalyzing(true);
    sound.playClick();
    sound.playScan();

    // Smoothly animate radar progress gauge over ~1.1s
    const totalDuration = 1100;
    const intervals = 20;
    for (let i = 1; i <= intervals; i++) {
      await new Promise((r) => setTimeout(r, totalDuration / intervals));
      setProgressPercent((i / intervals) * 100);
    }

    const target = generateRealisticMultiplier();
    await animateMultiplierTo(target);

    setHistory((prev) => [target, ...prev.slice(0, 11)]);
    setIsAnalyzing(false);
    isUpdating.current = false;
    sound.playSuccess();
  };

  const hasValue = multiplier !== '0.00x';
  const circumference = 2 * Math.PI * 46;

  return (
    <div
      dir="rtl"
      className="relative flex h-[100dvh] flex-col overflow-hidden font-sans text-white select-none"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-[rgba(47,139,255,0.18)] blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-md flex-col px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        {/* Top Header */}
        <div className="flex shrink-0 items-center justify-between">
          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onLogout();
            }}
            title="تسجيل الخروج"
            aria-label="تسجيل الخروج"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md transition-all hover:border-red-500/50 hover:bg-red-500/10 active:scale-95 cursor-pointer text-white/70 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
          </button>

          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[rgba(47,139,255,0.6)] shadow-[0_0_15px_rgba(47,139,255,0.5)]">
              <img
                src={ASSETS.crashLogo}
                alt="كراش"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-right">
              <h1 className="text-[17px] font-black leading-tight text-white flex items-center gap-1.5">
                <span>كراش</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#1fd67a] animate-ping" />
              </h1>
              <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#8CC4FF]">
                CRASH PREDICTOR VIP
              </p>
            </div>
          </div>

          {/* Online Counter */}
          <div className="flex h-10 items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-2.5">
            <Users className="h-3 w-3 text-[#2F8BFF]" />
            <span className="font-mono text-[10px] font-black tabular-nums text-white/70">
              {activeUsers.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Signals History Card */}
        <div className="glass-card mt-3.5 shrink-0 rounded-2xl p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-black text-white/60">
              <History className="h-3.5 w-3.5 text-[#2F8BFF]" />
              آخر التوقعات
            </span>
            <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em] text-[#2F8BFF]">
              <Activity className="h-3 w-3 animate-pulse" />
              LIVE RADAR
            </span>
          </div>

          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto" dir="ltr">
            <AnimatePresence initial={false}>
              {history.map((item, idx) => (
                <motion.div
                  key={`${item}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`shrink-0 rounded-xl px-3 py-1 font-mono text-[11px] font-black ${
                    idx === 0 && hasValue
                      ? 'bg-[#2F8BFF] text-[#050B24] shadow-[0_0_18px_rgba(47,139,255,0.7)]'
                      : 'border border-white/[0.08] bg-white/[0.03] text-white/50'
                  }`}
                >
                  {item}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Radar / Multiplier Gauge */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center py-2 sm:py-4">
          <div className="relative flex aspect-square w-full max-w-[270px] sm:max-w-[290px] items-center justify-center">
            {/* Outer rotating dashed ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed border-[rgba(47,139,255,0.25)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            />

            {/* SVG Circular Progress Gauge */}
            <svg viewBox="0 0 100 100" className="absolute inset-[4%] -rotate-90">
              <circle
                cx="50"
                cy="50"
                r={46}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1.6"
              />
              <circle
                cx="50"
                cy="50"
                r={46}
                fill="none"
                stroke="#2F8BFF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progressPercent / 100)}
                style={{
                  transition: 'stroke-dashoffset 0.15s ease-out',
                  filter: 'drop-shadow(0 0 6px #2F8BFF)',
                }}
              />
            </svg>

            {/* Inner Glowing Dial */}
            <div className="relative flex h-[78%] w-[78%] flex-col items-center justify-center rounded-full border border-[rgba(47,139,255,0.35)] bg-[radial-gradient(circle_at_50%_30%,rgba(47,139,255,0.24),rgba(5,11,36,0.96)_70%)] shadow-[0_0_80px_-20px_rgba(47,139,255,0.9),inset_0_0_40px_rgba(47,139,255,0.15)]">
              {isAnalyzing && (
                <motion.div
                  className="absolute inset-1 rounded-full border-2 border-transparent border-t-[#2F8BFF]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
              )}

              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-1">
                <Plane className="h-3 w-3 text-[#2F8BFF]" />
                {isAnalyzing ? 'جارٍ قراءة المسار...' : hasValue ? 'المضاعف المتوقع' : 'في الانتظار'}
              </span>

              <div
                dir="ltr"
                className="mt-1 font-mono text-[48px] sm:text-[54px] font-black leading-none tracking-tighter"
                style={{
                  color: hasValue ? '#fff' : 'rgba(255,255,255,0.7)',
                  textShadow: hasValue ? '0 0 30px rgba(47,139,255,0.95)' : 'none',
                }}
              >
                {multiplier}
              </div>

              <span
                dir="ltr"
                className="mt-2 font-mono text-[9px] tracking-[0.18em] text-[#8CC4FF]/80"
              >
                ID: {userId || 'ANONYMOUS'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Exclusive Manual Prediction Trigger */}
        <div className="shrink-0 mb-3">
          <button
            type="button"
            onClick={handleManualPredict}
            disabled={isAnalyzing}
            className="group flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl btn-cta text-[14px] font-black uppercase tracking-wider transition-all duration-200 active:scale-[0.98] shadow-lg cursor-pointer disabled:opacity-60"
          >
            <Zap className={`h-4 w-4 fill-current ${isAnalyzing ? 'animate-bounce' : ''}`} />
            <span>
              {isAnalyzing
                ? 'جارٍ قراءة وتحليل الإشارة...'
                : hasValue
                ? 'توقع الجولة التالية الآن'
                : 'بدء توقع الجولة الأولى'}
            </span>
          </button>
        </div>

        {/* Server Analysis Status Card */}
        <div className="glass-card shrink-0 rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(47,139,255,0.15)] border border-[rgba(47,139,255,0.3)] shadow-[0_0_15px_rgba(47,139,255,0.2)]">
                <Cpu className="h-5 w-5 text-[#2F8BFF] animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F8BFF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2F8BFF]" />
                </span>
              </div>
              <div>
                <p className="text-[12px] font-black text-white flex items-center gap-1.5">
                  <span>خوارزمية كراش نشطة</span>
                </p>
                <p className="text-[9.5px] text-white/50">
                  {isAnalyzing
                    ? 'جارٍ مسح الترددات وحساب نقطة الإقلاع الآمنة...'
                    : hasValue
                    ? 'تم تثبيت التوقع للجولة الحالية — اضغط لبدء الجولة القادمة'
                    : 'في انتظار ضغطتك — اضغط على الزر أعلاه لتوليد التوقع'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-[rgba(47,139,255,0.3)] bg-[rgba(47,139,255,0.08)] px-2.5 py-1">
              <Radio className="h-3 w-3 text-[#2F8BFF] animate-pulse" />
              <span className="font-mono text-[10px] font-black text-[#8CC4FF]">
                {isAnalyzing ? 'SCANNING' : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Animated Analysis Progress Sweep */}
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07] relative">
            <div
              className="h-full rounded-full bg-gradient-to-l from-[#8CC4FF] to-[#2F8BFF] transition-all duration-200 shadow-[0_0_10px_rgba(47,139,255,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
