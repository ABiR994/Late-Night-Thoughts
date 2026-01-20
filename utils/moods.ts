// utils/moods.ts

export const MOOD_DATA = [
  { value: 'All', label: 'All thoughts', color: null },
  { value: 'Happy', label: 'Happy', color: '#fbbf24' },
  { value: 'Sad', label: 'Sad', color: '#60a5fa' },
  { value: 'Contemplative', label: 'Contemplative', color: '#a78bfa' },
  { value: 'Anxious', label: 'Anxious', color: '#f472b6' },
  { value: 'Grateful', label: 'Grateful', color: '#84cc16' }, // Added color
  { value: 'Hopeful', label: 'Hopeful', color: '#34d399' },
  { value: 'Reflective', label: 'Reflective', color: '#94a3b8' }, // Added color
  { value: 'Calm', label: 'Calm', color: '#38bdf8' },
  { value: 'Excited', label: 'Excited', color: '#f97316' }, // Added color
  { value: 'Peaceful', label: 'Peaceful', color: '#2dd4bf' }, // Added color
  { value: 'None', label: 'No mood', color: null }, // For thoughts without an assigned mood
];

export type Mood = typeof MOOD_DATA[number]['value'];
