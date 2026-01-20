import Head from 'next/head';
import Layout from '../components/Layout';
import PostForm from '../components/PostForm';
import ThoughtCard from '../components/ThoughtCard';
import MoodFilter from '../components/MoodFilter';
import ReadingMode from '../components/ReadingMode';
import React, { useState, useEffect, useCallback } from 'react';
import { MOOD_DATA, Mood } from '@/utils/moods';
import WanderIcon from '../components/icons/WanderIcon';

interface Thought {
  id: string;
  created_at: string;
  content: string;
  is_public: boolean;
  mood: Mood | null;
}

export default function Home() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood>('All');
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const fetchThoughts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const query = selectedMood === 'All' ? '' : `?mood=${selectedMood}`;
      const response = await fetch(`/api/thoughts${query}`, { signal });
      if (!response.ok) throw new Error('Failed to fetch');
      const data: Thought[] = await response.json();
      setThoughts(data);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // console.log('Fetch aborted');
        return; 
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMood]);

  useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      // Clean up function for AbortController
      return () => {
        controller.abort();
      };
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

      <main className="min-h-screen">
        {/* Hero Section */}
        <header className="pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display-lg font-display text-[var(--text-primary)] mb-8 animate-fade-in">
              <span className="text-gradient">Late Night</span>
              <br />
              <span className="opacity-90">Thoughts</span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] font-body max-w-lg mx-auto leading-relaxed animate-fade-in-up delay-1">
              A quiet place for the thoughts that find you after midnight
            </p>
          </div>
        </header>

        {/* Writing Section */}
        <section className="px-6 pb-24 sm:pb-32 animate-fade-in-up delay-2">
          <PostForm />
        </section>

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />
        </div>

        {/* Thoughts Section */}
        <section className="px-6 py-20 sm:py-28">
          <div className="max-w-2xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 sm:mb-16">
              <div className="flex items-center gap-5">
                <h2 className="text-3xl sm:text-4xl font-display text-[var(--text-primary)]">
                  Recent Thoughts
                </h2>
                
                {/* Random button */}
                <button
                  onClick={openRandom}
                  disabled={thoughts.length === 0}
                  className="
                    flex items-center gap-2 px-4 py-2
                    bg-[var(--glass-bg)] backdrop-blur-sm
                    border border-[var(--border-subtle)]
                    rounded-xl
                    text-sm font-body text-[var(--text-secondary)]
                    transition-all duration-300
                    hover:text-aurora-violet hover:border-aurora-violet/30 hover:shadow-glow
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[var(--text-secondary)] disabled:hover:border-[var(--border-subtle)] disabled:hover:shadow-none
                    group
                  "
                >
                  <WanderIcon className="w-4 h-4 transition-transform duration-700 group-hover:rotate-180" />
                  <span>Wander</span>
                </button>
              </div>

              <MoodFilter 
                currentMood={selectedMood} 
                onSelectMood={setSelectedMood} 
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="
                      rounded-2xl border border-[var(--border-subtle)]
                      bg-[var(--glass-bg)] backdrop-blur-sm
                      p-8
                    "
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div className="animate-pulse space-y-4">
                      <div className="h-5 bg-[var(--border-subtle)] rounded-lg w-4/5" />
                      <div className="h-5 bg-[var(--border-subtle)] rounded-lg w-3/5" />
                      <div className="h-5 bg-[var(--border-subtle)] rounded-lg w-2/3" />
                      <div className="h-4 bg-[var(--border-subtle)] rounded-lg w-1/4 mt-8" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-[var(--glass-bg)] border border-[var(--border-subtle)] flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-lg text-[var(--text-secondary)] mb-6">Something went wrong</p>
                <button
                  onClick={fetchThoughts}
                  className="
                    px-6 py-3 rounded-xl
                    bg-[var(--glass-bg)] backdrop-blur-sm
                    border border-[var(--border-subtle)]
                    text-sm font-body text-[var(--text-secondary)]
                    hover:text-[var(--text-primary)] hover:border-[var(--border-default)]
                    transition-all duration-200
                  "
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && thoughts.length === 0 && (
              <div className="text-center py-24">
                <div className="w-24 h-24 mx-auto mb-10 rounded-3xl bg-[var(--glass-bg)] border border-[var(--border-subtle)] flex items-center justify-center animate-breathe">
                  <svg className="w-12 h-12 text-aurora-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display text-[var(--text-primary)] mb-4">
                  No thoughts yet
                </h3>
                <p className="text-[var(--text-secondary)] text-base max-w-sm mx-auto leading-relaxed">
                  Be the first to share something into the night. Your words might find someone who needs them.
                </p>
              </div>
            )}

            {/* Thoughts List - More spacing */}
            {!loading && !error && thoughts.length > 0 && (
              <div className="space-y-8">
                {thoughts.map((thought, index) => (
                  <ThoughtCard
                    key={thought.id}
                    thought={thought}
                    index={index}
                    onClick={() => openReading(thought, index)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent mb-12" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-[var(--text-muted)]">
              <p className="font-display italic text-base">
                A quiet place on the internet
              </p>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-aurora-violet animate-pulse" />
                <span className="font-mono text-xs tracking-wide">
                  {thoughts.length} {thoughts.length === 1 ? 'thought' : 'thoughts'} shared
                </span>
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
