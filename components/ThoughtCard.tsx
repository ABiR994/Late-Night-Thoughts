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
        group cursor-pointer relative
        py-8 px-6 -mx-4 mb-4
        bg-black/20 backdrop-blur-md
        border border-white/[0.03]
        transition-all duration-500 ease-[var(--ease-out-expo)]
        hover:bg-black/40 hover:border-white/[0.08] hover:shadow-2xl
        rounded-2xl
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Content */}
      <p className="
        text-[17px] sm:text-[19px] leading-[1.6]
        text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]
        font-body
        whitespace-pre-wrap
        mb-6
        transition-colors duration-300
      ">
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
        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500 ease-[var(--ease-out-expo)]">
          <button
            onClick={toggleFavorite}
            className={`
              p-2 rounded-full
              transition-all duration-300
              hover:bg-pink-500/10
              ${isFavorited ? 'text-pink-400' : 'text-[var(--text-faint)] hover:text-pink-400'}
            `}
          >
            <svg className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)]">read</span>
        </div>
      </div>
    </article>
  );
};

export default ThoughtCard;
