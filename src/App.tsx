import { useState, useEffect } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { CrashGameScreen } from './components/CrashGameScreen';
import { sound } from './sound';

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'login' | 'crash_game'>('splash');
  const [userId, setUserId] = useState<string>('');

  // Set theme properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', '#2F8BFF');
    root.style.setProperty('--primary-color-rgb', '47, 139, 255');
    root.style.setProperty('--primary-glow', 'rgba(47, 139, 255, 0.55)');
  }, []);

  // Resume Web Audio Context on user first click/touch
  useEffect(() => {
    const handleGesture = () => {
      sound.resume();
      document.removeEventListener('click', handleGesture);
      document.removeEventListener('touchstart', handleGesture);
    };
    document.addEventListener('click', handleGesture);
    document.addEventListener('touchstart', handleGesture);
    return () => {
      document.removeEventListener('click', handleGesture);
      document.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  const handleSplashComplete = () => {
    setScreen('login');
  };

  const handleLogin = (id: string) => {
    setUserId(id);
    setScreen('crash_game');
  };

  const handleLogout = () => {
    sound.playClick();
    setScreen('login');
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full overflow-hidden bg-[#040a26] text-white font-arabic"
    >
      {/* Background Interactive Particles */}
      <ParticleBackground />

      {/* Splash Screen */}
      {screen === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} language="ar" />
      )}

      {/* Main View Container */}
      <div
        className={`fixed inset-0 bg-transparent text-white flex flex-col transition-opacity duration-1000 ${
          screen === 'splash' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 scroll-smooth">
          {/* Subtle Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(var(--primary-color) 1px, transparent 1px), linear-gradient(90deg, var(--primary-color) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="min-h-full w-full max-w-lg mx-auto relative z-10">
            {screen === 'login' && (
              <LoginScreen onLogin={handleLogin} />
            )}

            {screen === 'crash_game' && (
              <CrashGameScreen onLogout={handleLogout} userId={userId} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
