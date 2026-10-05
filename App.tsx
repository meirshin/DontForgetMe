/**
 * Don't Forget Me - reminds the driver to check the back seat after
 * disconnecting from the car's Bluetooth.
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  Linking,
  Permission,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import NativeCarBluetooth, {
  type PairedDevice,
} from './specs/NativeCarBluetooth';
import { t } from './src/i18n';

const MIN_DELAY = 1;
const MAX_DELAY = 60;
const TEST_SECONDS = 10;

const colors = {
  bg: '#F4F6FA',
  card: '#FFFFFF',
  primary: '#E8590C',
  text: '#1F2933',
  muted: '#6B7280',
  ok: '#2F9E44',
  warn: '#E03131',
  border: '#E5E7EB',
};

const apiLevel = Platform.Version as number;
const BLUETOOTH = PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT;
const NOTIFICATIONS = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;

type PermKey = 'bluetooth' | 'notifications' | 'exactAlarms' | 'battery';
type PermState = Record<PermKey, boolean>;

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
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <HomeScreen />
    </SafeAreaProvider>
  );
}

function HomeScreen() {
  const [enabled, setEnabled] = useState(true);
  const [delay, setDelay] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [devices, setDevices] = useState<PairedDevice[]>([]);
  const [perms, setPerms] = useState<PermState | null>(null);

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
  }, []);

  useEffect(() => {
    NativeCarBluetooth.getSettings().then(s => {
      setEnabled(s.enabled);
      setDelay(s.delayMinutes);
      setSelected(s.selectedDevices);
    });
    PermissionsAndroid.requestMultiple(runtimePermissions()).finally(refresh);
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const toggleEnabled = (value: boolean) => {
    setEnabled(value);
    NativeCarBluetooth.setEnabled(value);
  };

  const changeDelay = (diff: number) => {
    const value = Math.min(MAX_DELAY, Math.max(MIN_DELAY, delay + diff));
    setDelay(value);
    NativeCarBluetooth.setDelayMinutes(value);
  };

  const toggleDevice = (address: string) => {
    const next = selected.includes(address)
      ? selected.filter(a => a !== address)
      : [...selected, address];
    setSelected(next);
    NativeCarBluetooth.setSelectedDevices(next);
  };

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

  const sendTest = () => {
    NativeCarBluetooth.testReminder(TEST_SECONDS);
    Alert.alert(t.appTitle, t.testSent);
  };

  const permRows: { key: PermKey; label: string }[] = [
    { key: 'bluetooth', label: t.permBluetooth },
    { key: 'notifications', label: t.permNotifications },
    { key: 'exactAlarms', label: t.permExactAlarms },
    { key: 'battery', label: t.permBattery },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t.appTitle}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t.monitoring}</Text>
            <Switch
              value={enabled}
              onValueChange={toggleEnabled}
              trackColor={{ true: colors.primary }}
            />
          </View>
          {enabled && selected.length === 0 && (
            <Text style={styles.warning}>{t.noneSelected}</Text>
          )}
        </View>

        {perms && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.permissionsTitle}</Text>
            {permRows.map(({ key, label }) => (
              <View key={key} style={styles.row}>
                <Text style={styles.rowLabel}>{label}</Text>
                {perms[key] ? (
                  <Text style={styles.ok}>{t.granted}</Text>
                ) : (
                  <Pressable
                    style={styles.smallButton}
                    onPress={() => fixPermission(key)}
                  >
                    <Text style={styles.smallButtonText}>{t.allow}</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.delayTitle}</Text>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepButton}
              onPress={() => changeDelay(-1)}
            >
              <Text style={styles.stepButtonText}>−</Text>
            </Pressable>
            <Text style={styles.delayValue}>{t.minutes(delay)}</Text>
            <Pressable
              style={styles.stepButton}
              onPress={() => changeDelay(1)}
            >
              <Text style={styles.stepButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>{t.devicesTitle}</Text>
            <Pressable onPress={refresh}>
              <Text style={styles.link}>{t.refresh}</Text>
            </Pressable>
          </View>
          <Text style={styles.hint}>
            {!perms?.bluetooth
              ? t.needBluetooth
              : devices.length === 0
              ? t.noDevices
              : t.devicesHint}
          </Text>
          {devices.map(d => (
            <Pressable
              key={d.address}
              style={styles.row}
              onPress={() => toggleDevice(d.address)}
            >
              <View style={styles.deviceInfo}>
                <Text style={styles.rowLabel}>{d.name}</Text>
                {d.isCar && <Text style={styles.tag}>{t.carTag}</Text>}
              </View>
              <Switch
                value={selected.includes(d.address)}
                onValueChange={() => toggleDevice(d.address)}
                trackColor={{ true: colors.primary }}
              />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.button} onPress={sendTest}>
          <Text style={styles.buttonText}>{t.test}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: { fontSize: 15, color: colors.text, flexShrink: 1 },
  deviceInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  tag: {
    fontSize: 12,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  hint: { fontSize: 13, color: colors.muted },
  warning: { fontSize: 13, color: colors.warn },
  ok: { fontSize: 14, color: colors.ok, fontWeight: '600' },
  link: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  smallButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  smallButtonText: { color: '#FFFFFF', fontWeight: '600' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  delayValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    minWidth: 110,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.text,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});

export default App;
