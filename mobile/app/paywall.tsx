import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Purchases from 'react-native-purchases';

export default function Paywall() {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.availablePackages[0];
      if (!pkg) throw new Error('No package available');
      await Purchases.purchasePackage(pkg);
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('שגיאה', 'הרכישה נכשלה, נסה שוב.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GymStopper Pro</Text>
      <Text style={styles.description}>
        קבל גישה מלאה לכל תכונות האפליקציה.{'\n'}
        טיימר מנוחה חכם שיעזור לך להתאמן טוב יותר.
      </Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={handlePurchase} disabled={loading}>
        <Text style={styles.primaryBtnText}>
          {loading ? 'טוען...' : 'התחל ניסיון חינם של 7 ימים'}
        </Text>
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
