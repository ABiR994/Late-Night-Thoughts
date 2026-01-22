import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient Background */}
      <div className="ambient-container" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="stars" />
        <div className="stars-2" />
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
