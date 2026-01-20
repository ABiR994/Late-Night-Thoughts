import Head from 'next/head';
import Layout from '../components/Layout';
import PostForm from '../components/PostForm';
import ThoughtCard from '../components/ThoughtCard';
import MoodFilter from '../components/MoodFilter';
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

  const fetchThoughts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = selectedMood === 'All' ? '' : `?mood=${selectedMood}`;
      const response = await fetch(`/api/thoughts${query}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
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

  return (
    <Layout>
      <Head>
        <title>Late Night Thoughts</title>
        <meta name="description" content="Anonymous thought journal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center py-10 px-4 space-y-10 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-primary-darker)]">
        <h1 className="text-5xl md:text-6xl font-lora font-bold tracking-tight leading-tight text-[var(--color-text-primary)]">
          Late Night Thoughts
        </h1>
        
        <PostForm />

        <section className="w-full max-w-lg mx-auto space-y-6"> {/* Increased max-w and spacing */}
          <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]"> {/* Added bottom border */}
            <h2 className="text-3xl font-lora font-semibold text-[var(--color-text-primary)]">Recent Thoughts</h2>
            <MoodFilter onSelectMood={setSelectedMood} currentMood={selectedMood} />
          </div>
          {loading && <p className="text-[var(--color-text-secondary)]">Loading thoughts...</p>}
          {error && <p className="text-red-500">Error loading thoughts: {error}</p>}
          {!loading && thoughts.length === 0 && <p className="text-[var(--color-text-secondary)]">No thoughts to display yet.</p>}
          <div className="space-y-4">
            {thoughts.map((thought) => (
              <ThoughtCard key={thought.id} thought={thought} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
