import React, { createContext, useContext, useState } from 'react';

type Mood = string | null;

interface CursorContextType {
  mood: Mood;
  setMood: (mood: Mood) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMood] = useState<Mood>(null);

  return (
    <CursorContext.Provider value={{ mood, setMood }}>
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
