import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Handle GET request to fetch thoughts
    res.status(200).json({ message: 'GET thoughts endpoint' });
  } else if (req.method === 'POST') {
    // Handle POST request to submit a new thought
    res.status(200).json({ message: 'POST thoughts endpoint' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
