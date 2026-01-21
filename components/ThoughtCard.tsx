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

const moodColors: Record<string, string> = {
  Happy: '#fbbf24',
  Sad: '#60a5fa',
  Contemplative: '#a78bfa',
  Anxious: '#f472b6',
  Hopeful: '#34d399',
  Angry: '#f87171',
  Calm: '#38bdf8',
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
  if (days < 7) return `${days}d`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought, index = 0, onClick }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const moodColor = thought.mood ? moodColors[thought.mood] : null;

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favorites.includes(thought.id));
  }, [thought.id]);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), index * 50);
    return () => clearTimeout(t);
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
      className={`
        group cursor-pointer
        py-6 border-b border-[var(--border-subtle)]
        transition-all duration-300
        hover:bg-[var(--glass-bg)]
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* Content */}
      <p className="
        text-[17px] sm:text-[19px] leading-[1.65]
        text-[var(--text-primary)]
        font-body
        tracking-tight
        whitespace-pre-wrap
        mb-6
      ">
        {thought.content}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-[12px] font-mono tracking-wider text-[var(--text-muted)]">
          <time dateTime={thought.created_at}>
            {formatTime(thought.created_at)}
          </time>
          
          {moodColor && (
            <>
              <span className="opacity-20 text-[10px]">/</span>
              <span style={{ color: moodColor }} className="uppercase">{thought.mood?.toLowerCase()}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={toggleFavorite}
            className={`
              p-1 rounded
              transition-colors
              ${isFavorited ? 'text-pink-400' : 'text-[var(--text-muted)] hover:text-pink-400'}
            `}
          >
            <svg className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          <span className="text-[var(--text-muted)] text-xs">read</span>
        </div>
      </div>
    </article>
  );
};

export default ThoughtCard;
