/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

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

test('saves settings and confirms with a popup', async () => {
  const { Alert } = require('react-native');
  const native = require('../specs/NativeCarBluetooth').default;
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(() => {
    renderer.root.findAllByProps({ testID: 'save' })[0].props.onPress();
  });

  expect(native.setDelayMinutes).toHaveBeenCalledWith(5);
  expect(native.setSelectedDevices).toHaveBeenCalledWith([]);
  expect(alert).toHaveBeenCalledWith(
    "Don't Forget Me",
    'Your settings have been saved.',
  );
});
