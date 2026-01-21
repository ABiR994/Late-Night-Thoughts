import Head from 'next/head';
import Layout from '../components/Layout';
import PostForm from '../components/PostForm';
import ThoughtCard from '../components/ThoughtCard';
import MoodFilter from '../components/MoodFilter';
import ReadingMode from '../components/ReadingMode';
import React, { useState, useEffect, useCallback } from 'react';

interface Thought {
  id: string;
  created_at: string;
  content: string;
  is_public: boolean;
  mood: string | null;
}

export default function Home() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState('All');
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showComposer, setShowComposer] = useState(false);

  const fetchThoughts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = selectedMood === 'All' ? '' : `?mood=${selectedMood}`;
      const response = await fetch(`/api/thoughts${query}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data: Thought[] = await response.json();
      setThoughts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMood]);

  useEffect(() => {
    fetchThoughts();
  }, [fetchThoughts]);

  // Open reading mode
  const openReading = (thought: Thought, index: number) => {
    setSelectedThought(thought);
    setSelectedIndex(index);
  };

  // Navigate in reading mode
  const goToNext = () => {
    if (selectedIndex < thoughts.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedThought(thoughts[nextIndex]);
      setSelectedIndex(nextIndex);
    }
  };

  const goToPrev = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedThought(thoughts[prevIndex]);
      setSelectedIndex(prevIndex);
    }
  };

  // Random thought
  const openRandom = () => {
    if (thoughts.length > 0) {
      const randomIndex = Math.floor(Math.random() * thoughts.length);
      openReading(thoughts[randomIndex], randomIndex);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Late Night Thoughts</title>
        <meta name="description" content="A quiet place for your midnight reflections. Anonymous. Safe. Beautiful." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen pb-24">
        {/* Hero Section - Minimal & Typographic */}
        <header className="relative pt-24 sm:pt-32 lg:pt-40 pb-20 sm:pb-28 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8 animate-fade-in">
              <div className="w-8 h-px bg-gradient-to-r from-aurora-violet to-transparent" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--text-muted)]">
                Anonymous Journal
              </span>
            </div>

            {/* Main Title */}
            <h1 className="animate-fade-in">
              <span className="block text-display-lg font-display text-[var(--text-primary)] leading-[0.95]">
                Late Night
              </span>
              <span className="block text-display-lg font-display text-gradient leading-[0.95] mt-1">
                Thoughts
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 max-w-md text-lg text-[var(--text-secondary)] font-body leading-relaxed animate-fade-in-up delay-1">
              Where words find their way out when the world falls quiet.
            </p>

            {/* Action Bar */}
            <div className="mt-12 flex flex-wrap items-center gap-4 animate-fade-in-up delay-2">
              <button
                onClick={() => setShowComposer(!showComposer)}
                className="
                  group relative
                  inline-flex items-center gap-3
                  px-6 py-3.5
                  bg-[var(--text-primary)] text-[var(--bg-base)]
                  font-body font-medium text-sm
                  rounded-full
                  transition-all duration-300
                  hover:shadow-glow hover:scale-[1.02]
                  active:scale-[0.98]
                "
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Write a thought</span>
              </button>

              <button
                onClick={openRandom}
                disabled={thoughts.length === 0}
                className="
                  inline-flex items-center gap-2
                  px-5 py-3
                  text-sm font-body text-[var(--text-secondary)]
                  border border-[var(--border-subtle)]
                  rounded-full
                  transition-all duration-300
                  hover:text-[var(--text-primary)] hover:border-[var(--border-default)]
                  disabled:opacity-40 disabled:cursor-not-allowed
                  group
                "
              >
                <svg 
                  className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
                <span>Random thought</span>
              </button>
            </div>
          </div>
        </header>

        {/* Composer - Collapsible */}
        <section className={`
          px-6 overflow-hidden transition-all duration-500 ease-out
          ${showComposer ? 'max-h-[800px] opacity-100 pb-20' : 'max-h-0 opacity-0 pb-0'}
        `}>
          <div className="max-w-2xl mx-auto">
            <PostForm onSuccess={() => {
              fetchThoughts();
              setShowComposer(false);
            }} />
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {thoughts.length} shared
            </span>
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          </div>
        </div>

        {/* Feed Section */}
        <section className="px-6 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto">
            {/* Filter Bar */}
            <div className="mb-12">
              <MoodFilter 
                currentMood={selectedMood} 
                onSelectMood={setSelectedMood} 
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="py-8 border-b border-[var(--border-subtle)]"
                  >
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-[var(--border-subtle)] rounded w-4/5" />
                      <div className="h-4 bg-[var(--border-subtle)] rounded w-3/5" />
                      <div className="h-3 bg-[var(--border-subtle)] rounded w-1/4 mt-6" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full border border-red-500/20">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-[var(--text-secondary)] mb-6">Something went wrong</p>
                <button
                  onClick={fetchThoughts}
                  className="
                    px-5 py-2.5 rounded-full
                    text-sm font-body
                    border border-[var(--border-subtle)]
                    text-[var(--text-secondary)]
                    hover:text-[var(--text-primary)] hover:border-[var(--border-default)]
                    transition-colors duration-200
                  "
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && thoughts.length === 0 && (
              <div className="py-24 text-center">
                <div className="inline-block mb-8">
                  <svg className="w-12 h-12 text-[var(--text-muted)] animate-breathe" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="text-xl font-display text-[var(--text-primary)] mb-3">
                  The night is quiet
                </h3>
                <p className="text-[var(--text-secondary)] text-sm max-w-xs mx-auto">
                  Be the first to share a thought into the stillness.
                </p>
              </div>
            )}

            {/* Thoughts List - Timeline Style */}
            {!loading && !error && thoughts.length > 0 && (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--border-subtle)] via-[var(--border-subtle)] to-transparent" />
                
                <div className="space-y-0">
                  {thoughts.map((thought, index) => (
                    <ThoughtCard
                      key={thought.id}
                      thought={thought}
                      index={index}
                      onClick={() => openReading(thought, index)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <p className="font-display text-lg text-[var(--text-primary)] mb-2">
                  Late Night Thoughts
                </p>
                <p className="text-sm text-[var(--text-muted)] font-mono">
                  A quiet corner of the internet
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-aurora-violet animate-pulse" />
                <span>Active now</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Reading Mode */}
      {selectedThought && (
        <ReadingMode
          thought={selectedThought}
          onClose={() => {
            setSelectedThought(null);
            setSelectedIndex(-1);
          }}
          onNext={selectedIndex < thoughts.length - 1 ? goToNext : undefined}
          onPrev={selectedIndex > 0 ? goToPrev : undefined}
        />
      )}
    </Layout>
  );
}
