import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content, is_public } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Thought content cannot be empty.' });
    }

    const { data, error } = await supabase
      .from('thoughts')
      .insert([
        { content, is_public: is_public || false }
      ])
      .select();

    if (error) {
      console.error('Error inserting thought:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data[0]);
  } else if (req.method === 'GET') {
    // For now, return a placeholder for GET requests
    // We will implement actual fetching later
    const { data, error } = await supabase
      .from('thoughts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching thoughts:', error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
