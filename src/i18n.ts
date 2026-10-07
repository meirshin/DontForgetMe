import NativeCarBluetooth from '../specs/NativeCarBluetooth';

const en = {
  appTitle: "Don't Forget Me",
  subtitle:
    "Get a reminder to check the back seat a few minutes after you disconnect from your car's Bluetooth.",
  monitoring: 'Monitoring active',
  permissionsTitle: 'Permissions',
  permBluetooth: 'Bluetooth access',
  permNotifications: 'Notifications',
  permExactAlarms: 'On-time reminders (exact alarms)',
  permBattery: 'Run without battery restrictions',
  allow: 'Allow',
  granted: 'OK',
  allGranted: '✓ All permissions granted',
  delayTitle: 'Remind me after',
  minutes: (n: number) => (n === 1 ? '1 minute' : `${n} minutes`),
  devicesTitle: 'Car Bluetooth devices',
  devicesHint: "Select your car's Bluetooth device(s).",
  noDevices: 'No paired devices found. Pair your phone with the car first.',
  needBluetooth: 'Allow Bluetooth access to see your devices.',
  noneSelected: 'Select at least one car device to start monitoring.',
  carTag: 'Car',
  refresh: 'Refresh',
  test: 'Send a test reminder (10 seconds)',
  testSent: 'A test reminder will appear in 10 seconds.',
  save: 'Save settings',
  saved: 'Your settings have been saved.',
  unsaved: 'You have unsaved changes.',
  privacyPolicy: 'Privacy policy',
  privacyUrl: 'https://ym987.github.io/DontForgetMe/privacy/',
};

const he: typeof en = {
  appTitle: 'אל תשכח אותי',
  subtitle:
    'קבל תזכורת לבדוק את המושב האחורי כמה דקות אחרי שהטלפון מתנתק מהבלוטוס של הרכב.',
  monitoring: 'ניטור פעיל',
  permissionsTitle: 'הרשאות',
  permBluetooth: 'גישה לבלוטוס',
  permNotifications: 'התראות',
  permExactAlarms: 'תזכורות בזמן מדויק',
  permBattery: 'פעולה ללא הגבלת סוללה',
  allow: 'אפשר',
  granted: 'תקין',
  allGranted: '✓ כל ההרשאות עודכנו',
  delayTitle: 'הזכר לי אחרי',
  minutes: (n: number) => (n === 1 ? 'דקה אחת' : `${n} דקות`),
  devicesTitle: 'מכשירי הבלוטוס של הרכב',
  devicesHint: 'בחר את מכשיר/י הבלוטוס של הרכב.',
  noDevices: 'לא נמצאו מכשירים מצומדים. צמד קודם את הטלפון לרכב.',
  needBluetooth: 'אפשר גישה לבלוטוס כדי לראות את המכשירים.',
  noneSelected: 'בחר לפחות מכשיר רכב אחד כדי להתחיל בניטור.',
  carTag: 'רכב',
  refresh: 'רענן',
  test: 'שלח תזכורת לבדיקה (10 שניות)',
  testSent: 'תזכורת בדיקה תופיע בעוד 10 שניות.',
  save: 'שמור הגדרות',
  saved: 'ההגדרות נשמרו בהצלחה.',
  unsaved: 'יש שינויים שלא נשמרו.',
  privacyPolicy: 'מדיניות פרטיות',
  privacyUrl: 'https://ym987.github.io/DontForgetMe/he/privacy/',
};

const lang = NativeCarBluetooth.getDeviceLanguage();

export const t = lang === 'he' || lang === 'iw' ? he : en;
