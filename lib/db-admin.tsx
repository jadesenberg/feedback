import format from 'date-fns/format';
import { Feedback } from 'interfaces/Feedback';
import { Site } from 'interfaces/Site';
import { db } from './firebase-admin';

export async function getAllFeedback(siteId: string): Promise<Feedback[]> {
  const snapshot = await db
    .collection('feedback')
    .where('siteId', '==', siteId)
    .orderBy('createdAt', 'desc')
    .get();

  const feedback = [];

  snapshot.forEach((doc) => {
    const data = {
      id: doc.id,
      ...doc.data()
    };
    data['createdAt'] = format(doc.data().createdAt.toDate(), 'MMM d yyyy');
    feedback.push(data);
  });
  return feedback;
}

export async function getAllSites(): Promise<Site[]> {
  const snapshot = await db
    .collection('sites')
    .orderBy('createdAt', 'desc')
    .get();

  const sites = [];

  snapshot.forEach((doc) => {
    const data = {
      id: doc.id,
      ...doc.data()
    };
    data['createdAt'] = format(doc.data().createdAt.toDate(), 'MMM d yyyy');
    sites.push(data);
  });

  return sites;
}

export async function getUserSites(userid: string): Promise<Site[]> {
  const snapshot = await db
    .collection('sites')
    .where('authorId', '==', userid)
    .orderBy('createdAt', 'desc')
    .get();

  const sites = [];

  snapshot.forEach((doc) => {
    const data = {
      id: doc.id,
      ...doc.data()
    };
    data['createdAt'] = format(doc.data().createdAt.toDate(), 'MMM d yyyy');
    sites.push(data);
  });

  return sites;
}
