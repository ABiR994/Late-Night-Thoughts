import React, { useState, useEffect } from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }

    // Update time
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient Background */}
      <div className="ambient-container" aria-hidden="true">
        {/* Gradient orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        
        {/* Stars effect */}
        <div className="stars" />
        
        {/* Noise texture */}
        <div className="noise" />
        
        {/* Grid overlay */}
        <div className="grid-overlay" />
      </div>

      {/* Floating Control Bar */}
      {mounted && (
        <div className="
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          flex items-center gap-1
          px-2 py-2
          bg-[var(--bg-surface)]/80 backdrop-blur-2xl
          border border-[var(--border-subtle)]
          rounded-full
          shadow-float
        ">
          {/* Time Display */}
          <div className="
            px-4 py-2
            font-mono text-xs tracking-widest
            text-[var(--text-muted)]
            border-r border-[var(--border-subtle)]
          ">
            {time}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
              relative w-10 h-10 rounded-full
              flex items-center justify-center
              text-[var(--text-secondary)]
              hover:text-[var(--text-primary)]
              hover:bg-[var(--glass-bg)]
              transition-all duration-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-violet
              group
            "
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {/* Sun icon */}
            <svg
              className={`
                w-4 h-4 absolute transition-all duration-500
                ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
              `}
              style={{ color: '#fbbf24' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            
            {/* Moon icon */}
            <svg
              className={`
                w-4 h-4 absolute transition-all duration-500
                ${theme === 'light' ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
              `}
              style={{ color: '#a78bfa' }}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          {/* Scroll to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="
              w-10 h-10 rounded-full
              flex items-center justify-center
              text-[var(--text-secondary)]
              hover:text-[var(--text-primary)]
              hover:bg-[var(--glass-bg)]
              transition-all duration-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-violet
            "
            aria-label="Scroll to top"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
