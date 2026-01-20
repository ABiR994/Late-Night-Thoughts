import React, { useState, useRef, useEffect } from 'react';

interface MoodFilterProps {
  onSelectMood: (mood: string) => void;
  currentMood: string;
}

const moods = [
  { value: 'All', label: 'All thoughts', color: null },
  { value: 'None', label: 'No mood', color: null },
  { value: 'Happy', label: 'Happy', color: '#fbbf24' },
  { value: 'Sad', label: 'Sad', color: '#60a5fa' },
  { value: 'Contemplative', label: 'Contemplative', color: '#a78bfa' },
  { value: 'Anxious', label: 'Anxious', color: '#f472b6' },
  { value: 'Hopeful', label: 'Hopeful', color: '#34d399' },
  { value: 'Angry', label: 'Angry', color: '#f87171' },
  { value: 'Calm', label: 'Calm', color: '#38bdf8' },
];

const MoodFilter: React.FC<MoodFilterProps> = ({ onSelectMood, currentMood }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const selected = moods.find(m => m.value === currentMood) || moods[0];

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-5 py-2.5
          bg-[var(--glass-bg)] backdrop-blur-sm
          border border-[var(--border-subtle)]
          rounded-xl
          text-sm font-body
          transition-all duration-300
          hover:border-[var(--border-default)]
          ${isOpen ? 'border-aurora-violet/40 shadow-glow' : ''}
        `}
      >
        {selected.color ? (
          <span 
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: selected.color }}
          />
        ) : (
          <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
        )}
        <span className="text-[var(--text-secondary)]">{selected.label}</span>
        <svg 
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="
          absolute right-0 top-full mt-3 z-50
          min-w-[220px]
          bg-[var(--bg-elevated)]/95 backdrop-blur-xl
          border border-[var(--border-default)]
          rounded-2xl
          shadow-float
          py-2
          animate-fade-in-down
          overflow-hidden
        ">
          {moods.map((mood, index) => (
            <button
              key={mood.value}
              onClick={() => {
                onSelectMood(mood.value);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3.5 px-5 py-3
                text-sm text-left font-body
                transition-all duration-150
                ${currentMood === mood.value 
                  ? 'bg-aurora-violet/10 text-aurora-violet' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]'
                }
              `}
              style={{ animationDelay: `${index * 20}ms` }}
            >
              {mood.color ? (
                <span 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: mood.color }}
                />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full border border-[var(--border-default)] flex-shrink-0" />
              )}
              <span className="flex-1">{mood.label}</span>
              {currentMood === mood.value && (
                <svg 
                  className="w-4 h-4 flex-shrink-0" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodFilter;
