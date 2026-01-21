import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

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
  const authHeader = req.headers.authorization;

  // 1. Create a dedicated Supabase client for THIS request
  // This passes the user's token to Postgres so RLS works
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: authHeader || '' },
      },
    }
  );

  if (req.method === 'POST') {
    // Relaxed rate limit for testing: 10 posts per 10 minutes
    if (!checkRateLimit(ip as string, 10, 10 * 60 * 1000)) {
      return res.status(429).json({ error: 'Too many thoughts. Take a breath.' });
    }

    const { content, is_public, mood } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    // 2. Get the authenticated user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // 3. Insert the thought using the user's identity
    const { data, error } = await supabase
      .from('thoughts')
      .insert([
        { 
          content, 
          is_public: is_public || false, 
          mood,
          user_id: user?.id // Explicitly link the user ID
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting thought:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data[0]);
  } 
  
  else if (req.method === 'GET') {
    const { mood, scope } = req.query;
    
    // Verify user if they are asking for "Mine"
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase.from('thoughts').select('*');

    if (scope === 'me') {
      if (!user) return res.status(401).json({ error: 'Not identified' });
      query = query.eq('user_id', user.id);
    } else {
      query = query.eq('is_public', true);
    }

    if (mood && mood !== 'All') {
      if (mood === 'None') query = query.is('mood', null);
      else query = query.eq('mood', mood);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
