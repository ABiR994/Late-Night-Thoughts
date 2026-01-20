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
  })} · ${timeOfDay}`;
};

const ReadingMode: React.FC<ReadingModeProps> = ({ thought, onClose, onNext, onPrev }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const moodColor = thought.mood ? moodColors[thought.mood] : null;

  // Animate in
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`
          absolute inset-0 bg-[var(--bg-base)]/98 backdrop-blur-2xl
          transition-opacity duration-500
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Mood ambient glow */}
      {moodColor && (
        <div 
          className={`
            absolute inset-0 pointer-events-none
            transition-opacity duration-700
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 30%, ${moodColor}12, transparent 60%)`,
          }}
        />
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="
          absolute top-8 right-8 z-20
          w-14 h-14 rounded-2xl
          bg-[var(--glass-bg)] backdrop-blur-xl
          border border-[var(--border-subtle)]
          flex items-center justify-center
          text-[var(--text-secondary)] hover:text-[var(--text-primary)]
          hover:border-[var(--border-default)] hover:bg-[var(--glass-highlight)]
          transition-all duration-300
          focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-violet
        "
        aria-label="Close"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation - Previous */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="
            absolute left-8 top-1/2 -translate-y-1/2 z-20
            w-14 h-14 rounded-2xl
            bg-[var(--glass-bg)] backdrop-blur-xl
            border border-[var(--border-subtle)]
            flex items-center justify-center
            text-[var(--text-secondary)] hover:text-[var(--text-primary)]
            hover:border-[var(--border-default)] hover:bg-[var(--glass-highlight)]
            transition-all duration-300 hover:-translate-x-1
            focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-violet
          "
          aria-label="Previous thought"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Navigation - Next */}
      {onNext && (
        <button
          onClick={onNext}
          className="
            absolute right-8 top-1/2 -translate-y-1/2 z-20
            w-14 h-14 rounded-2xl
            bg-[var(--glass-bg)] backdrop-blur-xl
            border border-[var(--border-subtle)]
            flex items-center justify-center
            text-[var(--text-secondary)] hover:text-[var(--text-primary)]
            hover:border-[var(--border-default)] hover:bg-[var(--glass-highlight)]
            transition-all duration-300 hover:translate-x-1
            focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-violet
          "
          aria-label="Next thought"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Main content */}
      <div 
        className={`
          relative z-10 w-full max-w-3xl mx-auto px-8 sm:px-12
          transition-all duration-700 ease-out
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
        `}
      >
        {/* Mood indicator */}
        {thought.mood && moodColor && (
          <div className="flex items-center gap-3 mb-10">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: moodColor }}
            />
            <span 
              className="text-sm font-body font-medium uppercase tracking-[0.2em]"
              style={{ color: moodColor }}
            >
              {thought.mood}
            </span>
          </div>
        )}

        {/* Thought content */}
        <blockquote className="mb-12">
          <p className="
            text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem]
            font-display leading-[1.5] tracking-[-0.02em]
            text-[var(--text-primary)]
            whitespace-pre-wrap
          ">
            {thought.content}
          </p>
        </blockquote>

        {/* Footer */}
        <footer className="flex items-center justify-between pt-8 border-t border-[var(--border-subtle)]">
          <time 
            className="text-sm text-[var(--text-muted)] font-mono tracking-wide"
            dateTime={thought.created_at}
          >
            {formatFullDate(thought.created_at)}
          </time>

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl
              text-sm font-body
              transition-all duration-200
              ${isFavorited 
                ? 'text-pink-400 bg-pink-500/10' 
                : 'text-[var(--text-muted)] hover:text-pink-400 hover:bg-pink-500/10'
              }
            `}
          >
            <svg
              className="w-5 h-5"
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
            <span>{isFavorited ? 'Saved' : 'Save'}</span>
          </button>
        </footer>
      </div>

      {/* Keyboard hints */}
      <div 
        className={`
          absolute bottom-8 left-1/2 -translate-x-1/2
          flex items-center gap-6
          text-xs text-[var(--text-muted)] font-mono
          transition-all duration-500 delay-300
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--border-subtle)] text-[10px] font-medium">
            ESC
          </kbd>
          <span>close</span>
        </span>
        {(onPrev || onNext) && (
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--border-subtle)] text-[10px] font-medium">
              ←
            </kbd>
            <kbd className="px-2 py-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--border-subtle)] text-[10px] font-medium">
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
