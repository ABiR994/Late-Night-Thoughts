import React, { useState, useRef, useEffect, useCallback } from 'react';

interface PostFormProps {
  onSuccess?: () => void;
}

const moods = [
  { value: 'None', label: 'No mood', color: null, icon: '...' },
  { value: 'Happy', label: 'Happy', color: '#fbbf24', icon: 'H' },
  { value: 'Sad', label: 'Sad', color: '#60a5fa', icon: 'S' },
  { value: 'Contemplative', label: 'Contemplative', color: '#a78bfa', icon: 'C' },
  { value: 'Anxious', label: 'Anxious', color: '#f472b6', icon: 'A' },
  { value: 'Hopeful', label: 'Hopeful', color: '#34d399', icon: 'H' },
  { value: 'Angry', label: 'Angry', color: '#f87171', icon: 'A' },
  { value: 'Calm', label: 'Calm', color: '#38bdf8', icon: 'C' },
];

const prompts = [
  "What's echoing in your mind tonight?",
  "What would you tell yourself from a year ago?",
  "What truth have you been avoiding?",
  "What are you letting go of?",
  "What does your heart need to say?",
  "What would you do if no one was watching?",
  "What are you grateful for in this moment?",
  "What keeps you awake at night?",
];

const MAX_CHARS = 1000;

const PostForm: React.FC<PostFormProps> = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [mood, setMood] = useState('None');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set random prompt on mount
  useEffect(() => {
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem('thought-draft');
    if (draft) {
      try {
        const { content: savedContent, mood: savedMood, isPublic: savedPublic } = JSON.parse(draft);
        if (savedContent) setContent(savedContent);
        if (savedMood) setMood(savedMood);
        if (savedPublic !== undefined) setIsPublic(savedPublic);
      } catch (e) {}
    }
  }, []);

  // Autosave draft
  const saveDraft = useCallback(() => {
    if (content.trim()) {
      localStorage.setItem('thought-draft', JSON.stringify({ content, mood, isPublic }));
    }
  }, [content, mood, isPublic]);

  useEffect(() => {
    const timeout = setTimeout(saveDraft, 1500);
    return () => clearTimeout(timeout);
  }, [content, mood, isPublic, saveDraft]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(140, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          is_public: isPublic,
          mood: mood === 'None' ? null : mood,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Released into the night.' });
        setContent('');
        setMood('None');
        setIsPublic(false);
        localStorage.removeItem('thought-draft');
        setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
        setTimeout(() => {
          setMessage(null);
          onSuccess?.();
        }, 1500);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Something went wrong.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to share thought.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedMood = moods.find(m => m.value === mood);
  const charProgress = (content.length / MAX_CHARS) * 100;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Terminal-style composer */}
      <div 
        className={`
          relative
          bg-[var(--bg-surface)]/60 backdrop-blur-xl
          border border-[var(--border-subtle)]
          rounded-2xl
          overflow-hidden
          transition-all duration-500
          ${isFocused ? 'border-[var(--border-default)] shadow-glow' : ''}
        `}
      >
        {/* Terminal header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
            <span className={`
              transition-colors duration-300
              ${charProgress > 90 ? 'text-red-400' : charProgress > 70 ? 'text-amber-400' : ''}
            `}>
              {content.length}/{MAX_CHARS}
            </span>
            <span className="opacity-50">|</span>
            <span>{isPublic ? 'public' : 'private'}</span>
          </div>
        </div>

        {/* Writing area */}
        <div className="p-5 sm:p-6">
          {/* Prompt - shows when empty */}
          {!content && (
            <div className="mb-4 text-sm text-[var(--text-muted)] font-mono opacity-60">
              // {currentPrompt}
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => e.target.value.length <= MAX_CHARS && setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Start typing..."
            disabled={loading}
            className="
              w-full min-h-[140px] bg-transparent
              text-lg sm:text-xl font-display leading-[1.7] tracking-[-0.01em]
              text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)] placeholder:font-mono placeholder:text-sm
              focus:outline-none resize-none
            "
          />
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-[var(--border-subtle)]">
          <div 
            className={`
              h-full rounded-r-full
              transition-all duration-300 ease-out
              ${charProgress > 90 
                ? 'bg-red-500' 
                : charProgress > 70 
                  ? 'bg-amber-500' 
                  : 'bg-aurora-violet'
              }
            `}
            style={{ width: `${Math.min(charProgress, 100)}%` }}
          />
        </div>

        {/* Controls */}
        <div className="p-5 sm:p-6 pt-4 bg-[var(--bg-base)]/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Mood selector - inline pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-[var(--text-muted)] mr-1">mood:</span>
              {moods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`
                    px-3 py-1.5 rounded-full
                    text-xs font-body
                    border transition-all duration-200
                    ${mood === m.value 
                      ? 'border-transparent text-[var(--bg-base)]' 
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)]'
                    }
                  `}
                  style={{
                    backgroundColor: mood === m.value ? (m.color || 'var(--text-muted)') : 'transparent',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Public toggle */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    disabled={loading}
                    className="sr-only peer"
                  />
                  <div className="
                    w-10 h-6 rounded-full
                    bg-[var(--border-default)] 
                    peer-checked:bg-aurora-violet
                    transition-colors duration-300
                  " />
                  <div className="
                    absolute left-0.5 top-0.5 w-5 h-5 rounded-full
                    bg-white shadow-sm
                    peer-checked:translate-x-4
                    transition-transform duration-300 ease-out
                  " />
                </div>
                <span className="text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                  share
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="
                  flex-1 sm:flex-none
                  flex items-center justify-center gap-2
                  px-6 py-3
                  bg-[var(--text-primary)] text-[var(--bg-base)]
                  font-body font-medium text-sm
                  rounded-full
                  transition-all duration-300
                  hover:opacity-90
                  disabled:opacity-30 disabled:cursor-not-allowed
                "
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Releasing...</span>
                  </>
                ) : (
                  <>
                    <span>Release</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error message */}
      {message && (
        <div className={`
          mt-4 px-4 py-3 rounded-xl text-sm font-mono text-center
          animate-fade-in-up
          ${message.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }
        `}>
          {message.text}
        </div>
      )}
    </form>
  );
};

export default PostForm;
