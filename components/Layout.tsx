import React, { useEffect, useState } from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [timeState, setTimeState] = useState<'dusk' | 'midnight' | 'dawn'>('midnight');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 18 && hour < 22) setTimeState('dusk');
    else if (hour >= 4 && hour < 7) setTimeState('dawn');
    else setTimeState('midnight');
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden theme-${timeState}`}>
      {/* Ambient Background */}
      <div className="ambient-container" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="stars" />
        <div className="stars-2" />
        <div className="stars-3" />
        <div className="noise" />
        <div className="grid-overlay" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
