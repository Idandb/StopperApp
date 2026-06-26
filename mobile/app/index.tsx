import { useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Purchases from 'react-native-purchases';
import { getDeviceId } from '../utils/deviceId';
import { loginRevenueCat } from '../utils/revenueCat';
import { isTrialActive } from '../utils/trialUtils';

const SESSION_KEY = 'stopper_user_token';

export default function Index() {
  useEffect(() => {
    const check = async () => {
      const uid = await SecureStore.getItemAsync(SESSION_KEY);
      if (!uid) { router.replace('/login'); return; }

      await loginRevenueCat(uid);

      const customerInfo = await Purchases.getCustomerInfo();
      if (Object.keys(customerInfo.entitlements.active).length > 0) {
        router.replace('/home'); return;
      }

      const deviceId = await getDeviceId();
      const trial = await isTrialActive(uid, deviceId);
      router.replace(trial ? '/home' : '/paywall');
    };
    check();
  }, []);

  return null;
}
