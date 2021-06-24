/* eslint-disable @typescript-eslint/no-unused-vars */
import firebase from './firebase';
import { DocumentReference, DocumentData } from '@firebase/firestore-types';
import { User } from 'interfaces/User';
import { Site } from 'interfaces/Site';
import { Feedback } from 'interfaces/Feedback';

const firestore = firebase.firestore();

export function createUser(uid: string, data: User): Promise<void> {
  const { token, ...withoutToken } = data;
  return firestore
    .collection('users')
    .doc(uid)
    .set({ uid, ...withoutToken }, { merge: true });
}

export async function createSite(
  data: Site
): Promise<DocumentReference<DocumentData>> {
  delete data.id;
  return await firestore.collection('sites').add(data);
}

export async function createFeedback(
  data: Feedback
): Promise<DocumentReference<DocumentData>> {
  delete data.id;
  return await firestore.collection('feedback').add(data);
}
