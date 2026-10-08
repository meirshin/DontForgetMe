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

async function renderApp() {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const press = (testID: string) =>
    ReactTestRenderer.act(() => {
      renderer.root.findAllByProps({ testID })[0].props.onPress();
    });
  const find = (testID: string) => renderer.root.findAllByProps({ testID })[0];
  return { press, find };
}

test('monitoring switch on the home screen applies immediately', async () => {
  const native = require('../specs/NativeCarBluetooth').default;
  const { find } = await renderApp();

  await ReactTestRenderer.act(() => {
    find('monitoring').props.onValueChange(false);
  });

  expect(native.setEnabled).toHaveBeenCalledWith(false);
});

test('save is enabled only with unsaved changes and confirms with a popup', async () => {
  const { Alert } = require('react-native');
  const native = require('../specs/NativeCarBluetooth').default;
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const { press, find } = await renderApp();

  await press('openSettings');
  expect(find('save').props.disabled).toBe(true);

  await press('delayPlus');
  expect(find('save').props.disabled).toBe(false);

  await press('save');
  expect(native.setDelayMinutes).toHaveBeenCalledWith(6);
  expect(native.setSelectedDevices).toHaveBeenCalledWith([]);
  expect(alert).toHaveBeenCalledWith(
    "Don't Forget Me",
    'Your settings have been saved.',
  );
  expect(find('save').props.disabled).toBe(true);
});
