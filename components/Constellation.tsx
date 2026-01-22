import React, { useEffect, useState, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface ConstellationProps {
  targets: HTMLElement[];
}

const Constellation: React.FC<ConstellationProps> = ({ targets }) => {
  const [points, setPoints] = useState<Point[]>([]);
  const containerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const updatePoints = () => {
      if (targets.length < 2) {
        setPoints([]);
        return;
      }

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const newPoints = targets.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top
        };
      });
      setPoints(newPoints);
    };

    updatePoints();
    window.addEventListener('resize', updatePoints);
    window.addEventListener('scroll', updatePoints);
    
    // MutationObserver to watch for card visibility changes
    const observer = new MutationObserver(updatePoints);
    targets.forEach(t => observer.observe(t, { attributes: true, attributeFilter: ['style', 'class'] }));

    return () => {
      window.removeEventListener('resize', updatePoints);
      window.removeEventListener('scroll', updatePoints);
      observer.disconnect();
    };
  }, [targets]);

  if (points.length < 2) return null;

  return (
    <svg 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ minHeight: '100%' }}
    >
      <defs>
        <linearGradient id="constellation-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--aurora-violet)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--aurora-blue)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d={`M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`}
        fill="none"
        stroke="url(#constellation-grad)"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="animate-pulse"
      />
      {points.map((p, i) => (
        <circle 
          key={i} 
          cx={p.x} 
          cy={p.y} 
          r="2" 
          fill="var(--aurora-violet)" 
          className="opacity-20"
        />
      ))}
    </svg>
  );
};

export default Constellation;
