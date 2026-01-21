import React, { useEffect, useState } from 'react';

interface Thought {
  id: string;
  created_at: string;
  content: string;
  is_public: boolean;
  mood: string | null;
}

interface ReadingModeProps {
  thought: Thought;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
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

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  const hour = date.getHours();
  
  let timeOfDay = 'morning';
  if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else if (hour >= 21 || hour < 5) timeOfDay = 'late night';
  
  return `${date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })} / ${timeOfDay}`;
};

const ReadingMode: React.FC<ReadingModeProps> = ({ thought, onClose, onNext, onPrev }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const moodColor = thought.mood ? moodColors[thought.mood] : null;

  // Animate in
  useEffect(() => {
    const timeout1 = setTimeout(() => setIsVisible(true), 50);
    const timeout2 = setTimeout(() => setContentVisible(true), 200);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  // Reset animation on thought change
  useEffect(() => {
    setContentVisible(false);
    const timeout = setTimeout(() => setContentVisible(true), 100);
    return () => clearTimeout(timeout);
  }, [thought.id]);

  // Load favorite state
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favorites.includes(thought.id));
  }, [thought.id]);

  // Toggle favorite
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = isFavorited
      ? favorites.filter((id: string) => id !== thought.id)
      : [...favorites, thought.id];
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  };

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`
          absolute inset-0 bg-[var(--bg-base)]
          transition-opacity duration-500
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Subtle mood gradient at top */}
      {moodColor && (
        <div 
          className={`
            absolute top-0 left-0 right-0 h-[40vh] pointer-events-none
            transition-opacity duration-700
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: `linear-gradient(180deg, ${moodColor}08 0%, transparent 100%)`,
          }}
        />
      )}

      {/* Top bar */}
      <div className={`
        absolute top-0 left-0 right-0 z-20
        flex items-center justify-between
        px-6 sm:px-8 py-6
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}>
        {/* Left: Close */}
        <button
          onClick={onClose}
          className="
            flex items-center gap-2
            text-sm font-mono text-[var(--text-muted)]
            hover:text-[var(--text-primary)]
            transition-colors duration-200
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="hidden sm:inline">back</span>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Favorite */}
          <button
            onClick={toggleFavorite}
            className={`
              flex items-center gap-2
              text-sm font-mono
              transition-colors duration-200
              ${isFavorited 
                ? 'text-pink-400' 
                : 'text-[var(--text-muted)] hover:text-pink-400'
              }
            `}
          >
            <svg
              className="w-4 h-4"
              fill={isFavorited ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isFavorited ? 0 : 1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span className="hidden sm:inline">{isFavorited ? 'saved' : 'save'}</span>
          </button>
        </div>
      </div>

      {/* Navigation arrows - sides */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="
            absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20
            w-12 h-12 rounded-full
            flex items-center justify-center
            text-[var(--text-muted)]
            hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]
            transition-all duration-300
            focus:outline-none
          "
          aria-label="Previous thought"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {onNext && (
        <button
          onClick={onNext}
          className="
            absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20
            w-12 h-12 rounded-full
            flex items-center justify-center
            text-[var(--text-muted)]
            hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]
            transition-all duration-300
            focus:outline-none
          "
          aria-label="Next thought"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Main content - centered */}
      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12 md:p-20 overflow-auto">
        <div 
          className={`
            relative w-full max-w-2xl mx-auto
            transition-all duration-700 ease-out
            ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {/* Mood indicator */}
          {thought.mood && moodColor && (
            <div className="flex items-center gap-3 mb-8">
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: moodColor }}
              />
              <span 
                className="text-xs font-mono uppercase tracking-[0.2em]"
                style={{ color: moodColor }}
              >
                {thought.mood}
              </span>
            </div>
          )}

          {/* The thought - large, centered, poetic */}
          <blockquote>
            <p className="
              text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem]
              font-display leading-[1.5] tracking-[-0.02em]
              text-[var(--text-primary)]
              whitespace-pre-wrap
            ">
              {thought.content}
            </p>
          </blockquote>

          {/* Timestamp */}
          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
            <time 
              className="text-sm font-mono text-[var(--text-muted)] tracking-wide"
              dateTime={thought.created_at}
            >
              {formatFullDate(thought.created_at)}
            </time>
          </div>
        </div>
      </div>

      {/* Bottom keyboard hints */}
      <div 
        className={`
          absolute bottom-6 left-1/2 -translate-x-1/2
          flex items-center gap-6
          text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]
          transition-all duration-500 delay-300
          ${isVisible ? 'opacity-60' : 'opacity-0'}
        `}
      >
        <span className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded border border-[var(--border-subtle)] text-[9px]">
            esc
          </kbd>
          <span>close</span>
        </span>
        {(onPrev || onNext) && (
          <span className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded border border-[var(--border-subtle)] text-[9px]">
              ←
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-[var(--border-subtle)] text-[9px]">
              →
            </kbd>
            <span>navigate</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default ReadingMode;
