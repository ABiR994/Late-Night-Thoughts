import React from 'react';

interface MoodFilterProps {
  onSelectMood: (mood: string) => void;
  currentMood: string;
}

const moods = ['All', 'None', 'Happy', 'Sad', 'Contemplative', 'Anxious', 'Hopeful', 'Angry', 'Calm'];

const MoodFilter: React.FC<MoodFilterProps> = ({ onSelectMood, currentMood }) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="moodFilter" className="text-gray-700 font-medium">Filter by Mood:</label>
      <select
        id="moodFilter"
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
