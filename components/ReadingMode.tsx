import React, { useEffect, useState } from 'react';
import { useCursor } from '../context/CursorContext';

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const ReadingMode: React.FC<ReadingModeProps> = ({ thought, onClose, onNext, onPrev }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { handwritten } = useCursor();
  const moodColor = thought.mood ? moodColors[thought.mood] : null;

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favorites.includes(thought.id));
  }, [thought.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = isFavorited
      ? favorites.filter((id: string) => id !== thought.id)
      : [...favorites, thought.id];
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[var(--bg-base)]/60 backdrop-blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Content */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`
          relative z-10 w-full max-w-2xl mx-6 sm:mx-auto
          bg-[var(--bg-surface)]/80 backdrop-blur-xl
          p-10 sm:p-16 rounded-3xl
          border border-white/10 glass-edge
          transition-all duration-500 ease-[var(--ease-out-expo)]
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-y-4'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onClose}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            close
          </button>
          
          <div className="flex items-center gap-4">
            {onPrev && (
              <button onClick={onPrev} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                prev
              </button>
            )}
            {onNext && (
              <button onClick={onNext} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                next
              </button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="mb-8">
          {/* Mood */}
          {moodColor && (
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: moodColor }} />
              <span className="text-xs" style={{ color: moodColor }}>{thought.mood?.toLowerCase()}</span>
            </div>
          )}

          {/* Thought */}
          <p className={`
            text-2xl sm:text-3xl md:text-4xl
            leading-relaxed
            text-[var(--text-primary)]
            ${handwritten ? 'font-handwritten text-4xl sm:text-5xl !italic-none' : 'font-display italic'}
            whitespace-pre-wrap
          `}>
            {thought.content}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--border-subtle)]">
          <time className="text-xs text-[var(--text-muted)]">
            {formatDate(thought.created_at)}
          </time>
          
          <button
            onClick={toggleFavorite}
            className={`
              text-xs transition-colors
              ${isFavorited ? 'text-pink-400' : 'text-[var(--text-muted)] hover:text-pink-400'}
            `}
          >
            {isFavorited ? 'saved' : 'save'}
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="mt-12 text-center">
          <span className="text-[10px] text-[var(--text-muted)] opacity-50">
            esc to close{(onPrev || onNext) && ' / arrows to navigate'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReadingMode;
