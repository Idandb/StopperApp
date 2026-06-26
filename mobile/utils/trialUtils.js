import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export async function isTrialActive(uid, deviceId) {
  const dates = [];

  if (uid) {
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (userSnap.exists() && userSnap.data().createdAt) {
      dates.push(userSnap.data().createdAt.toDate().getTime());
    }
  }

  if (deviceId) {
    const deviceSnap = await getDoc(doc(db, 'devices', deviceId));
    if (deviceSnap.exists() && deviceSnap.data().createdAt) {
      dates.push(deviceSnap.data().createdAt.toDate().getTime());
    }
  }

  if (dates.length === 0) return false;
  const earliest = Math.min(...dates);
  return Date.now() - earliest < THREE_DAYS_MS;
}
