import React, { createContext, useContext, useState } from 'react';

interface CursorContextType {
  triggerRipple: () => void;
  triggerShootingStar: () => void;
  ripples: number[];
  shootingStars: number[];
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ripples, setRipples] = useState<number[]>([]);
  const [shootingStars, setShootingStars] = useState<number[]>([]);

  const triggerRipple = () => {
    const id = Date.now();
    setRipples(prev => [...prev, id]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r !== id));
    }, 2000);
  };

  const triggerShootingStar = () => {
    const id = Date.now();
    setShootingStars(prev => [...prev, id]);
    setTimeout(() => {
      setShootingStars(prev => prev.filter(s => s !== id));
    }, 1500);
  };

  return (
    <CursorContext.Provider value={{ triggerRipple, triggerShootingStar, ripples, shootingStars }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};
