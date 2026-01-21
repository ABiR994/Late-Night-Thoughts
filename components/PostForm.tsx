import React, { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../utils/db';

interface PostFormProps {
  onSuccess?: () => void;
}

const moods = [
  { value: 'None', label: 'none', color: null },
  { value: 'Happy', label: 'happy', color: '#fbbf24' },
  { value: 'Sad', label: 'sad', color: '#60a5fa' },
  { value: 'Contemplative', label: 'contemplative', color: '#a78bfa' },
  { value: 'Anxious', label: 'anxious', color: '#f472b6' },
  { value: 'Hopeful', label: 'hopeful', color: '#34d399' },
  { value: 'Angry', label: 'angry', color: '#f87171' },
  { value: 'Calm', label: 'calm', color: '#38bdf8' },
];

const MAX_CHARS = 1000;

const PostForm: React.FC<PostFormProps> = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [mood, setMood] = useState('None');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem('thought-draft');
    if (draft) {
      try {
        const { content: c, mood: m, isPublic: p } = JSON.parse(draft);
        if (c) setContent(c);
        if (m) setMood(m);
        if (p !== undefined) setIsPublic(p);
      } catch (e) {}
    }
  }, []);

  // Autosave
  const saveDraft = useCallback(() => {
    if (content.trim()) {
      localStorage.setItem('thought-draft', JSON.stringify({ content, mood, isPublic }));
    }
  }, [content, mood, isPublic]);

  useEffect(() => {
    const t = setTimeout(saveDraft, 1500);
    return () => clearTimeout(t);
  }, [content, mood, isPublic, saveDraft]);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  // Show options when content exists
  useEffect(() => {
    setShowOptions(content.length > 0);
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/thoughts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content,
          is_public: isPublic,
          mood: mood === 'None' ? null : mood,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Shared.' });
        setContent('');
        setMood('None');
        setIsPublic(false);
        localStorage.removeItem('thought-draft');
        setTimeout(() => {
          setMessage(null);
          onSuccess?.();
        }, 1500);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to share.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedMood = moods.find(m => m.value === mood);

  return (
    <form onSubmit={handleSubmit}>
      {/* Textarea Container */}
      <div className="
        bg-[var(--bg-surface)]/40 backdrop-blur-md
        border border-[var(--border-subtle)]
        rounded-2xl
        transition-all duration-300
        focus-within:border-aurora-violet/30 focus-within:shadow-glow
      ">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => e.target.value.length <= MAX_CHARS && setContent(e.target.value)}
          placeholder="What's on your mind tonight?"
          disabled={loading}
          className="
            w-full min-h-[120px] p-6
            bg-transparent
            text-[17px] font-body leading-relaxed
            text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:outline-none resize-none
          "
        />

        {/* Options - Show when typing */}
        <div className={`
          px-4 pb-4 pt-2
          transition-all duration-200
          ${showOptions ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Mood & Public */}
            <div className="flex items-center gap-4 text-xs">
              {/* Mood selector */}
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)]">mood:</span>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="
                    bg-transparent text-[var(--text-secondary)]
                    focus:outline-none cursor-pointer
                    hover:text-[var(--text-primary)]
                  "
                  style={{ color: selectedMood?.color || undefined }}
                >
                  {moods.map((m) => (
                    <option key={m.value} value={m.value} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Public toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={loading}
                  className="
                    w-3 h-3 rounded
                    border border-[var(--border-default)]
                    bg-transparent
                    checked:bg-aurora-violet checked:border-aurora-violet
                    focus:ring-0 focus:ring-offset-0
                    cursor-pointer
                  "
                />
                <span className="text-[var(--text-muted)]">public</span>
              </label>

              {/* Char count */}
              <span className={`
                text-[var(--text-muted)]
                ${content.length > 900 ? 'text-amber-400' : ''}
                ${content.length > 950 ? 'text-red-400' : ''}
              `}>
                {content.length}/{MAX_CHARS}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="
                px-4 py-1.5
                text-xs font-medium
                bg-[var(--text-primary)] text-[var(--bg-base)]
                rounded-md
                hover:opacity-90
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-opacity
              "
            >
              {loading ? '...' : 'share'}
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <p className={`
          mt-3 text-xs text-center
          ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}
        `}>
          {message.text}
        </p>
      )}
    </form>
  );
};

export default PostForm;
