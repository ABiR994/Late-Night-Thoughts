import Head from 'next/head';
import Layout from '../components/Layout';
import PostForm from '../components/PostForm';
import ThoughtCard from '../components/ThoughtCard';
import MoodFilter from '../components/MoodFilter';
import ReadingMode from '../components/ReadingMode';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../utils/db';
import { GetStaticProps } from 'next';

interface Thought {
  id: string;
  created_at: string;
  content: string;
  is_public: boolean;
  mood: string | null;
}

interface HomeProps {
  initialThoughts: Thought[];
}

export default function Home({ initialThoughts }: HomeProps) {
  const [thoughts, setThoughts] = useState<Thought[]>(initialThoughts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState('All');
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [scope, setScope] = useState<'all' | 'me'>('all');
  
  const [isLive, setIsLive] = useState(false);

  const fetchThoughts = useCallback(async (currentScope: string, currentMood: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const moodParam = currentMood === 'All' ? '' : `mood=${currentMood}`;
      const scopeParam = `scope=${currentScope}`;
      const queryString = [moodParam, scopeParam].filter(Boolean).join('&');
      
      const response = await fetch(`/api/thoughts?${queryString}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch');
      const data: Thought[] = await response.json();
      
      setThoughts(data);
      setIsLive(true);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLive && scope === 'all' && selectedMood === 'All') {
      return;
    }
    fetchThoughts(scope, selectedMood);
  }, [scope, selectedMood, fetchThoughts, isLive]);

  const handlePostSuccess = () => {
    fetchThoughts(scope, selectedMood);
  };

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
        <link rel="icon" href="/icons/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#02040a" />
        <link rel="apple-touch-icon" href="/icons/icon.png" />
      </Head>

      <main className="min-h-screen">
        <header className="pt-24 sm:pt-32 pb-24 px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-10 animate-fade-in">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-aurora-violet/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--text-muted)]">
              Anonymous Journal
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-aurora-violet/50" />
          </div>

          <h1 className="animate-fade-in">
            <span className="block text-display-lg font-display text-[var(--text-primary)] leading-[0.95]">
              Late Night
            </span>
            <span className="block text-display-lg font-display text-gradient leading-[0.95] mt-1">
              Thoughts
            </span>
          </h1>
          <p className="mt-10 text-lg text-[var(--text-secondary)] font-body max-w-md mx-auto leading-relaxed animate-fade-in-up delay-1">
            Where words find their way out when the world falls quiet.
          </p>
        </header>

        <section className="px-6 pb-16">
          <div className="max-w-xl mx-auto">
            <PostForm onSuccess={handlePostSuccess} />
          </div>
        </section>

        <div className="max-w-xl mx-auto px-6 pb-8">
          <div className="h-px bg-[var(--border-subtle)]" />
        </div>

        <section className="px-6 pb-6">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setScope('all')}
                  className={`text-[11px] font-mono uppercase tracking-[0.2em] transition-colors ${scope === 'all' ? 'text-aurora-violet' : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]'}`}
                >
                  public
                </button>
                <span className="text-[var(--text-faint)] opacity-30 text-[10px]">/</span>
                <button
                  onClick={() => setScope('me')}
                  className={`text-[11px] font-mono uppercase tracking-[0.2em] transition-colors ${scope === 'me' ? 'text-aurora-violet' : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]'}`}
                >
                  mine
                </button>
              </div>
              <div className="w-px h-3 bg-[var(--border-subtle)]" />
              <button
                onClick={openRandom}
                disabled={thoughts.length === 0}
                className="
                  text-[11px] font-mono uppercase tracking-[0.2em]
                  text-[var(--text-muted)] hover:text-aurora-violet
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

        <section className="px-6 pb-20">
          <div className="max-w-xl mx-auto">
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

            {error && (
              <div className="py-16 text-center">
                <p className="text-[var(--text-secondary)] text-sm mb-4">Something went wrong</p>
                <button onClick={() => fetchThoughts(scope, selectedMood)} className="text-xs text-aurora-violet hover:underline">
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && thoughts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-[var(--text-secondary)] text-sm">
                  {scope === 'me' ? "You haven't shared any thoughts yet." : "No thoughts found."}
                </p>
              </div>
            )}

            {!loading && thoughts.length > 0 && (
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

        <footer className="px-6 py-12 border-t border-[var(--border-subtle)]">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-xs text-[var(--text-muted)]">
              A quiet corner of the internet
            </p>
          </div>
        </footer>
      </main>

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

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data, error } = await supabase
      .from('thoughts')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return {
      props: {
        initialThoughts: data || [],
      },
      revalidate: 60,
    };
  } catch (err) {
    console.error('Error in getStaticProps:', err);
    return {
      props: {
        initialThoughts: [],
      },
      revalidate: 10,
    };
  }
};
