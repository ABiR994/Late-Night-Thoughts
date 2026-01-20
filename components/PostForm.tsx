import React, { useState } from 'react';

const moods = ['None', 'Happy', 'Sad', 'Contemplative', 'Anxious', 'Hopeful', 'Angry', 'Calm'];

const PostForm = () => {
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [mood, setMood] = useState(moods[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!content.trim()) {
      setMessage('Thought content cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/thoughts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, is_public: isPublic, mood: mood === 'None' ? null : mood }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Thought posted successfully!');
        setContent(''); // Clear the form
        setIsPublic(false);
        setMood(moods[0]);
        console.log('New thought:', data);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error('Failed to post thought:', error);
      setMessage('Failed to post thought. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-[var(--color-bg-secondary)] shadow-xl rounded-xl max-w-lg w-full border border-[var(--color-border)] transition-all duration-300 ease-in-out hover:shadow-2xl">
      <textarea
        className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-base placeholder:text-[var(--color-text-secondary)] transition-all duration-200 ease-in-out resize-none"
        rows={5}
        placeholder="Share your late night thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      ></textarea>
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            className="mr-2 h-4 w-4 accent-[var(--color-accent)] cursor-pointer"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="isPublic" className="text-[var(--color-text-primary)] text-sm select-none">Make Public</label>
        </div>
        <div className="flex items-center">
          <label htmlFor="moodSelect" className="text-[var(--color-text-primary)] text-sm mr-2 select-none">Mood:</label>
          <select
            id="moodSelect"
            className="p-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-sm transition-all duration-200 ease-in-out cursor-pointer"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            disabled={loading}
          >
            {moods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 w-full bg-[var(--color-accent)] text-white font-semibold py-3 px-4 rounded-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)] disabled:opacity-50 transition-all duration-300 ease-in-out"
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Post Thought'}
      </button>
      {message && (
        <p className={`mt-4 text-center text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default PostForm;
