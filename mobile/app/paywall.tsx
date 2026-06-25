import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Paywall() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GymStopper Pro</Text>
      <Text style={styles.description}>
        קבל גישה מלאה לכל תכונות האפליקציה.{'\n'}
        טיימר מנוחה חכם שיעזור לך להתאמן טוב יותר.
      </Text>

      <TouchableOpacity style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>התחל ניסיון חינם של 7 ימים</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn}>
        <Text style={styles.secondaryBtnText}>שחזור רכישות</Text>
      </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  primaryBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: 12,
  },
  secondaryBtnText: {
    color: '#aaa',
    fontSize: 15,
  },
});
