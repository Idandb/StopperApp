import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function createUser(uid, deviceId) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, { createdAt: serverTimestamp() });
  }

  if (deviceId) {
    const deviceRef = doc(db, 'devices', deviceId);
    const deviceSnap = await getDoc(deviceRef);
    if (!deviceSnap.exists()) {
      await setDoc(deviceRef, { createdAt: serverTimestamp() });
    }
  }
}
