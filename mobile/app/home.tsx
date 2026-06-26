import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { CountdownTimer } from '../components/CountdownTimer';
import { RestartButton } from '../components/RestartButton';
import { useTimer } from '../hooks/useTimer';

const SESSION_KEY = 'stopper_user_token';

const DURATIONS = [
  { label: '0:30', seconds: 30 },
  { label: '1:00', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2:00', seconds: 120 },
  { label: '3:00', seconds: 180 },
];

export default function Home() {
  const [selectedDuration, setSelectedDuration] = useState(90);
  const { secondsLeft, isRunning, isFinished, start, restart, cancel } =
    useTimer(selectedDuration);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.actionIdentifier === 'cancel') {
        cancel();
        Notifications.dismissAllNotificationsAsync();
      }
    });
    return () => sub.remove();
  }, [cancel]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stopper</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>התנתק</Text>
      </TouchableOpacity>

      {isRunning && (
        <TouchableOpacity style={styles.cancelBtn} onPress={cancel}>
          <Text style={styles.cancelText}>✕</Text>
        </TouchableOpacity>
      )}

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
  logoutBtn: {
    position: 'absolute',
    top: 60,
    left: 24,
  },
  logoutText: {
    color: '#aaa',
    fontSize: 15,
  },
  cancelBtn: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#aaa',
    fontSize: 18,
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
