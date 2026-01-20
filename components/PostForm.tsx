import React, { useState, useRef, useEffect, useCallback } from 'react';

const moods = [
  { value: 'None', label: 'No mood', color: null },
  { value: 'Happy', label: 'Happy', color: '#fbbf24' },
  { value: 'Sad', label: 'Sad', color: '#60a5fa' },
  { value: 'Contemplative', label: 'Contemplative', color: '#a78bfa' },
  { value: 'Anxious', label: 'Anxious', color: '#f472b6' },
  { value: 'Hopeful', label: 'Hopeful', color: '#34d399' },
  { value: 'Angry', label: 'Angry', color: '#f87171' },
  { value: 'Calm', label: 'Calm', color: '#38bdf8' },
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

const PostForm = () => {
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [mood, setMood] = useState('None');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const moodPickerRef = useRef<HTMLDivElement>(null);

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
      textareaRef.current.style.height = `${Math.max(180, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  // Close mood picker on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moodPickerRef.current && !moodPickerRef.current.contains(e.target as Node)) {
        setShowMoodPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
        setMessage({ type: 'success', text: 'Your thought has been released into the night.' });
        setContent('');
        setMood('None');
        setIsPublic(false);
        localStorage.removeItem('thought-draft');
        setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
        setTimeout(() => setMessage(null), 5000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Something went wrong.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to share thought. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedMood = moods.find(m => m.value === mood);
  const charProgress = (content.length / MAX_CHARS) * 100;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      {/* Main card container */}
      <div 
        className={`
          relative rounded-3xl
          transition-all duration-500 ease-out
          ${isFocused ? 'shadow-glow' : ''}
        `}
      >
        {/* Gradient border */}
        <div 
          className={`
            absolute -inset-[1px] rounded-3xl
            transition-opacity duration-500
            ${isFocused ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.2), transparent)',
          }}
        />

        {/* Card content */}
        <div 
          className={`
            relative
            bg-[var(--bg-surface)]/80 backdrop-blur-2xl
            border border-[var(--border-subtle)]
            rounded-3xl
            overflow-hidden
            transition-all duration-500
            ${isFocused ? 'border-transparent' : ''}
          `}
        >
          {/* Inner content */}
          <div className="p-8 sm:p-10">
            {/* Prompt hint - fades when typing */}
            <div className={`
              overflow-hidden transition-all duration-500 ease-out
              ${content ? 'max-h-0 opacity-0 mb-0' : 'max-h-20 opacity-100 mb-6'}
            `}>
              <p className="text-base text-[var(--text-muted)] font-display italic leading-relaxed">
                "{currentPrompt}"
              </p>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => e.target.value.length <= MAX_CHARS && setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What's on your mind tonight?"
              disabled={loading}
              className="
                w-full min-h-[180px] bg-transparent
                text-xl sm:text-2xl font-display leading-[1.6] tracking-[-0.01em]
                text-[var(--text-primary)]
                placeholder:text-[var(--text-muted)] placeholder:font-body placeholder:text-lg placeholder:font-normal
                focus:outline-none resize-none
              "
            />
          </div>

          {/* Divider with progress */}
          <div className="relative h-[1px] mx-8 sm:mx-10">
            <div className="absolute inset-0 bg-[var(--border-subtle)]" />
            <div 
              className={`
                absolute left-0 top-0 h-full rounded-full
                transition-all duration-300 ease-out
                ${charProgress > 90 
                  ? 'bg-gradient-to-r from-red-500 to-red-400' 
                  : charProgress > 70 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                    : 'bg-gradient-to-r from-aurora-violet to-aurora-purple'
                }
              `}
              style={{ width: `${Math.min(charProgress, 100)}%` }}
            />
          </div>

          {/* Controls */}
          <div className="p-8 sm:p-10 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Left controls */}
              <div className="flex flex-wrap items-center gap-5">
                {/* Public toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      disabled={loading}
                      className="sr-only peer"
                    />
                    <div className="
                      w-12 h-7 rounded-full
                      bg-[var(--border-default)] 
                      peer-checked:bg-aurora-violet
                      transition-colors duration-300
                    " />
                    <div className="
                      absolute left-1 top-1 w-5 h-5 rounded-full
                      bg-white shadow-md
                      peer-checked:translate-x-5
                      transition-transform duration-300 ease-out
                    " />
                  </div>
                  <span className="text-sm font-body text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    Share publicly
                  </span>
                </label>

                {/* Mood picker */}
                <div className="relative" ref={moodPickerRef}>
                  <button
                    type="button"
                    onClick={() => setShowMoodPicker(!showMoodPicker)}
                    className={`
                      flex items-center gap-2.5 px-4 py-2 rounded-xl
                      text-sm font-body
                      bg-[var(--glass-bg)] backdrop-blur-sm
                      border border-[var(--border-subtle)]
                      transition-all duration-200
                      hover:border-[var(--border-default)]
                      ${showMoodPicker ? 'border-aurora-violet/50' : ''}
                    `}
                  >
                    {selectedMood?.color && (
                      <span 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: selectedMood.color }}
                      />
                    )}
                    <span className="text-[var(--text-secondary)]">
                      {selectedMood?.label || 'Mood'}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${showMoodPicker ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {/* Mood dropdown */}
                  {showMoodPicker && (
                    <div className="
                      absolute left-0 top-full mt-3 z-50
                      min-w-[200px] py-2
                      bg-[var(--bg-elevated)]/95 backdrop-blur-xl
                      border border-[var(--border-default)]
                      rounded-2xl shadow-float
                      animate-fade-in-down
                    ">
                      {moods.map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => {
                            setMood(m.value);
                            setShowMoodPicker(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3
                            text-sm text-left font-body
                            transition-colors duration-150
                            ${mood === m.value 
                              ? 'text-aurora-violet bg-aurora-violet/10' 
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]'
                            }
                          `}
                        >
                          {m.color ? (
                            <span 
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: m.color }}
                            />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full border border-[var(--border-default)]" />
                          )}
                          <span className="flex-1">{m.label}</span>
                          {mood === m.value && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - character count and submit */}
              <div className="flex items-center gap-4">
                <span className={`
                  text-xs font-mono tracking-wide
                  transition-colors duration-300
                  ${charProgress > 90 ? 'text-red-400' : charProgress > 70 ? 'text-amber-400' : 'text-[var(--text-muted)]'}
                `}>
                  {content.length}/{MAX_CHARS}
                </span>

                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="
                    relative overflow-hidden
                    flex items-center gap-2.5
                    px-7 py-3.5
                    bg-gradient-to-r from-aurora-violet to-aurora-purple
                    text-white font-body font-medium text-sm
                    rounded-2xl
                    transition-all duration-300 ease-out
                    hover:shadow-glow-lg hover:-translate-y-0.5
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                    active:translate-y-0
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
                      <span>Release thought</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error message */}
      {message && (
        <div className={`
          mt-6 px-6 py-4 rounded-2xl text-sm font-body text-center
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
