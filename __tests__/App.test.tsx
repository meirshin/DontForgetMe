/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../specs/NativeCarBluetooth', () => ({
  __esModule: true,
  default: {
    getDeviceLanguage: () => 'en',
    getSettings: () =>
      Promise.resolve({ enabled: true, delayMinutes: 5, selectedDevices: [] }),
    getSystemStatus: () =>
      Promise.resolve({ exactAlarms: true, batteryUnrestricted: true }),
    getPairedDevices: () => Promise.resolve([]),
    setEnabled: jest.fn(),
    setDelayMinutes: jest.fn(),
    setSelectedDevices: jest.fn(),
    openExactAlarmSettings: jest.fn(),
    requestIgnoreBatteryOptimizations: jest.fn(),
    testReminder: jest.fn(),
  },
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
