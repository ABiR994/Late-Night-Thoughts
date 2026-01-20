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

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought }) => {
  const formattedDate = new Date(thought.created_at).toLocaleString();

  return (
    <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg shadow-md border border-[var(--color-border)]">
      <p className="text-[var(--color-text-primary)] text-lg mb-2">{thought.content}</p>
      <div className="flex justify-between items-center text-sm text-[var(--color-text-secondary)]">
        <span>{formattedDate}</span>
        {thought.mood && <span className="px-2 py-1 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-full">{thought.mood}</span>}
      </div>
    </div>
  );
};

export default ThoughtCard;
