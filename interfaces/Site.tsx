import firebase from 'lib/firebase';

export interface Site {
  authorId: string;
  createdAt: firebase.firestore.FieldValue;
  name: string;
  link: string;
  id: string;
}
