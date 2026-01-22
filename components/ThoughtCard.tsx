import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useCursor } from '../context/CursorContext';

interface Thought {
  id: string;
  created_at: string;
  content: string;
  is_public: boolean;
  mood: string | null;
}

interface ThoughtCardProps {
  thought: Thought;
  index?: number;
  onClick?: () => void;
}

const moodColors: Record<string, string> = {
  Happy: '#fbbf24',
  Sad: '#60a5fa',
  Contemplative: '#a78bfa',
  Anxious: '#f472b6',
  Hopeful: '#34d399',
  Angry: '#f87171',
  Calm: '#38bdf8',
};

// Custom SVG Logos
const ResonateIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 transition-all duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 21L10.55 19.705C5.4 15.03 2 11.95 2 8.165C2 5.085 4.42 2.665 7.5 2.665C9.24 2.665 10.91 3.475 12 4.755C13.09 3.475 14.76 2.665 16.5 2.665C19.58 2.665 22 5.085 22 8.165C22 11.95 18.6 15.03 13.45 19.71L12 21Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
      fill={filled ? "currentColor" : "none"}
      className={filled ? "animate-pulse" : ""}
    />
    <path 
      d="M12 13L13.5 11.5M12 13L10.5 11.5M12 13V16" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      opacity={filled ? 1 : 0.4}
    />
    {filled && (
      <circle cx="12" cy="8" r="1" fill="white" className="animate-ping" />
    )}
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M20 4L3 11L10 14M20 4L13 21L10 14M20 4L10 14" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <circle cx="20" cy="4" r="1.5" stroke="currentColor" strokeWidth="1" />
    <path d="M6 18H8M12 18H14M18 18H20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
  </svg>
);

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ThoughtCard = forwardRef<HTMLElement, ThoughtCardProps>(({ thought, index = 0, onClick }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [resonated, setResonated] = useState(false);
  const { handwritten, triggerRipple } = useCursor();
  const internalRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => internalRef.current!);

  const moodColor = thought.mood ? moodColors[thought.mood] : null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), (index % 5) * 100);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (internalRef.current) {
      observer.observe(internalRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: 'Late Night Thought',
        text: thought.content,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(thought.content);
      alert('Thought copied to clipboard');
    }
  };

  const handleResonate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResonated(true);
    triggerRipple();
    setTimeout(() => setResonated(false), 2000);
  };

  return (
    <article
      ref={internalRef}
      onClick={onClick}
      className={`
        group cursor-pointer relative
        py-8 px-6 -mx-4 mb-2
        bg-black/40 backdrop-blur-sm
        glass-edge
        transition-all duration-500 ease-[var(--ease-out-expo)]
        hover:bg-black/60
        rounded-2xl overflow-hidden
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ '--mood-glow-color': moodColor } as React.CSSProperties}
    >
      {/* Mood Glow */}
      <div className="card-glow" />

      {/* Constellation Nodes (Visible in personal mode) */}
      <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-aurora-violet/20 group-hover:bg-aurora-violet/60 transition-colors" />
      <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-aurora-violet/20 group-hover:bg-aurora-violet/60 transition-colors" />

      {/* Content */}
      <p className={`
        text-[19px] sm:text-[22px] leading-[1.6] group-hover:leading-[1.7]
        text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]
        ${handwritten ? 'font-handwritten text-[24px] sm:text-[28px] !italic-none' : 'font-display italic'}
        whitespace-pre-wrap
        mb-6
        transition-all duration-700
        ink-flow-text ${isVisible ? 'ink-flow-active' : 'opacity-0'}
      `}>
        {thought.content}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--text-faint)] group-hover:text-[var(--text-muted)] transition-colors">
          <time dateTime={thought.created_at} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-current opacity-40" />
            {formatTime(thought.created_at)}
          </time>
          
          {moodColor && (
            <div className="flex items-center gap-2">
              <span className="opacity-30">/</span>
              <span style={{ color: moodColor }} className="opacity-80 group-hover:opacity-100">{thought.mood}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500 ease-[var(--ease-out-expo)]">
          <button
            onClick={handleResonate}
            className={`
              p-2 rounded-full
              transition-all duration-500
              ${resonated ? 'text-aurora-violet scale-125 bg-aurora-violet/10' : 'text-[var(--text-faint)] hover:text-aurora-violet hover:bg-white/5'}
            `}
            title="Resonate"
          >
            <ResonateIcon filled={resonated} />
          </button>
          <button
            onClick={handleShare}
            className="
              p-2 rounded-full
              text-[var(--text-faint)] hover:text-[var(--text-primary)]
              hover:bg-white/5
              transition-all duration-300
            "
            title="Share thought"
          >
            <ShareIcon />
          </button>
        </div>
      </div>
    </article>
  );
});

ThoughtCard.displayName = 'ThoughtCard';

export default ThoughtCard;
