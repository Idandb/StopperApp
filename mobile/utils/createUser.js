import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function createUser(uid) {
  const ref = doc(db, 'users', uid);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return;
  await setDoc(ref, { createdAt: serverTimestamp() });
}
