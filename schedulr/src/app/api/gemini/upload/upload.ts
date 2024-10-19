import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const file = req.body.file; 
    
    // Process file upload

    // Add wtv logic here for file saving

    return res.status(200).json({ message: 'File uploaded successfully' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
