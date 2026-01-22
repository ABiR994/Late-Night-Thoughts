import React, { useEffect, useState, useRef } from 'react';
import { useCursor } from '../context/CursorContext';

const moodColors: Record<string, string> = {
  Happy: '#fbbf24',
  Sad: '#60a5fa',
  Contemplative: '#a78bfa',
  Anxious: '#f472b6',
  Hopeful: '#34d399',
  Angry: '#f87171',
  Calm: '#38bdf8',
};

const CustomCursor: React.FC = () => {
  const { mood } = useCursor();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const cursorColor = mood ? moodColors[mood] : 'var(--aurora-violet)';

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add to trail
      const id = Math.random();
      setTrail(prev => [...prev.slice(-10), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setTrail(prev => prev.filter(t => t.id !== id));
      }, 500);
    };

    const updateHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('button, a, article, input, textarea, select'));
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHover);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHover);
    };
  }, []);

  return (
    <>
      {/* Main Cursor Glow */}
      <div 
        className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
        style={{ cursor: 'none' }}
      >
        <div 
          className="absolute w-6 h-6 rounded-full transition-transform duration-200 ease-out"
          style={{ 
            left: position.x, 
            top: position.y,
            transform: `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`,
            background: `radial-gradient(circle, ${cursorColor} 0%, transparent 70%)`,
            opacity: 0.6,
            filter: 'blur(4px)'
          }}
        />
        <div 
          className="absolute w-1.5 h-1.5 bg-white rounded-full transition-transform duration-100 ease-out"
          style={{ 
            left: position.x, 
            top: position.y,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 10px ${cursorColor}`
          }}
        />

        {/* Stardust Trail */}
        {trail.map(t => (
          <div 
            key={t.id}
            className="absolute w-1 h-1 rounded-full animate-fade-out"
            style={{ 
              left: t.x, 
              top: t.y,
              transform: 'translate(-50%, -50%)',
              background: cursorColor,
              opacity: 0.3,
              boxShadow: `0 0 5px ${cursorColor}`
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        body * {
          cursor: none !important;
        }
        @keyframes fade-out {
          0% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
        }
        .animate-fade-out {
          animation: fade-out 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
