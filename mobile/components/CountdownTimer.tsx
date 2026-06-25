import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  secondsLeft: number;
  isFinished: boolean;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function CountdownTimer({ secondsLeft, isFinished }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.time, isFinished && styles.finished]}>
        {isFinished ? '00:00' : formatTime(secondsLeft)}
      </Text>
      {isFinished && <Text style={styles.doneText}>זמן המנוחה נגמר!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  time: {
    fontSize: 96,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: 4,
  },
  finished: {
    color: '#FF6B6B',
  },
  doneText: {
    fontSize: 20,
    color: '#FF6B6B',
    marginTop: 8,
  },
});
