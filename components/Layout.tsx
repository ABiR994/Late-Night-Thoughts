import React, { useState, useEffect } from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
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

      {/* Theme Toggle */}
      {mounted && (
        <button
          onClick={toggleTheme}
          className="
            fixed top-6 right-6 z-50
            w-12 h-12 rounded-full
            glass flex items-center justify-center
            transition-all duration-300 ease-out-expo
            hover:scale-110 hover:shadow-glow
            focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-violet
            group
          "
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {/* Sun icon */}
          <svg
            className={`
              w-5 h-5 absolute transition-all duration-500
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
              w-5 h-5 absolute transition-all duration-500
              ${theme === 'light' ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
            `}
            style={{ color: '#a78bfa' }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
