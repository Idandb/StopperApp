import { useState, useEffect, useRef, useCallback } from 'react';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useTimer(durationSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const triggerNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'זמן המנוחה נגמר!',
        body: 'לחץ "התחל מחדש" להתחלת הסט הבא',
        sound: true,
      },
      trigger: null,
    });
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          setIsFinished(true);
          triggerNotification();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning]);

  const start = useCallback(() => {
    setSecondsLeft(durationSeconds);
    setIsFinished(false);
    setIsRunning(true);
  }, [durationSeconds]);

  const restart = useCallback(() => {
    clearTimer();
    setSecondsLeft(durationSeconds);
    setIsFinished(false);
    setIsRunning(true);
  }, [durationSeconds]);

  return { secondsLeft, isRunning, isFinished, start, restart };
}
