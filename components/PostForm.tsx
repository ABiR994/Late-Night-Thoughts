import React, { useState } from 'react';

const PostForm = () => {
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
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
        body: JSON.stringify({ content, is_public: isPublic }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Thought posted successfully!');
        setContent(''); // Clear the form
        setIsPublic(false);
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
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg max-w-md w-full">
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        placeholder="Share your late night thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      ></textarea>
      <div className="mt-2 flex items-center">
        <input
          type="checkbox"
          id="isPublic"
          className="mr-2"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          disabled={loading}
        />
        <label htmlFor="isPublic" className="text-gray-700">Make Public</label>
      </div>
      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Post Thought'}
      </button>
      {message && (
        <p className={`mt-3 text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default PostForm;
