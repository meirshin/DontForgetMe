# Don't Forget Me (אל תשכח אותי)

Android app (React Native) that reminds the driver to check the back seat for a child after leaving the car.

## How it works

- Pick your car's Bluetooth device(s) from the list of paired devices in **Settings**. Devices recognized as a car (car audio / hands-free) are monitored by default and can be switched off like any other device.
- When the phone disconnects from the car, a reminder is scheduled after N minutes (default 2, configurable 1-60).
- If the phone reconnects to the car before that, the reminder is cancelled.
- The notification asks "Did you forget a child in the car?" with **All good** / **Remind me in a minute** buttons.
- The reminder plays one of 10 sounds (or the phone's alarm sound) on the alarm stream, at a volume chosen in **Settings**. By default it raises the phone's alarm volume while it plays and restores it afterwards, so the reminder is heard even when the phone is quiet.
- Detection runs natively (`BroadcastReceiver` for `ACL_CONNECTED` / `ACL_DISCONNECTED`), so it works even when the app is closed - no persistent background service is needed.
- UI and notifications come in 17 languages (English, Hebrew, Arabic, Chinese, Spanish, French, Italian, Portuguese, German, Russian, Turkish, Hindi, Bengali, Indonesian, Vietnamese, Japanese, Korean). The phone's language is used by default (English if it isn't one of them) and can be changed in **Settings**. Hebrew and Arabic are laid out right-to-left.
- On first launch the user accepts a safety notice: the app is a reminder aid only, not a safety system. The full terms are in **Settings**. The legal texts are drafts pending legal review.

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

## Design

- Hebrew is laid out right-to-left and English left-to-right; light and dark mode follow the system.
- Fonts: Rubik (Latin, Hebrew, Cyrillic), Cairo (Arabic), Noto Sans Devanagari / Bengali (Hindi / Bengali) and Material Symbols Rounded (icons), in `android/app/src/main/assets/fonts`. Chinese, Japanese, Korean and Vietnamese use the phone's fonts.
- Reminder sounds: `android/app/src/main/res/raw` (composed with Lyria, see [scripts/brand/README.md](scripts/brand/README.md)).
- Logo, launcher icons, illustrations and store graphics: see [scripts/brand/README.md](scripts/brand/README.md).

## Structure

- `App.tsx` - app state, permissions and navigation between the screens
- `src/screens/` - home and settings screens
- `src/ui/` - shared components (buttons, toggle, toast, animations)
- `src/theme.ts` - colors, fonts and spacing for light and dark mode
- `src/i18n/` - texts, one file per language (`en.ts` is the source)
- `specs/NativeCarBluetooth.ts` - Turbo Native Module spec
- `android/app/src/main/java/com/dontforgetme/`
  - `BluetoothReceiver.kt` - car connect / disconnect detection
  - `Reminder.kt`, `ReminderReceiver.kt` - alarm scheduling and notification
  - `AlertSound.kt` - reminder sound and alarm volume
  - `CarBluetoothModule.kt` - native module used by the UI
  - `Prefs.kt` - stored settings
