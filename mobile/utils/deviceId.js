import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

const KEYCHAIN_SERVICE = 'com.gymStopper.app.deviceid';
const DEVICE_ID_KEY = 'stopper_device_id';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function getDeviceId() {
  if (Platform.OS === 'android') {
    return Application.androidId ?? null;
  }

  // iOS: stored in Keychain → survives app uninstall/reinstall
  let id = await SecureStore.getItemAsync(DEVICE_ID_KEY, {
    keychainService: KEYCHAIN_SERVICE,
  });
  if (!id) {
    id = generateId();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, id, {
      keychainService: KEYCHAIN_SERVICE,
    });
  }
  return id;
}
