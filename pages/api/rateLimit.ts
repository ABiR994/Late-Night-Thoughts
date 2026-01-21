import type { NextApiRequest, NextApiResponse } from 'next';

const LRU = require('lru-cache');

const tokenCache = new LRU({
  max: 500,
  ttl: 60 * 1000, // 1 minute
});

export const rateLimit = (options: { uniqueTokenPerInterval: number, interval: number }) => {
  return {
    check: (res: NextApiResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader(
          'X-RateLimit-Remaining',
          isRateLimited ? 0 : limit - currentUsage
        );

        return isRateLimited ? reject() : resolve();
      }),
  };
};

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await limiter.check(res, 10, 'CACHE_TOKEN'); // 10 requests per minute
    res.status(200).json({ message: 'Success' });
  } catch {
    res.status(429).json({ error: 'Rate limit exceeded' });
  }
}
