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

const moodConfig: Record<string, { class: string; color: string }> = {
  Happy: { class: 'mood-happy', color: '#fbbf24' },
  Sad: { class: 'mood-sad', color: '#60a5fa' },
  Contemplative: { class: 'mood-contemplative', color: '#a78bfa' },
  Anxious: { class: 'mood-anxious', color: '#f472b6' },
  Hopeful: { class: 'mood-hopeful', color: '#34d399' },
  Angry: { class: 'mood-angry', color: '#f87171' },
  Calm: { class: 'mood-calm', color: '#38bdf8' },
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought, index = 0, onClick }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isLong = thought.content.length > 320 || thought.content.split('\n').length > 5;
  const moodStyle = thought.mood ? moodConfig[thought.mood] : null;

  // Load favorite state
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favorites.includes(thought.id));
  }, [thought.id]);

  // Staggered animation
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), index * 100);
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

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative cursor-pointer
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
      `}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Outer glow on hover */}
      <div 
        className={`
          absolute -inset-px rounded-3xl transition-opacity duration-500
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: moodStyle 
            ? `linear-gradient(135deg, ${moodStyle.color}20, transparent 50%)`
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), transparent 50%)',
        }}
      />

      {/* Card */}
      <div 
        className={`
          relative overflow-hidden
          bg-[var(--glass-bg)] backdrop-blur-xl
          border border-[var(--border-subtle)]
          rounded-2xl
          transition-all duration-500 ease-out
          ${isHovered 
            ? 'border-[var(--border-default)] shadow-float transform -translate-y-1' 
            : 'shadow-card'
          }
        `}
      >
        {/* Mood accent - top gradient line */}
        {moodStyle && (
          <div 
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${moodStyle.color}60, transparent)`,
            }}
          />
        )}

        {/* Content area */}
        <div className="p-7 sm:p-8">
          {/* Thought text */}
          <p className={`
            font-display text-[1.125rem] sm:text-[1.25rem] leading-[1.7] tracking-[-0.01em]
            text-[var(--text-primary)]
            whitespace-pre-wrap
            transition-all duration-300
            ${!isExpanded && isLong ? 'line-clamp-5' : ''}
          `}>
            {thought.content}
          </p>

          {/* Expand button */}
          {isLong && (
            <button
              onClick={handleExpand}
              className="
                mt-4 inline-flex items-center gap-1.5
                text-sm font-body font-medium
                text-aurora-violet/80 hover:text-aurora-violet
                transition-colors duration-200
              "
            >
              <span>{isExpanded ? 'Show less' : 'Continue reading'}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 sm:px-8 pb-6 pt-2">
          <div className="flex items-center justify-between">
            {/* Left side - timestamp and mood */}
            <div className="flex items-center gap-4">
              <time 
                className="text-[13px] font-mono text-[var(--text-muted)] tracking-wide"
                dateTime={thought.created_at}
              >
                {formatTime(thought.created_at)}
              </time>

              {moodStyle && (
                <span 
                  className={`
                    inline-flex items-center gap-1.5
                    px-3 py-1 rounded-full
                    text-[11px] font-body font-medium uppercase tracking-wider
                    transition-all duration-200
                    ${moodStyle.class}
                  `}
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: moodStyle.color }}
                  />
                  {thought.mood}
                </span>
              )}
            </div>

            {/* Right side - actions */}
            <div 
              className={`
                flex items-center gap-1
                transition-all duration-300
                ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
              `}
            >
              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                className={`
                  p-2.5 rounded-xl
                  transition-all duration-200
                  ${isFavorited 
                    ? 'text-pink-400 bg-pink-500/10' 
                    : 'text-[var(--text-muted)] hover:text-pink-400 hover:bg-pink-500/10'
                  }
                `}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className="w-[18px] h-[18px]"
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
              <div className="p-2.5 text-[var(--text-muted)]">
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThoughtCard;
