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
    <select
      value={currentMood}
      onChange={(e) => onSelectMood(e.target.value)}
      className="
        text-xs bg-transparent
        text-[var(--text-muted)]
        hover:text-[var(--text-secondary)]
        focus:outline-none cursor-pointer
        transition-colors
      "
      style={{ color: selected?.color || undefined }}
    >
      {moods.map((m) => (
        <option 
          key={m.value} 
          value={m.value}
          className="bg-[var(--bg-surface)] text-[var(--text-primary)]"
        >
          {m.label}
        </option>
      ))}
    </select>
  );
};

export default MoodFilter;
