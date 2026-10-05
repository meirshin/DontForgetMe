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
  getSystemStatus(): Promise<SystemStatus>;
  openExactAlarmSettings(): void;
  requestIgnoreBatteryOptimizations(): void;
  getDeviceLanguage(): string;
  testReminder(seconds: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeCarBluetooth');
