import React, { useState, useEffect, useRef } from 'react';

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
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

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

    if (cardRef.current) {
      observer.observe(cardRef.current);
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

  return (
    <article
      ref={cardRef}
      onClick={onClick}
      className={`
        group cursor-pointer relative
        py-8 px-6 -mx-4 mb-2
        bg-black/40 backdrop-blur-sm
        transition-all duration-500 ease-[var(--ease-out-expo)]
        hover:bg-black/60
        rounded-2xl
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Content */}
      <p className="
        text-[19px] sm:text-[22px] leading-[1.6]
        text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]
        font-display italic
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
            onClick={handleShare}
            className="
              p-2 rounded-full
              text-[var(--text-faint)] hover:text-[var(--text-primary)]
              hover:bg-white/5
              transition-all duration-300
            "
            title="Share thought"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-10.628a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186zm0 12.812a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ThoughtCard;
