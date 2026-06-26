import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Onboarding() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ברוך הבא ל-Gym Stopper</Text>
      <Text style={styles.description}>
        יש לך 3 ימים של ניסיון חינמי. אחרי זה תוכל לרכוש גישה לתמיד.
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/home')}>
        <Text style={styles.btnText}>יאללה נתחיל</Text>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  btn: {
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
