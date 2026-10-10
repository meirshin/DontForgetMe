/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Animations run on timers; keep them from firing after a test has finished.
jest.useFakeTimers();

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('../specs/NativeCarBluetooth', () => ({
  __esModule: true,
  default: {
    getDeviceLanguage: () => 'en',
    getLanguage: () => '',
    setLanguage: jest.fn(),
    isDisclaimerAccepted: jest.fn(() => true),
    acceptDisclaimer: jest.fn(),
    getSettings: () =>
      Promise.resolve({
        enabled: true,
        delayMinutes: 5,
        selectedDevices: [],
        sound: 'chimes',
        volume: 90,
        overrideVolume: true,
        message: '',
      }),
    getSystemStatus: () =>
      Promise.resolve({ exactAlarms: true, batteryUnrestricted: true }),
    getPairedDevices: () => Promise.resolve([]),
    setEnabled: jest.fn(),
    setDelayMinutes: jest.fn(),
    setSelectedDevices: jest.fn(),
    openExactAlarmSettings: jest.fn(),
    requestIgnoreBatteryOptimizations: jest.fn(),
    testReminder: jest.fn(),
    setSound: jest.fn(),
    setVolume: jest.fn(),
    setOverrideVolume: jest.fn(),
    setMessage: jest.fn(),
    previewSound: jest.fn(),
    stopSound: jest.fn(),
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
  const hasText = (text: string) =>
    renderer.root.findAll(n => n.props.children === text).length > 0;
  return { press, find, hasText, root: renderer.root };
}

test('monitoring switch on the home screen applies immediately', async () => {
  const native = require('../specs/NativeCarBluetooth').default;
  const { find } = await renderApp();

  await ReactTestRenderer.act(() => {
    find('monitoring').props.onValueChange(false);
  });

  expect(native.setEnabled).toHaveBeenCalledWith(false);
});

test('save is enabled only with unsaved changes and confirms with a toast', async () => {
  const native = require('../specs/NativeCarBluetooth').default;
  const { press, find, hasText } = await renderApp();

  await press('openSettings');
  expect(find('save').props.disabled).toBe(true);

  await press('delayPlus');
  expect(find('save').props.disabled).toBe(false);

  await press('save');
  expect(native.setDelayMinutes).toHaveBeenCalledWith(6);
  expect(native.setSelectedDevices).toHaveBeenCalledWith([]);
  expect(hasText('Your settings have been saved.')).toBe(true);
  expect(find('save').props.disabled).toBe(true);
});

test('leaving settings with unsaved changes asks first', async () => {
  const native = require('../specs/NativeCarBluetooth').default;
  native.setDelayMinutes.mockClear();
  const { press, find, hasText } = await renderApp();

  await press('openSettings');
  await press('delayMinus');
  await press('back');
  expect(hasText('Save your changes before leaving?')).toBe(true);
  expect(find('save')).toBeDefined();
  expect(native.setDelayMinutes).not.toHaveBeenCalled();
});

test('sends a test reminder', async () => {
  const native = require('../specs/NativeCarBluetooth').default;
  const { press, root, hasText } = await renderApp();

  await press('openSettings');
  await ReactTestRenderer.act(() => {
    root
      .findAll(n => n.props.title === 'Send a test reminder (10 seconds)')[0]
      .props.onPress();
  });
  expect(native.testReminder).toHaveBeenCalledWith(10);
  expect(hasText('A test reminder will appear in 10 seconds.')).toBe(true);
});

test('sound settings are saved together with the other settings', async () => {
  const native = require('../specs/NativeCarBluetooth').default;
  const { press, find } = await renderApp();

  await press('openSettings');
  await ReactTestRenderer.act(() => {
    find('overrideVolume').props.onValueChange(false);
  });
  expect(find('save').props.disabled).toBe(false);

  await press('save');
  expect(native.setSound).toHaveBeenCalledWith('chimes');
  expect(native.setVolume).toHaveBeenCalledWith(90);
  expect(native.setOverrideVolume).toHaveBeenCalledWith(false);
});

test('the reminder message can be customized and restored', async () => {
  const native = require('../specs/NativeCarBluetooth').default;
  const { press, find, root } = await renderApp();

  await press('openSettings');
  expect(find('message').props.placeholder).toBe(
    'You left the car a few minutes ago. Did you forget a child in the car?',
  );
  await ReactTestRenderer.act(() => {
    find('message').props.onChangeText('  Take the groceries  ');
  });
  expect(find('save').props.disabled).toBe(false);
  await press('save');
  expect(native.setMessage).toHaveBeenCalledWith('Take the groceries');

  // Back to the default: the field is emptied and saving stores ''.
  await press('resetMessage');
  expect(find('message').props.value).toBe('');
  expect(root.findAllByProps({ testID: 'resetMessage' })).toHaveLength(0);
  await press('save');
  expect(native.setMessage).toHaveBeenLastCalledWith('');
});

test('switching the language applies at once, right-to-left for Hebrew', async () => {
  const native = require('../specs/NativeCarBluetooth').default;
  const { press, root, hasText } = await renderApp();

  await press('openSettings');
  await press('language');
  await press('lang-he');

  expect(native.setLanguage).toHaveBeenCalledWith('he');
  expect(hasText('הגדרות')).toBe(true);
  const rtlRoots = root.findAll(
    n =>
      typeof n.type === 'string' &&
      [n.props.style].flat(Infinity).some((st: any) => st?.direction === 'rtl'),
  );
  expect(rtlRoots.length).toBeGreaterThan(0);
});

test('on first launch the safety notice must be accepted before permissions are requested', async () => {
  const native = require('../specs/NativeCarBluetooth').default;
  const { PermissionsAndroid } = require('react-native');
  const request = jest
    .spyOn(PermissionsAndroid, 'requestMultiple')
    .mockResolvedValue({});
  native.isDisclaimerAccepted.mockReturnValueOnce(false);
  const { press, find } = await renderApp();

  // Let the intro animation finish (it runs in two stages).
  for (let i = 0; i < 4; i++) {
    await ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(1000);
    });
  }
  expect(request).not.toHaveBeenCalled();
  expect(find('acceptLegal')).toBeDefined();

  await press('acceptLegal');
  expect(native.acceptDisclaimer).toHaveBeenCalled();
  expect(request).toHaveBeenCalled();
  request.mockRestore();
});
