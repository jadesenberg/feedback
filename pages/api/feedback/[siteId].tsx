import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllFeedback } from 'lib/db-admin';
import { db } from 'lib/firebase-admin';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const siteId = req.query.siteId.toString();
  await getAllFeedback(siteId)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
