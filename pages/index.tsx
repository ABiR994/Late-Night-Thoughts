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

  const openReading = (thought: Thought, index: number) => {
    setSelectedThought(thought);
    setSelectedIndex(index);
  };

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
        <meta name="description" content="A quiet place for your midnight reflections." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        {/* Hero - Centered, Minimal */}
        <header className="pt-20 sm:pt-28 pb-16 px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] mb-4">
            Late Night Thoughts
          </h1>
          <p className="text-base text-[var(--text-secondary)] max-w-md mx-auto">
            A quiet space for anonymous reflections
          </p>
        </header>

        {/* Composer */}
        <section className="px-6 pb-16">
          <div className="max-w-xl mx-auto">
            <PostForm onSuccess={fetchThoughts} />
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-xl mx-auto px-6 pb-8">
          <div className="h-px bg-[var(--border-subtle)]" />
        </div>

        {/* Feed Header */}
        <section className="px-6 pb-6">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--text-muted)]">
                {thoughts.length} thoughts
              </span>
              <button
                onClick={openRandom}
                disabled={thoughts.length === 0}
                className="
                  text-xs text-[var(--text-muted)] hover:text-aurora-violet
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                random
              </button>
            </div>
            <MoodFilter currentMood={selectedMood} onSelectMood={setSelectedMood} />
          </div>
        </section>

        {/* Thoughts Feed */}
        <section className="px-6 pb-20">
          <div className="max-w-xl mx-auto">
            {/* Loading */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="py-6 border-b border-[var(--border-subtle)]">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-[var(--border-subtle)] rounded w-full" />
                      <div className="h-4 bg-[var(--border-subtle)] rounded w-3/4" />
                      <div className="h-3 bg-[var(--border-subtle)] rounded w-20 mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="py-16 text-center">
                <p className="text-[var(--text-secondary)] text-sm mb-4">Something went wrong</p>
                <button
                  onClick={fetchThoughts}
                  className="text-xs text-aurora-violet hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && thoughts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-[var(--text-secondary)] text-sm">
                  No thoughts yet. Be the first to share.
                </p>
              </div>
            )}

            {/* List */}
            {!loading && !error && thoughts.length > 0 && (
              <div>
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
        <footer className="px-6 py-12 border-t border-[var(--border-subtle)]">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-xs text-[var(--text-muted)]">
              A quiet corner of the internet
            </p>
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
