import Head from 'next/head';
import Layout from '../components/Layout';
import PostForm from '../components/PostForm';
import ThoughtCard from '../components/ThoughtCard';
import MoodFilter from '../components/MoodFilter';
import ReadingMode from '../components/ReadingMode';
import Constellation from '../components/Constellation';
import { useCursor } from '../context/CursorContext';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { triggerFallingStar, handwritten, setHandwritten } = useCursor();
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  
  const [isLive, setIsLive] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time listener for falling stars
  useEffect(() => {
    const channel = supabase
      .channel('public:thoughts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'thoughts' }, (payload) => {
        if (payload.new.is_public) {
          triggerFallingStar();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [triggerFallingStar]);

  const handleScopeChange = (newScope: 'all' | 'me') => {
    if (newScope === scope) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setScope(newScope);
      setIsTransitioning(false);
    }, 400);
  };

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

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, thoughts.length);
  }, [thoughts]);

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
        <header className="pt-32 sm:pt-48 pb-32 px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-aurora-violet/40 to-transparent" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-[var(--text-muted)] opacity-70">
                Midnight Reflections
              </span>
              <span className="text-[11px] font-mono text-aurora-violet/60 mt-2 tabular-nums">
                {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-aurora-violet/40 to-transparent" />
          </div>

          <h1 className="animate-fade-in relative">
            <span className="block text-display-lg font-display text-[var(--text-primary)] leading-[0.9] tracking-tight">
              Late Night
            </span>
            <span className="block text-display-lg font-display text-gradient leading-[0.9] mt-2 tracking-tight">
              Thoughts
            </span>
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-aurora-violet/10 blur-[100px] -z-10 rounded-full" />
          </h1>
          <p className="mt-12 text-lg text-[var(--text-secondary)] font-body max-w-sm mx-auto leading-relaxed animate-fade-in-up delay-1 opacity-80">
            A quiet space for words that only emerge when the world falls silent.
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

        <section className="px-6 pb-8">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleScopeChange('all')}
                  className={`relative text-[10px] font-mono uppercase tracking-[0.3em] transition-all duration-300 ${scope === 'all' ? 'text-aurora-violet' : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]'}`}
                >
                  public
                  {scope === 'all' && <span className="absolute -bottom-2 left-0 w-full h-px bg-aurora-violet shadow-[0_0_8px_rgba(139,92,246,0.6)]" />}
                </button>
                <button
                  onClick={() => handleScopeChange('me')}
                  className={`relative text-[10px] font-mono uppercase tracking-[0.3em] transition-all duration-300 ${scope === 'me' ? 'text-aurora-violet' : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]'}`}
                >
                  mine
                  {scope === 'me' && <span className="absolute -bottom-2 left-0 w-full h-px bg-aurora-violet shadow-[0_0_8px_rgba(139,92,246,0.6)]" />}
                </button>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={() => setHandwritten(!handwritten)}
                className={`text-[10px] font-mono uppercase tracking-[0.3em] transition-all duration-300 ${handwritten ? 'text-aurora-violet' : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]'}`}
              >
                script
              </button>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={openRandom}
                disabled={thoughts.length === 0}
                className="
                  text-[10px] font-mono uppercase tracking-[0.3em]
                  text-[var(--text-faint)] hover:text-aurora-violet
                  disabled:opacity-20 disabled:cursor-not-allowed
                  transition-all duration-300
                  flex items-center gap-2
                "
              >
                <span className="w-1 h-1 rounded-full bg-current" />
                random
              </button>
            </div>
            <MoodFilter currentMood={selectedMood} onSelectMood={setSelectedMood} />
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className={`max-w-xl mx-auto transition-all duration-700 ${isTransitioning ? 'feed-exit' : 'feed-enter'}`}>
            {loading && (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="py-10 px-6 bg-white/[0.02] rounded-2xl relative overflow-hidden">
                    <div className="skeleton-starlight h-4 w-full rounded mb-4" />
                    <div className="skeleton-starlight h-4 w-3/4 rounded mb-8" />
                    <div className="flex justify-between items-center">
                      <div className="skeleton-starlight h-3 w-20 rounded" />
                      <div className="skeleton-starlight h-8 w-8 rounded-full" />
                    </div>
                    {/* Tiny decorative stars in skeleton */}
                    <div className="starlight-particle top-4 right-8" style={{ animationDelay: '0.2s' }} />
                    <div className="starlight-particle bottom-6 left-1/4" style={{ animationDelay: '0.5s' }} />
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
              <div className="relative">
                {scope === 'me' && <Constellation targets={cardRefs.current.filter((r): r is HTMLElement => r !== null)} />}
                {thoughts.map((thought, index) => (
                  <div 
                    key={thought.id}
                    style={{ 
                      marginLeft: index % 2 === 0 ? '0' : '2rem',
                      marginRight: index % 2 === 0 ? '2rem' : '0',
                      marginTop: index === 0 ? '0' : '-1rem'
                    }}
                  >
                    <ThoughtCard
                      ref={el => { cardRefs.current[index] = el; }}
                      thought={thought}
                      index={index}
                      onClick={() => openReading(thought, index)}
                    />
                  </div>
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
