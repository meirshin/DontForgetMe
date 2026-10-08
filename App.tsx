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
  BackHandler,
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
  type MonitorSettings,
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
      <Main />
    </SafeAreaProvider>
  );
}

function Main() {
  const [screen, setScreen] = useState<'home' | 'settings'>('home');
  const [settings, setSettings] = useState<MonitorSettings | null>(null);
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
    // Reading the paired devices may add newly found cars to the monitored list.
    setSettings(await NativeCarBluetooth.getSettings());
  }, []);

  useEffect(() => {
    NativeCarBluetooth.getSettings().then(setSettings);
    PermissionsAndroid.requestMultiple(runtimePermissions()).finally(refresh);
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') refresh();
    });
    return () => sub.remove();
  }, [refresh]);

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

  if (!settings) return <SafeAreaView style={styles.screen} />;

  const setEnabled = (enabled: boolean) => {
    NativeCarBluetooth.setEnabled(enabled);
    setSettings({ ...settings, enabled });
  };

  const save = (delayMinutes: number, selectedDevices: string[]) => {
    NativeCarBluetooth.setDelayMinutes(delayMinutes);
    NativeCarBluetooth.setSelectedDevices(selectedDevices);
    setSettings({ ...settings, delayMinutes, selectedDevices });
    Alert.alert(t.appTitle, t.saved);
  };

  return screen === 'home' ? (
    <HomeScreen
      settings={settings}
      devices={devices}
      perms={perms}
      onToggle={setEnabled}
      onFixPermission={fixPermission}
      onOpenSettings={() => setScreen('settings')}
    />
  ) : (
    <SettingsScreen
      settings={settings}
      devices={devices}
      perms={perms}
      onRefresh={refresh}
      onSave={save}
      onBack={() => setScreen('home')}
    />
  );
}

type HomeProps = {
  settings: MonitorSettings;
  devices: PairedDevice[];
  perms: PermState | null;
  onToggle: (enabled: boolean) => void;
  onFixPermission: (key: PermKey) => void;
  onOpenSettings: () => void;
};

function HomeScreen({
  settings,
  devices,
  perms,
  onToggle,
  onFixPermission,
  onOpenSettings,
}: HomeProps) {
  const permRows: { key: PermKey; label: string }[] = [
    { key: 'bluetooth', label: t.permBluetooth },
    { key: 'notifications', label: t.permNotifications },
    { key: 'exactAlarms', label: t.permExactAlarms },
    { key: 'battery', label: t.permBattery },
  ];
  const allGranted = perms !== null && permRows.every(r => perms[r.key]);
  const watched = devices
    .filter(d => settings.selectedDevices.includes(d.address))
    .map(d => d.name)
    .join(', ');

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t.appTitle}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text
              style={[
                styles.statusLabel,
                { color: settings.enabled ? colors.ok : colors.warn },
              ]}
            >
              {settings.enabled ? t.monitoringOn : t.monitoringOff}
            </Text>
            <Switch
              testID="monitoring"
              value={settings.enabled}
              onValueChange={onToggle}
              trackColor={{ true: colors.primary }}
            />
          </View>
          {!settings.enabled ? (
            <Text style={styles.hint}>{t.monitoringOffHint}</Text>
          ) : settings.selectedDevices.length === 0 ? (
            <>
              <Text style={styles.warning}>{t.noneSelected}</Text>
              <Pressable onPress={onOpenSettings}>
                <Text style={styles.link}>{t.chooseDevices}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.hint}>
                {t.reminderAfter(settings.delayMinutes)}
              </Text>
              {watched !== '' && (
                <Text style={styles.hint}>{t.watching(watched)}</Text>
              )}
            </>
          )}
        </View>

        {perms && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.permissionsTitle}</Text>
            {allGranted && <Text style={styles.ok}>{t.allGranted}</Text>}
            {!allGranted && permRows.map(({ key, label }) => (
              <View key={key} style={styles.row}>
                <Text style={styles.rowLabel}>{label}</Text>
                {perms[key] ? (
                  <Text style={styles.ok}>{t.granted}</Text>
                ) : (
                  <Pressable
                    style={styles.smallButton}
                    onPress={() => onFixPermission(key)}
                  >
                    <Text style={styles.smallButtonText}>{t.allow}</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}

        <Pressable
          testID="openSettings"
          style={styles.saveButton}
          onPress={onOpenSettings}
        >
          <Text style={styles.buttonText}>{t.settings}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

type SettingsProps = {
  settings: MonitorSettings;
  devices: PairedDevice[];
  perms: PermState | null;
  onRefresh: () => void;
  onSave: (delayMinutes: number, selectedDevices: string[]) => void;
  onBack: () => void;
};

function SettingsScreen({
  settings,
  devices,
  perms,
  onRefresh,
  onSave,
  onBack,
}: SettingsProps) {
  const [delay, setDelay] = useState(settings.delayMinutes);
  // Devices the user switched since the last save (relative to the saved list),
  // so devices added in the background still show up correctly.
  const [toggled, setToggled] = useState<string[]>([]);

  const saved = settings.selectedDevices;
  const selected = [
    ...saved.filter(a => !toggled.includes(a)),
    ...toggled.filter(a => !saved.includes(a)),
  ];
  const dirty = delay !== settings.delayMinutes || toggled.length > 0;

  const changeDelay = (diff: number) => {
    setDelay(Math.min(MAX_DELAY, Math.max(MIN_DELAY, delay + diff)));
  };

  const toggleDevice = (address: string) => {
    setToggled(prev =>
      prev.includes(address)
        ? prev.filter(a => a !== address)
        : [...prev, address],
    );
  };

  const save = () => {
    onSave(delay, selected);
    setToggled([]);
  };

  const goBack = () => {
    if (!dirty) {
      onBack();
      return;
    }
    Alert.alert(t.unsavedTitle, t.unsavedPrompt, [
      { text: t.cancel, style: 'cancel' },
      { text: t.discard, style: 'destructive', onPress: onBack },
      {
        text: t.save,
        onPress: () => {
          save();
          onBack();
        },
      },
    ]);
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  });

  const sendTest = () => {
    NativeCarBluetooth.testReminder(TEST_SECONDS);
    Alert.alert(t.appTitle, t.testSent);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable testID="back" onPress={goBack} hitSlop={12}>
          <Text style={styles.link}>{t.back}</Text>
        </Pressable>
        <Text style={styles.title}>{t.settings}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.delayTitle}</Text>
          <View style={styles.stepper}>
            <Pressable
              testID="delayMinus"
              style={styles.stepButton}
              onPress={() => changeDelay(-1)}
            >
              <Text style={styles.stepButtonText}>−</Text>
            </Pressable>
            <Text style={styles.delayValue}>{t.minutes(delay)}</Text>
            <Pressable
              testID="delayPlus"
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
            <Pressable onPress={onRefresh}>
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

        <Pressable onPress={() => Linking.openURL(t.privacyUrl)}>
          <Text style={styles.footerLink}>{t.privacyPolicy}</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        {dirty && <Text style={styles.warning}>{t.unsaved}</Text>}
        <Pressable
          testID="save"
          disabled={!dirty}
          style={[styles.saveButton, !dirty && styles.savedButton]}
          onPress={save}
        >
          <Text style={[styles.buttonText, !dirty && styles.savedButtonText]}>
            {dirty ? t.save : t.allSaved}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  header: { paddingHorizontal: 16, paddingTop: 16, gap: 4 },
  footer: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  statusLabel: { fontSize: 18, fontWeight: '700', flexShrink: 1 },
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
  footerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
  },
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
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  savedButton: { backgroundColor: '#EBFBEE' },
  savedButtonText: { color: colors.ok },
  button: {
    backgroundColor: colors.text,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});

export default App;
