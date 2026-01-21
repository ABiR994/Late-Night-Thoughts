import React from 'react';

interface MoodFilterProps {
  onSelectMood: (mood: string) => void;
  currentMood: string;
}

const moods = [
  { value: 'All', label: 'All', color: null },
  { value: 'Happy', label: 'Happy', color: '#fbbf24' },
  { value: 'Sad', label: 'Sad', color: '#60a5fa' },
  { value: 'Contemplative', label: 'Contemplative', color: '#a78bfa' },
  { value: 'Anxious', label: 'Anxious', color: '#f472b6' },
  { value: 'Hopeful', label: 'Hopeful', color: '#34d399' },
  { value: 'Angry', label: 'Angry', color: '#f87171' },
  { value: 'Calm', label: 'Calm', color: '#38bdf8' },
];

const MoodFilter: React.FC<MoodFilterProps> = ({ onSelectMood, currentMood }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Label */}
      <span className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--text-muted)] mr-2">
        Filter
      </span>
      
      {/* Mood pills */}
      {moods.map((mood) => {
        const isActive = currentMood === mood.value;
        
        return (
          <button
            key={mood.value}
            onClick={() => onSelectMood(mood.value)}
            className={`
              relative
              px-3.5 py-1.5 rounded-full
              text-xs font-body font-medium
              transition-all duration-300 ease-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-violet focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]
              ${isActive 
                ? 'text-[var(--bg-base)]' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-transparent border border-[var(--border-subtle)] hover:border-[var(--border-default)]'
              }
            `}
            style={{
              backgroundColor: isActive 
                ? (mood.color || 'var(--text-primary)') 
                : undefined,
              borderColor: isActive ? 'transparent' : undefined,
            }}
          >
            {/* Dot indicator for moods with color */}
            {mood.color && !isActive && (
              <span 
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                style={{ backgroundColor: mood.color }}
              />
            )}
            {mood.label}
          </button>
        );
      })}
    </div>
  );
};

export default MoodFilter;
