import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Fingerprint,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LoaderCircle,
  CheckCircle2,
} from 'lucide-react';
import { ASSETS, ACCESS_PASSWORD } from '../config';
import { sound } from '../sound';

interface LoginScreenProps {
  onLogin: (userId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem('apple_hack_user_id') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState(0);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sound.playClick();

    const cleanId = userId.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      sound.playError();
      setErrorMsg('يرجى إدخال رقم المعرف (ID)');
      return;
    }

    if (!cleanPass) {
      sound.playError();
      setErrorMsg('يرجى إدخال كلمة المرور (Password)');
      return;
    }

    if (cleanPass !== ACCESS_PASSWORD) {
      sound.playError();
      setErrorMsg('كلمة المرور غير صحيحة، يرجى إدخال كلمة المرور المصرح بها (MXG1)');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('apple_hack_user_id', cleanId);
    } else {
      localStorage.removeItem('apple_hack_user_id');
    }

    setErrorMsg(null);
    setIsAuthenticating(true);
    sound.playScan();
    setAuthStep(1);

    setTimeout(() => {
      setAuthStep(2);
    }, 600);

    setTimeout(() => {
      sound.playSuccess();
      setIsAuthenticating(false);
      onLogin(cleanId);
    }, 1100);
  };

  return (
    <div dir="rtl" className="relative flex min-h-full flex-col font-sans text-white select-none">
      {/* Background radial ambient lights */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -right-28 -top-10 h-96 w-96 rounded-full bg-[rgba(47,139,255,0.18)] blur-[150px]" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 rounded-full bg-[rgba(47,139,255,0.12)] blur-[150px]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(47,139,255,0.08)] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col px-5 pb-16 pt-8">
        {/* Logo and Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          {/* Glowing Animated Circular Logo */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[rgba(47,139,255,0.4)] blur-2xl" />
            <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(47,139,255,0.6)] shadow-[0_0_50px_-8px_rgba(47,139,255,0.95)]">
              <img
                src={ASSETS.appleHackLogo}
                alt="APPLE HACK"
                className="h-full w-full object-cover"
              />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border border-[rgba(47,139,255,0.45)]"
              animate={{ scale: [1, 1.35], opacity: [0.75, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          </div>

          {/* Badge */}
          <div className="mt-5 flex items-center gap-2 rounded-full border border-[rgba(47,139,255,0.3)] bg-[rgba(47,139,255,0.08)] px-4 py-1.5 shadow-[0_0_20px_rgba(47,139,255,0.15)]">
            <Sparkles className="h-3.5 w-3.5 text-[#2F8BFF]" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8CC4FF]">
              APPLE HACK · VIP TERMINAL
            </span>
          </div>

          <h1 className="mt-4 text-[34px] font-black leading-tight tracking-tight">
            تسجيل <span className="text-[#2F8BFF] drop-shadow-[0_0_20px_rgba(47,139,255,0.7)]">الدخول</span>
          </h1>

          <p className="mt-2 text-[12.5px] leading-relaxed text-white/50 max-w-[300px]">
            أدخل معرف الحساب وكلمة المرور للاتصال المباشر بسيرفر توقعات الطائرة
          </p>
        </motion.div>

        {/* Login Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mt-7 overflow-hidden rounded-[28px] border border-[rgba(47,139,255,0.22)] bg-gradient-to-b from-[rgba(47,139,255,0.1)] via-[#050B24]/95 to-[#03071a] p-6 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-[rgba(47,139,255,0.8)] to-transparent" />

          <div className="flex flex-col gap-4">
            {/* User ID Field */}
            <div>
              <label className="mb-2 block text-xs font-bold text-white/70">
                رقم المعرف (User ID)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center border-l border-white/10 px-3.5 pointer-events-none text-white/30">
                  <Fingerprint className={`h-5 w-5 ${userId ? 'text-[#2F8BFF]' : 'text-white/30'}`} />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="مثال: 1829018123"
                  className="w-full rounded-2xl border border-white/10 bg-[#061034]/80 py-3.5 pl-4 pr-14 text-right font-mono text-base text-white placeholder:text-white/25 focus:border-[#2F8BFF] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-2 block text-xs font-bold text-white/70">
                كلمة المرور (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center border-l border-white/10 px-3.5 pointer-events-none text-white/30">
                  <Lock className={`h-5 w-5 ${password ? 'text-[#2F8BFF]' : 'text-white/30'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-[#061034]/80 py-3.5 pl-12 pr-14 text-right font-mono text-base text-white placeholder:text-white/25 focus:border-[#2F8BFF] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center px-3.5 text-white/35 hover:text-[#2F8BFF] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/60 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#2F8BFF] cursor-pointer"
                />
                <span>تذكر الحساب</span>
              </label>
              <span className="text-[11px] text-[#8CC4FF]/70 font-mono">VIP 2026</span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-red-400"
              >
                {errorMsg}
              </motion.p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="mt-2 group flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl btn-cta text-[14px] font-black uppercase tracking-wider transition-all duration-200 active:scale-[0.98] shadow-lg cursor-pointer disabled:opacity-60"
            >
              <span>تسجيل الدخول إلى السكريبت</span>
              <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>

          {/* Footnote */}
          <div className="mt-5 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-4 text-white/40">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2F8BFF]" />
            <span className="text-[10px]">تشفير عسكري آمن 256-bit للاتصال بالخادم</span>
          </div>
        </motion.form>
      </div>

      {/* Holographic Verification Modal */}
      <AnimatePresence>
        {isAuthenticating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050B24]/95 p-5 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-[340px] overflow-hidden rounded-[30px] border border-[rgba(47,139,255,0.3)] bg-gradient-to-b from-[rgba(47,139,255,0.12)] via-[#050B24] to-black p-7 text-center shadow-[0_50px_120px_-40px_rgba(47,139,255,0.6)]"
            >
              <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-[rgba(47,139,255,0.25)] blur-[70px]" />

              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[rgba(47,139,255,0.5)] bg-[#050B24] shadow-[0_0_40px_-5px_rgba(47,139,255,0.85)]">
                  <img
                    src={ASSETS.appleHackLogo}
                    alt="APPLE HACK"
                    className="h-full w-full object-cover"
                  />
                  <motion.div
                    className="absolute inset-x-0 h-[2px] bg-[#2F8BFF] shadow-[0_0_12px_#2F8BFF]"
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>

              <h3 className="relative mt-4 text-[18px] font-black leading-tight">
                {authStep === 2 ? 'تم التحقق بنجاح!' : 'جارٍ تأكيد الجلسة...'}
              </h3>
              <p className="relative mt-1 font-mono text-[11px] tracking-[0.18em] text-[#8CC4FF]" dir="ltr">
                ID: {userId}
              </p>

              <div className="relative mt-5 flex items-center justify-center gap-2 rounded-2xl border border-[rgba(47,139,255,0.25)] bg-[rgba(47,139,255,0.06)] py-3 px-4">
                {authStep === 2 ? (
                  <CheckCircle2 className="h-4 w-4 text-[#2ee88c]" />
                ) : (
                  <LoaderCircle className="h-4 w-4 animate-spin text-[#2F8BFF]" />
                )}
                <span className="text-xs font-bold text-white/80">
                  {authStep === 2 ? 'توجيه مباشر إلى رادار الطائرة...' : 'مزامنة السيرفر ومطابقة المفتاح'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
