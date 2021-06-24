import firebase from 'lib/firebase';

export interface Feedback {
  authorId: string;
  createdAt:
    | firebase.firestore.FieldValue
    | number
    | firebase.firestore.Timestamp;
  author: string;
  provider: string;
  rating: number;
  siteId: string;
  status: string;
  text: string;
  id: string;
}
