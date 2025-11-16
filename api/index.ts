import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Health check endpoint
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "InfinityX EdTech API is running"
  });
}
