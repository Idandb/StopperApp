import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { initRevenueCat } from '../utils/revenueCat';

GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });

export default function RootLayout() {
  useEffect(() => {
    initRevenueCat();
  }, []);

  return <Slot />;
}
