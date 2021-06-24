import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserSites } from 'lib/db-admin';
import { auth } from 'lib/firebase-admin';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const token = req.headers.token.toString();
  const { uid } = await auth.verifyIdToken(token);

  await getUserSites(uid)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
