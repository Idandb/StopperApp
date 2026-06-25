import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
  label?: string;
};

export function RestartButton({ onPress, label = 'התחל מחדש' }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 50,
    marginTop: 40,
  },
  label: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
});
