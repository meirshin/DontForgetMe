# Don't Forget Me (אל תשכח אותי)

Android app (React Native) that reminds the driver to check the back seat for a child after leaving the car.

## How it works

- Pick your car's Bluetooth device(s) from the list of paired devices.
- When the phone disconnects from the car, a reminder is scheduled after N minutes (default 5, configurable 1-60).
- If the phone reconnects to the car before that, the reminder is cancelled.
- The notification asks "Did you forget a child in the car?" with **All good** / **Remind me in a minute** buttons.
- Detection runs natively (`BroadcastReceiver` for `ACL_CONNECTED` / `ACL_DISCONNECTED`), so it works even when the app is closed - no persistent background service is needed.
- UI and notifications are in Hebrew or English according to the device language.

## Permissions

| Permission | Why |
| --- | --- |
| Bluetooth (Nearby devices) | List paired devices and receive connect/disconnect events |
| Notifications | Show the reminder |
| Exact alarms | Fire the reminder on time |
| Battery optimization exemption | Prevent the system from delaying the reminder |

On some manufacturers (Xiaomi, Huawei, Samsung, etc.) you may also need to allow "Autostart" / disable "Sleeping apps" for the app.

## Development

```sh
npm install
npm start          # Metro
npm run android    # build & install on a device/emulator
```

Release APK: `cd android && ./gradlew assembleRelease`.

## Structure

- `App.tsx` - settings screen
- `src/i18n.ts` - Hebrew / English texts
- `specs/NativeCarBluetooth.ts` - Turbo Native Module spec
- `android/app/src/main/java/com/dontforgetme/`
  - `BluetoothReceiver.kt` - car connect / disconnect detection
  - `Reminder.kt`, `ReminderReceiver.kt` - alarm scheduling and notification
  - `CarBluetoothModule.kt` - native module used by the UI
  - `Prefs.kt` - stored settings
