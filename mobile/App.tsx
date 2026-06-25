import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { CountdownTimer } from './components/CountdownTimer';
import { RestartButton } from './components/RestartButton';
import { useTimer } from './hooks/useTimer';

const SESSION_KEY = 'stopper_user_token';

const DURATIONS = [
  { label: '1:00', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2:00', seconds: 120 },
  { label: '3:00', seconds: 180 },
];

function TimerScreen() {
  const [selectedDuration, setSelectedDuration] = useState(90);
  const { secondsLeft, isRunning, isFinished, start, restart } =
    useTimer(selectedDuration);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stopper</Text>

      <CountdownTimer secondsLeft={secondsLeft} isFinished={isFinished} />

      {!isRunning && !isFinished && (
        <>
          <View style={styles.durationRow}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d.seconds}
                style={[
                  styles.durationBtn,
                  selectedDuration === d.seconds && styles.durationSelected,
                ]}
                onPress={() => setSelectedDuration(d.seconds)}
              >
                <Text
                  style={[
                    styles.durationText,
                    selectedDuration === d.seconds && styles.durationTextSelected,
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <RestartButton onPress={start} label="התחל" />
        </>
      )}

      {isFinished && <RestartButton onPress={restart} />}
    </View>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState('');

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      await SecureStore.setItemAsync(
        SESSION_KEY,
        credential.identityToken ?? credential.user
      );
      onLogin();
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        setError('ההתחברות נכשלה, נסה שוב');
      }
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
          onPress={handleAppleSignIn}
        />
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(SESSION_KEY).then((token) => {
      setIsLoggedIn(!!token);
    });
  }, []);

  if (isLoggedIn === null) return null;

  return (
    <>
      <StatusBar style="light" />
      {isLoggedIn ? (
        <TimerScreen />
      ) : (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
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
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 16,
    fontSize: 14,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  durationBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  durationSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  durationText: {
    color: '#aaa',
    fontSize: 16,
  },
  durationTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
