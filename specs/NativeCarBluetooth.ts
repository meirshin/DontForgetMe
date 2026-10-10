import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type PairedDevice = {
  name: string;
  address: string;
  isCar: boolean;
};

export type MonitorSettings = {
  enabled: boolean;
  delayMinutes: number;
  selectedDevices: Array<string>;
  /** Reminder sound id, see AlertSound.kt ('system' = the phone's alarm sound). */
  sound: string;
  /** Reminder volume, 10-100 (percent). */
  volume: number;
  /** Raise the phone's alarm volume while the reminder plays. */
  overrideVolume: boolean;
  /** The user's own reminder text, or '' for the default message. */
  message: string;
};

export type SystemStatus = {
  exactAlarms: boolean;
  batteryUnrestricted: boolean;
};

export interface Spec extends TurboModule {
  getPairedDevices(): Promise<Array<PairedDevice>>;
  getSettings(): Promise<MonitorSettings>;
  setEnabled(enabled: boolean): void;
  setDelayMinutes(minutes: number): void;
  setSelectedDevices(addresses: Array<string>): void;
  setSound(sound: string): void;
  setVolume(volume: number): void;
  setOverrideVolume(enabled: boolean): void;
  setMessage(message: string): void;
  previewSound(sound: string, volume: number, overrideVolume: boolean): void;
  stopSound(): void;
  getSystemStatus(): Promise<SystemStatus>;
  openExactAlarmSettings(): void;
  requestIgnoreBatteryOptimizations(): void;
  getDeviceLanguage(): string;
  /** The app language chosen in the settings, or '' to follow the phone. */
  getLanguage(): string;
  setLanguage(language: string): void;
  /** Whether the user accepted the safety notice and terms of use. */
  isDisclaimerAccepted(): boolean;
  acceptDisclaimer(): void;
  testReminder(seconds: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeCarBluetooth');
