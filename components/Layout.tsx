import React from 'react';
import ThemeToggle from './ThemeToggle'; // Import ThemeToggle

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen relative"> {/* Added relative for positioning */}
      <div className="absolute top-4 right-4 z-10"> {/* Position ThemeToggle */}
        <ThemeToggle />
      </div>
      {/* Global layout for the application */}
      {children}
    </div>
  );
};

export default Layout;
