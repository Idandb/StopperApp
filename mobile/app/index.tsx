import { useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Purchases from 'react-native-purchases';

const SESSION_KEY = 'stopper_user_token';
const TRIAL_END_KEY = 'stopper_trial_end';

export default function Index() {
  useEffect(() => {
    const check = async () => {
      const uid = await SecureStore.getItemAsync(SESSION_KEY);
      if (!uid) { router.replace('/login'); return; }

      const customerInfo = await Purchases.getCustomerInfo();
      if (Object.keys(customerInfo.entitlements.active).length > 0) {
        router.replace('/home'); return;
      }

      const trialEndStr = await SecureStore.getItemAsync(TRIAL_END_KEY);
      const trialActive = trialEndStr ? Date.now() < Number(trialEndStr) : false;
      router.replace(trialActive ? '/home' : '/paywall');
    };
    check();
  }, []);

  return null;
}
