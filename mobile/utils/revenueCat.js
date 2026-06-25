import Purchases from 'react-native-purchases';

export function initRevenueCat() {
  Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY });
}
