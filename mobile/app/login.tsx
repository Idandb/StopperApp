import { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { createUser } from '../utils/createUser';

const SESSION_KEY = 'stopper_user_token';

async function handleSuccess(uid: string) {
  await SecureStore.setItemAsync(SESSION_KEY, uid);
  await createUser(uid);
  router.replace('/');
}

export default function Login() {
  const [error, setError] = useState('');

  const handleApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      await handleSuccess(credential.user);
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        setError('התחברות עם Apple נכשלה, נסה שוב.');
      }
    }
  };

  const handleGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      if (!data?.user?.id) throw new Error('No user id');
      await handleSuccess(data.user.id);
    } catch {
      Alert.alert('שגיאה', 'התחברות עם Google נכשלה, נסה שוב.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stopper</Text>
      <Text style={styles.subtitle}>טיימר מנוחה לאימון</Text>

      {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={12}
          style={styles.appleBtn}
          onPress={handleApple}
        />
      )}

      <GoogleSigninButton
        style={styles.googleBtn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogle}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 60,
  },
  appleBtn: {
    width: 240,
    height: 52,
    marginBottom: 16,
  },
  googleBtn: {
    width: 240,
    height: 52,
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 16,
    fontSize: 14,
  },
});
