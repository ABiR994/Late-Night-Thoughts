import React from 'react';

interface MoodFilterProps {
  onSelectMood: (mood: string) => void;
  currentMood: string;
}

const moods = [
  { value: 'All', label: 'all', color: null },
  { value: 'Happy', label: 'happy', color: '#fbbf24' },
  { value: 'Sad', label: 'sad', color: '#60a5fa' },
  { value: 'Contemplative', label: 'contemplative', color: '#a78bfa' },
  { value: 'Hopeful', label: 'hopeful', color: '#34d399' },
  { value: 'Calm', label: 'calm', color: '#38bdf8' },
];

const MoodFilter: React.FC<MoodFilterProps> = ({ onSelectMood, currentMood }) => {
  const selected = moods.find(m => m.value === currentMood) || moods[0];
  
  return (
    <div className="relative group/filter">
      <select
        value={currentMood}
        onChange={(e) => onSelectMood(e.target.value)}
        className="
          appearance-none
          text-[11px] font-mono uppercase tracking-[0.2em]
          bg-transparent
          text-[var(--text-muted)]
          hover:text-[var(--text-primary)]
          focus:outline-none cursor-pointer
          transition-colors
          pr-4
        "
        style={{ color: selected?.color || undefined }}
      >
        {moods.map((m) => (
          <option 
            key={m.value} 
            value={m.value}
            className="bg-[var(--midnight-900)] text-[var(--text-primary)]"
          >
            {m.label}
          </option>
        ))}
      </select>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover/filter:opacity-80 transition-opacity">
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
};

export default MoodFilter;
