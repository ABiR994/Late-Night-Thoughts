import React, { useState, useRef, useEffect } from 'react';
import { MOOD_DATA, Mood } from '@/utils/moods';
import FilterIcon from './icons/FilterIcon';
import CheckIcon from './icons/CheckIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface MoodFilterProps {
  onSelectMood: (mood: Mood) => void;
  currentMood: Mood;
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

  const selected = MOOD_DATA.find(m => m.value === currentMood) || MOOD_DATA[0];

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
          <FilterIcon className="w-4 h-4 text-[var(--text-muted)]" />
          )}
          <span className="text-[var(--text-secondary)]">{selected.label}</span>
          <ChevronDownIcon className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
          {MOOD_DATA.map((mood, index) => (
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
                <CheckIcon />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodFilter;
