import React, { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../utils/db';
import { useCursor } from '../context/CursorContext';

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
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const { triggerRipple, triggerShootingStar } = useCursor();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setContent(val);
      
      // Emit particle
      const id = Date.now() + Math.random();
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 80;
      setParticles(prev => [...prev.slice(-15), { id, x, y }]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, 800);
    }
  };

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
        triggerRipple();
        triggerShootingStar();
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
        bg-[var(--bg-surface)]/30 backdrop-blur-xl
        border border-[var(--border-subtle)]
        rounded-2xl relative
        transition-all duration-500 ease-[var(--ease-out-expo)]
        focus-within:border-aurora-violet/40 focus-within:shadow-glow
        focus-within:bg-[var(--bg-surface)]/50
      ">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="What's on your mind tonight?"
          disabled={loading}
          className="
            w-full min-h-[140px] p-8
            bg-transparent
            text-[18px] font-body leading-relaxed
            text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:outline-none resize-none
            relative z-10
          "
        />

        {/* Typing Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {particles.map(p => (
            <div 
              key={p.id}
              className="typing-particle left-1/2 top-1/2"
              style={{ 
                '--x': `${p.x}px`, 
                '--y': `${p.y}px`,
                '--particle-color': selectedMood?.color || 'white'
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Options - Show when typing */}
        <div className={`
          px-6 pb-6 pt-0
          transition-all duration-500 ease-[var(--ease-out-expo)]
          ${showOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        `}>
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent mb-6" />
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Mood & Public Grouped with Dividers */}
            <div className="flex items-center space-x-10 text-[11px] font-mono uppercase tracking-wider">
              
              {/* Mood selector group */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 group/select relative">
                  <span className="text-[var(--text-muted)]">mood</span>
                  <div className="relative">
                    <select
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="
                        bg-transparent text-[var(--text-secondary)]
                        focus:outline-none cursor-pointer
                        hover:text-[var(--text-primary)]
                        appearance-none pr-4
                        transition-colors
                      "
                      style={{ color: selectedMood?.color || undefined }}
                    >
                      {moods.map((m) => (
                        <option key={m.value} value={m.value} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                      <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-px h-3 bg-[var(--border-subtle)] opacity-50" />
              </div>

              {/* Public toggle group */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group/toggle">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      disabled={loading}
                      className="
                        w-3 h-3 rounded-sm
                        border border-[var(--border-strong)]
                        bg-transparent
                        checked:bg-aurora-violet checked:border-aurora-violet
                        focus:ring-0 focus:ring-offset-0
                        cursor-pointer transition-all
                      "
                    />
                  </div>
                  <span className="text-[var(--text-muted)] group-hover/toggle:text-[var(--text-secondary)] transition-colors">public</span>
                </label>
                <div className="w-px h-3 bg-[var(--border-subtle)] opacity-50" />
              </div>

              {/* Char count */}
              <span className={`
                text-[10px] tabular-nums
                ${content.length > 900 ? 'text-amber-400' : 'text-[var(--text-faint)]'}
                ${content.length > 950 ? 'text-red-400' : ''}
              `}>
                CHAR: {content.length}/{MAX_CHARS}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="
                px-6 py-2
                text-[11px] font-mono uppercase tracking-[0.2em]
                bg-[var(--text-primary)] text-[var(--bg-base)]
                rounded-full
                hover:scale-105 active:scale-95
                disabled:opacity-20 disabled:scale-100 disabled:cursor-not-allowed
                transition-all duration-300
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
