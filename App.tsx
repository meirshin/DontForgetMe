/**
 * Don't Forget Me - reminds the driver to check the back seat after
 * disconnecting from the car's Bluetooth.
 *
 * @format
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  Easing,
  Linking,
  Permission,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NativeCarBluetooth, {
  type MonitorSettings,
  type PairedDevice,
} from './specs/NativeCarBluetooth';
import { I18nProvider, useI18n } from './src/i18n';
import { HomeScreen } from './src/screens/HomeScreen';
import {
  SettingsScreen,
  type SettingsDraft,
} from './src/screens/SettingsScreen';
import type { PermKey, PermState } from './src/screens/types';
import { ThemeContext, themes } from './src/theme';
import type { IconName } from './src/ui/Icon';
import { Intro } from './src/ui/Intro';
import { LegalSheet } from './src/ui/Legal';
import { Backdrop } from './src/ui/kit';
import { Toast, type ToastMessage } from './src/ui/Toast';

const apiLevel = Platform.Version as number;
const BLUETOOTH = PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT;
const NOTIFICATIONS = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;

function runtimePermissions(): Permission[] {
  const list: Permission[] = [];
  if (apiLevel >= 31) list.push(BLUETOOTH);
  if (apiLevel >= 33) list.push(NOTIFICATIONS);
  return list;
}

async function isGranted(permission: Permission, minApi: number) {
  return apiLevel < minApi || PermissionsAndroid.check(permission);
}

async function requestRuntime(permission: Permission) {
  const result = await PermissionsAndroid.request(permission);
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    await Linking.openSettings();
  }
}

function App() {
  const theme = useColorScheme() === 'dark' ? themes.dark : themes.light;
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <ThemeContext.Provider value={theme}>
          <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
          <Root />
        </ThemeContext.Provider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

/** Lays the whole app out right-to-left for Hebrew and Arabic. */
function Root() {
  const { rtl } = useI18n();
  return (
    <View style={[styles.root, { direction: rtl ? 'rtl' : 'ltr' }]}>
      <Backdrop />
      <Main />
    </View>
  );
}

function Main() {
  const [screen, setScreen] = useState<'home' | 'settings'>('home');
  const [settings, setSettings] = useState<MonitorSettings | null>(null);
  const [devices, setDevices] = useState<PairedDevice[]>([]);
  const [perms, setPerms] = useState<PermState | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [accepted, setAccepted] = useState(() =>
    NativeCarBluetooth.isDisclaimerAccepted(),
  );
  const { t, rtl } = useI18n();
  const enter = useRef(new Animated.Value(1)).current;

  const refresh = useCallback(async () => {
    const bluetooth = await isGranted(BLUETOOTH, 31);
    const notifications = await isGranted(NOTIFICATIONS, 33);
    const sys = await NativeCarBluetooth.getSystemStatus();
    setPerms({
      bluetooth,
      notifications,
      exactAlarms: sys.exactAlarms,
      battery: sys.batteryUnrestricted,
    });
    if (bluetooth) {
      const list = await NativeCarBluetooth.getPairedDevices();
      list.sort(
        (a, b) =>
          Number(b.isCar) - Number(a.isCar) || a.name.localeCompare(b.name),
      );
      setDevices(list);
    }
    // Reading the paired devices may add newly found cars to the monitored list.
    setSettings(await NativeCarBluetooth.getSettings());
  }, []);

  useEffect(() => {
    NativeCarBluetooth.getSettings().then(setSettings);
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  // Permissions are requested once the safety notice was accepted.
  useEffect(() => {
    if (!accepted) return;
    PermissionsAndroid.requestMultiple(runtimePermissions()).finally(refresh);
  }, [accepted, refresh]);

  const acceptDisclaimer = () => {
    NativeCarBluetooth.acceptDisclaimer();
    setAccepted(true);
  };

  const notify = useCallback((text: string, icon: IconName) => {
    setToast({ id: Date.now(), text, icon });
  }, []);
  const hideToast = useCallback(() => setToast(null), []);
  const finishIntro = useCallback(() => setIntroDone(true), []);

  const fixPermission = async (key: PermKey) => {
    switch (key) {
      case 'bluetooth':
        await requestRuntime(BLUETOOTH);
        break;
      case 'notifications':
        await requestRuntime(NOTIFICATIONS);
        break;
      case 'exactAlarms':
        NativeCarBluetooth.openExactAlarmSettings();
        break;
      case 'battery':
        NativeCarBluetooth.requestIgnoreBatteryOptimizations();
        break;
    }
    refresh();
  };

  /** Switches screens, sliding the new one in from the side it comes from. */
  const go = (next: 'home' | 'settings') => {
    setScreen(next);
    enter.setValue(0);
    Animated.timing(enter, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const intro = !introDone && (
    <Intro ready={settings !== null} onDone={finishIntro} />
  );
  if (!settings) return intro || null;

  const setEnabled = (enabled: boolean) => {
    NativeCarBluetooth.setEnabled(enabled);
    setSettings({ ...settings, enabled });
  };

  const save = (draft: SettingsDraft) => {
    NativeCarBluetooth.setDelayMinutes(draft.delayMinutes);
    NativeCarBluetooth.setSelectedDevices(draft.selectedDevices);
    NativeCarBluetooth.setSound(draft.sound);
    NativeCarBluetooth.setVolume(draft.volume);
    NativeCarBluetooth.setOverrideVolume(draft.overrideVolume);
    NativeCarBluetooth.setMessage(draft.message);
    setSettings({ ...settings, ...draft });
    notify(t.saved, 'check_circle');
  };

  // Settings come in from the end side, home from the start side.
  const from = (screen === 'settings' ? 48 : -48) * (rtl ? -1 : 1);

  return (
    <>
      <Animated.View
        style={[
          styles.root,
          {
            opacity: enter,
            transform: [
              {
                translateX: enter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [from, 0],
                }),
              },
            ],
          },
        ]}
      >
        {screen === 'home' ? (
          <HomeScreen
            settings={settings}
            devices={devices}
            perms={perms}
            onToggle={setEnabled}
            onFixPermission={fixPermission}
            onOpenSettings={() => go('settings')}
          />
        ) : (
          <SettingsScreen
            settings={settings}
            devices={devices}
            perms={perms}
            onRefresh={refresh}
            onSave={save}
            onBack={() => go('home')}
            notify={notify}
          />
        )}
      </Animated.View>
      <Toast message={toast} onHide={hideToast} />
      <LegalSheet
        visible={introDone && !accepted}
        onAccept={acceptDisclaimer}
      />
      {intro}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
