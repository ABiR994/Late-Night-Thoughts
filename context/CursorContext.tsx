import React, { createContext, useContext, useState } from 'react';

interface CursorContextType {
  triggerRipple: () => void;
  triggerShootingStar: () => void;
  triggerFallingStar: () => void;
  handwritten: boolean;
  setHandwritten: (val: boolean) => void;
  ripples: number[];
  shootingStars: number[];
  fallingStars: { id: number; top: string; left: string }[];
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ripples, setRipples] = useState<number[]>([]);
  const [shootingStars, setShootingStars] = useState<number[]>([]);
  const [fallingStars, setFallingStars] = useState<{ id: number; top: string; left: string }[]>([]);
  const [handwritten, setHandwritten] = useState(false);

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

  const triggerFallingStar = () => {
    const id = Date.now() + Math.random();
    const top = `${Math.random() * 40}%`;
    const left = `${Math.random() * 80}%`;
    setFallingStars(prev => [...prev, { id, top, left }]);
    setTimeout(() => {
      setFallingStars(prev => prev.filter(s => s.id !== id));
    }, 3000);
  };

  return (
    <CursorContext.Provider value={{ triggerRipple, triggerShootingStar, triggerFallingStar, handwritten, setHandwritten, ripples, shootingStars, fallingStars }}>
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
