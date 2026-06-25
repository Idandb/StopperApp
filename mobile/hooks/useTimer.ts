import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useTimer(durationSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const scheduleNotification = async (endTime: number) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const seconds = Math.max(1, Math.round((endTime - Date.now()) / 1000));
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'זמן המנוחה נגמר!',
        body: 'לחץ "התחל מחדש" להתחלת הסט הבא',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        channelId: 'timer-channel',
      },
    });
  };

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active' && isRunning && endTimeRef.current) {
        const remaining = Math.round((endTimeRef.current - Date.now()) / 1000);
        if (remaining <= 0) {
          clearTimer();
          setSecondsLeft(0);
          setIsRunning(false);
          setIsFinished(true);
        } else {
          setSecondsLeft(remaining);
        }
      }
    };
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning]);

  const start = useCallback(() => {
    const endTime = Date.now() + durationSeconds * 1000;
    endTimeRef.current = endTime;
    setSecondsLeft(durationSeconds);
    setIsFinished(false);
    setIsRunning(true);
    scheduleNotification(endTime);
  }, [durationSeconds]);

  const restart = useCallback(() => {
    clearTimer();
    const endTime = Date.now() + durationSeconds * 1000;
    endTimeRef.current = endTime;
    setSecondsLeft(durationSeconds);
    setIsFinished(false);
    setIsRunning(true);
    scheduleNotification(endTime);
  }, [durationSeconds]);

  const cancel = useCallback(() => {
    clearTimer();
    endTimeRef.current = null;
    setSecondsLeft(durationSeconds);
    setIsRunning(false);
    setIsFinished(false);
    Notifications.cancelAllScheduledNotificationsAsync();
  }, [durationSeconds]);

  return { secondsLeft, isRunning, isFinished, start, restart, cancel };
}
