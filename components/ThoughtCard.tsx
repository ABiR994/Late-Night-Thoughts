import React, { useState, useEffect } from 'react';

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

const moodConfig: Record<string, { color: string }> = {
  Happy: { color: '#fbbf24' },
  Sad: { color: '#60a5fa' },
  Contemplative: { color: '#a78bfa' },
  Anxious: { color: '#f472b6' },
  Hopeful: { color: '#34d399' },
  Angry: { color: '#f87171' },
  Calm: { color: '#38bdf8' },
};

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
  if (days === 1) return '1d';
  if (days < 7) return `${days}d`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought, index = 0, onClick }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const moodStyle = thought.mood ? moodConfig[thought.mood] : null;
  const isLong = thought.content.length > 280;

  // Load favorite state
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favorites.includes(thought.id));
  }, [thought.id]);

  // Staggered animation
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), index * 80);
    return () => clearTimeout(timeout);
  }, [index]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = isFavorited
      ? favorites.filter((id: string) => id !== thought.id)
      : [...favorites, thought.id];
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  };

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative cursor-pointer
        pl-6 py-6
        border-b border-[var(--border-subtle)]
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        hover:bg-[var(--glass-bg)]
      `}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      {/* Timeline dot */}
      <div 
        className={`
          absolute left-0 top-8 -translate-x-1/2
          w-2 h-2 rounded-full
          transition-all duration-300
          ${isHovered ? 'scale-150' : 'scale-100'}
        `}
        style={{ 
          backgroundColor: moodStyle?.color || 'var(--text-muted)',
          boxShadow: isHovered && moodStyle ? `0 0 12px ${moodStyle.color}` : 'none'
        }}
      />

      {/* Content */}
      <div className="pr-4">
        {/* Metadata row */}
        <div className="flex items-center gap-3 mb-3">
          <time 
            className="text-xs font-mono text-[var(--text-muted)] tracking-wide"
            dateTime={thought.created_at}
          >
            {formatTime(thought.created_at)}
          </time>
          
          {moodStyle && (
            <>
              <span className="text-[var(--text-muted)] opacity-30">/</span>
              <span 
                className="text-xs font-mono tracking-wide"
                style={{ color: moodStyle.color }}
              >
                {thought.mood?.toLowerCase()}
              </span>
            </>
          )}
        </div>

        {/* Thought text */}
        <p className={`
          font-display text-lg sm:text-xl leading-[1.6] tracking-[-0.01em]
          text-[var(--text-primary)]
          whitespace-pre-wrap
          ${isLong ? 'line-clamp-4' : ''}
        `}>
          {thought.content}
        </p>

        {/* Read more indicator for long thoughts */}
        {isLong && (
          <span className="
            inline-block mt-3
            text-xs font-mono text-[var(--text-muted)]
            group-hover:text-aurora-violet
            transition-colors duration-200
          ">
            continue reading...
          </span>
        )}
      </div>

      {/* Actions - appear on hover */}
      <div 
        className={`
          absolute right-4 top-6
          flex items-center gap-1
          transition-all duration-300
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
        `}
      >
        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className={`
            p-2 rounded-full
            transition-all duration-200
            ${isFavorited 
              ? 'text-pink-400' 
              : 'text-[var(--text-muted)] hover:text-pink-400'
            }
          `}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
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
        </button>

        {/* Expand indicator */}
        <div className="p-2 text-[var(--text-muted)]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </article>
  );
};

export default ThoughtCard;
