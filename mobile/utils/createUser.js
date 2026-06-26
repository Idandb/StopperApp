import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as SecureStore from 'expo-secure-store';
import { db } from '../firebaseConfig';

const TRIAL_END_KEY = 'stopper_trial_end';
const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

export async function createUser(uid) {
  const ref = doc(db, 'users', uid);
  const snapshot = await getDoc(ref);
  let trialEndMs;
  if (snapshot.exists()) {
    trialEndMs = snapshot.data().createdAt.toDate().getTime() + TRIAL_DURATION_MS;
  } else {
    await setDoc(ref, { createdAt: serverTimestamp() });
    trialEndMs = Date.now() + TRIAL_DURATION_MS;
  }
  await SecureStore.setItemAsync(TRIAL_END_KEY, String(trialEndMs));
}
