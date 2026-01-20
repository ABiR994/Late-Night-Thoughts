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
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <p className="text-gray-800 text-lg mb-2">{thought.content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{formattedDate}</span>
        {thought.mood && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{thought.mood}</span>}
      </div>
    </div>
  );
};

export default ThoughtCard;
