import Purchases from 'react-native-purchases';

export function initRevenueCat() {
  const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
  if (!apiKey) return;
  Purchases.configure({ apiKey });
}

export async function loginRevenueCat(uid) {
  try {
    await Purchases.logIn(uid);
  } catch {
    // non-critical — entitlements still work via restore
  }
}
