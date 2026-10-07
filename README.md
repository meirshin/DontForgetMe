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

### Release builds

```sh
npm run build:apk  # release APK (runs `gradlew.bat assembleRelease` in android/)
```

- Output: `android/app/build/outputs/apk/release/app-release.apk`.
- `build:apk` uses `gradlew.bat` and therefore runs on Windows only. On macOS/Linux run `cd android && ./gradlew assembleRelease`.
- For Google Play, build an App Bundle instead: `cd android && ./gradlew bundleRelease` (output: `android/app/build/outputs/bundle/release/app-release.aab`).
- Release builds are signed with the upload key when the Gradle properties `DFM_UPLOAD_STORE_FILE`, `DFM_UPLOAD_KEY_ALIAS`, `DFM_UPLOAD_STORE_PASSWORD` and `DFM_UPLOAD_KEY_PASSWORD` are set (e.g. in `~/.gradle/gradle.properties`); otherwise they fall back to the debug key.

## Website

`website/` is the app's home page and privacy policy (English + Hebrew), published to
https://ym987.github.io/DontForgetMe/ by `.github/workflows/website.yml`.
It is a separate Vite + React project, prerendered to static HTML at build time.

```sh
cd website
npm install
npm run dev        # http://localhost:5173/DontForgetMe/
npm run build      # static output in website/dist
```

When the app's data handling changes, update `website/src/content.ts` and `POLICY_UPDATED` in `website/src/site.ts`.

## Structure

- `App.tsx` - settings screen
- `src/i18n.ts` - Hebrew / English texts
- `specs/NativeCarBluetooth.ts` - Turbo Native Module spec
- `android/app/src/main/java/com/dontforgetme/`
  - `BluetoothReceiver.kt` - car connect / disconnect detection
  - `Reminder.kt`, `ReminderReceiver.kt` - alarm scheduling and notification
  - `CarBluetoothModule.kt` - native module used by the UI
  - `Prefs.kt` - stored settings
