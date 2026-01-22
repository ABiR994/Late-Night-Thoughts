import React, { useEffect, useState, useRef } from 'react';

type LayoutProps = {
  children: React.ReactNode;
  blurBackground?: boolean;
};

const Layout = ({ children, blurBackground = false }: LayoutProps) => {
  const [timeState, setTimeState] = useState<'dusk' | 'midnight' | 'dawn'>('midnight');
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 18 && hour < 22) setTimeState('dusk');
    else if (hour >= 4 && hour < 7) setTimeState('dawn');
    else setTimeState('midnight');
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden theme-${timeState}`}>
      {/* Ambient Background */}
      <div 
        className={`ambient-container transition-all duration-1000 ${blurBackground ? 'blur-xl scale-110 opacity-50' : 'blur-0 scale-100 opacity-100'}`} 
        aria-hidden="true"
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="stars" />
        <div className="stars-2" />
        <div className="stars-3" />
        <div className="noise" />
        <div className="grid-overlay" />
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2022/03/24/audio_907316664d.mp3"
        loop
      />

      {/* Audio Toggle */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all group"
        aria-label={isMuted ? "Unmute ambient sound" : "Mute ambient sound"}
      >
        {isMuted ? (
          <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-aurora-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464l-7.072 7.072" />
          </svg>
        )}
      </button>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
