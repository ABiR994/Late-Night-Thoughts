import React from 'react';

interface Thought {
  id: string;
  created_at: string;
  content: string;
  is_public: boolean;
  mood: string | null;
}

interface ThoughtCardProps {
  thought: Thought;
}

// Function to get mood-specific styles
const getMoodStyles = (mood: string | null) => {
  switch (mood) {
    case 'Happy':
      return 'bg-[var(--color-mood-happy)] text-[var(--color-text-primary)]'; // Use primary text for contrast
    case 'Sad':
      return 'bg-[var(--color-mood-sad)] text-[var(--color-text-primary)]';
    case 'Contemplative':
      return 'bg-[var(--color-mood-contemplative)] text-[var(--color-text-primary)]';
    case 'Anxious':
      return 'bg-[var(--color-mood-anxious)] text-[var(--color-text-primary)]';
    case 'Hopeful':
      return 'bg-[var(--color-mood-hopeful)] text-[var(--color-text-primary)]';
    case 'Angry':
      return 'bg-[var(--color-mood-angry)] text-[var(--color-text-primary)]';
    case 'Calm':
      return 'bg-[var(--color-mood-calm)] text-[var(--color-text-primary)]';
    default:
      return 'bg-[var(--color-border)] text-[var(--color-text-secondary)]'; // Default for 'None' or unknown
  }
};

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought }) => {
  const formattedDate = new Date(thought.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div className="bg-[var(--color-bg-secondary)] p-6 rounded-xl shadow-xl border border-[var(--color-border)] transition-all duration-300 ease-in-out hover:shadow-2xl">
      <p className="font-inter text-[var(--color-text-primary)] text-lg mb-4 leading-relaxed">
        {thought.content}
      </p>
      <div className="flex justify-between items-center text-sm font-inter text-[var(--color-text-secondary)]">
        <span className="opacity-75">{formattedDate}</span>
        {thought.mood && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMoodStyles(thought.mood)}`}>
            {thought.mood}
          </span>
        )}
      </div>
    </div>
  );
};

export default ThoughtCard;
