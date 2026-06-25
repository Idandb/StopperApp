import { useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { doc, getDoc } from 'firebase/firestore';
import Purchases from 'react-native-purchases';
import { db } from '../firebaseConfig';
import { isTrialActive } from '../utils/trialUtils';

const SESSION_KEY = 'stopper_user_token';

export default function Index() {
  useEffect(() => {
    const check = async () => {
      const uid = await SecureStore.getItemAsync(SESSION_KEY);
      if (!uid) {
        router.replace('/login');
        return;
      }

      const customerInfo = await Purchases.getCustomerInfo();
      if (Object.keys(customerInfo.entitlements.active).length > 0) {
        router.replace('/home');
        return;
      }

      const snapshot = await getDoc(doc(db, 'users', uid));
      if (snapshot.exists() && isTrialActive(snapshot.data().createdAt)) {
        router.replace('/home');
      } else {
        router.replace('/paywall');
      }
    };
    check();
  }, []);

  return null;
}
