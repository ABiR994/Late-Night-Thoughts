import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      {/* Global layout for the application */}
      {children}
    </div>
  );
};

export default Layout;
