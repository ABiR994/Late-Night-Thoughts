import React from 'react';

interface MoodFilterProps {
  onSelectMood: (mood: string) => void;
  currentMood: string;
}

const moods = ['All', 'None', 'Happy', 'Sad', 'Contemplative', 'Anxious', 'Hopeful', 'Angry', 'Calm'];

const MoodFilter: React.FC<MoodFilterProps> = ({ onSelectMood, currentMood }) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="moodFilter" className="text-[var(--color-text-primary)] font-inter font-medium text-base">Filter by Mood:</label>
      <select
        id="moodFilter"
        className="p-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-base font-inter transition-all duration-200 ease-in-out cursor-pointer"
        value={currentMood}
        onChange={(e) => onSelectMood(e.target.value)}
      >
        {moods.map((mood) => (
          <option key={mood} value={mood}>{mood}</option>
        ))}
      </select>
    </div>
  );
};

export default MoodFilter;
