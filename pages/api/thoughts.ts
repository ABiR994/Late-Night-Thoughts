import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/db';

// Simple in-memory rate limiter
const rateLimitMap = new Map();

const checkRateLimit = (ip: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const userRate = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - userRate.startTime > windowMs) {
    userRate.count = 1;
    userRate.startTime = now;
  } else {
    userRate.count++;
  }

  rateLimitMap.set(ip, userRate);
  return userRate.count <= limit;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anonymous';
  
  if (req.method === 'POST') {
    // Rate limit: 5 posts per 10 minutes
    if (!checkRateLimit(ip as string, 5, 10 * 60 * 1000)) {
      return res.status(429).json({ error: 'Too many thoughts shared. Please rest a while.' });
    }

    const { content, is_public, mood } = req.body;
    
    // Get user from auth header
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    if (!content) {
      return res.status(400).json({ error: 'Thought content cannot be empty.' });
    }

    const { data, error } = await supabase
      .from('thoughts')
      .insert([
        { 
          content, 
          is_public: is_public || false, 
          mood,
          user_id: userId // Associate with user if logged in
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting thought:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data[0]);
  } else if (req.method === 'GET') {
    // Rate limit: 60 reads per minute
    if (!checkRateLimit(ip as string, 60, 60 * 1000)) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    const { mood, scope } = req.query;
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    let query = supabase.from('thoughts').select('*');

    if (scope === 'me') {
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('is_public', true);
    }

    if (mood && mood !== 'All') {
      if (mood === 'None') {
        query = query.is('mood', null);
      } else {
        query = query.eq('mood', mood);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

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
