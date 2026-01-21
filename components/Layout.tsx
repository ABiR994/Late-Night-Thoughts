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
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="stars" />
        <div className="noise" />
        <div className="grid-overlay" />
      </div>

      {/* Theme Toggle - Small, Fixed */}
      {mounted && (
        <button
          onClick={toggleTheme}
          className="
            fixed top-5 right-5 z-50
            w-8 h-8 rounded-full
            flex items-center justify-center
            bg-[var(--glass-bg)] backdrop-blur-md
            border border-[var(--border-subtle)]
            text-[var(--text-muted)]
            hover:text-[var(--text-primary)] hover:border-[var(--border-default)]
            transition-all duration-200
            focus:outline-none focus-visible:ring-1 focus-visible:ring-aurora-violet
          "
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <svg
            className={`w-3.5 h-3.5 transition-all duration-300 ${theme === 'dark' ? 'opacity-0 scale-0 absolute' : 'opacity-100 scale-100'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="5" />
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
          <svg
            className={`w-3.5 h-3.5 transition-all duration-300 ${theme === 'light' ? 'opacity-0 scale-0 absolute' : 'opacity-100 scale-100'}`}
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
