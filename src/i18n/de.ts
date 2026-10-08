import type { Strings } from './en';

const nb = ' ';
const minutes = (n: number) => (n === 1 ? `1${nb}Minute` : `${n}${nb}Minuten`);

export const de: Strings = {
  appTitle: 'Vergissmeinnicht',
  subtitle:
    'Lass dich daran erinnern, die Rückbank zu prüfen – ein paar Minuten nachdem sich dein Handy vom Bluetooth deines Autos getrennt hat.',
  tagline: 'Kostenlos · Ohne Werbung · Ohne Anmeldung',

  statusActive: 'Aktiv',
  statusOff: 'Aus',
  statusSetup: 'Einrichtung nötig',
  monitoringOn: 'Überwachung aktiv',
  monitoringOff: 'Überwachung aus',
  monitoringToggle: 'Rückbank-Überwachung',
  monitoringOffHint:
    'Solange die Überwachung aus ist, bekommst du keine Erinnerungen.',
  setupTitle: 'Wähle dein Auto',
  noneSelected:
    'Wähle mindestens ein Gerät deines Autos aus, um die Überwachung zu starten.',
  chooseDevices: 'Geräte auswählen',
  reminderAfter: (n: number) =>
    `Die Erinnerung kommt ${minutes(n)} nach dem Trennen vom Auto.`,
  delayTile: 'Erinnerung nach',
  carsTile: 'Überwachte Autos',
  carsNone: 'Keine ausgewählt',
  minuteUnit: (n: number) => (n === 1 ? 'Minute' : 'Minuten'),
  minShort: (n: number) => `${n}${nb}Min.`,
  permissionsTitle: 'Berechtigungen',
  permissionsProgress: (granted: number, total: number) =>
    `${granted} von ${total}`,
  permBluetooth: 'Bluetooth-Zugriff',
  permBluetoothWhy: 'Erkennt, wenn du das Auto verlässt',
  permNotifications: 'Benachrichtigungen',
  permNotificationsWhy: 'Zeigt die Erinnerung an',
  permExactAlarms: 'Wecker und Erinnerungen',
  permExactAlarmsWhy: 'Damit die Erinnerung auf die Minute pünktlich kommt',
  permBattery: 'Ohne Akku-Einschränkungen ausführen',
  permBatteryWhy: 'Damit das System die Erinnerung nicht verzögert',
  allow: 'Zulassen',
  granted: 'OK',
  allGranted: 'Alle Berechtigungen erteilt',
  allGrantedHint: 'Alles bereit, damit Erinnerungen pünktlich ankommen.',
  howTitle: 'So funktioniert’s',
  steps: [
    { title: 'Fahren', text: 'Dein Handy verbindet sich mit dem Auto' },
    { title: 'Aussteigen', text: 'Bluetooth wird getrennt' },
    { title: 'Prüfen', text: 'Eine Erinnerung, nach hinten zu schauen' },
  ],

  settings: 'Einstellungen',
  back: 'Zurück',
  delayTitle: 'Erinnere mich nach',
  devicesTitle: 'Bluetooth-Geräte des Autos',
  devicesHint:
    'Wähle das Bluetooth-Gerät deines Autos (oder mehrere). Als Auto erkannte Geräte werden standardmäßig überwacht.',
  noDevices:
    'Keine gekoppelten Geräte gefunden. Kopple zuerst dein Handy mit dem Auto.',
  needBluetooth: 'Erlaube den Bluetooth-Zugriff, um deine Geräte zu sehen.',
  carTag: 'Auto',
  refresh: 'Aktualisieren',
  soundTitle: 'Erinnerungston',
  soundNames: {
    chimes: 'Glockenspiel',
    marimba: 'Marimba',
    harp: 'Harfe',
    musicbox: 'Spieluhr',
    bells: 'Glocken',
    piano: 'Klavier',
    pizzicato: 'Pizzicato',
    steeldrum: 'Steeldrum',
    synth: 'Synthesizer',
    chiptune: 'Arcade',
    system: 'Weckerton des Handys',
  },
  chooseSound: 'Ton auswählen',
  play: 'Abspielen',
  stop: 'Stopp',
  volume: 'Lautstärke',
  percent: (n: number) => `${n}${nb}%`,
  overrideVolume: 'Lauter als die Handy-Lautstärke',
  overrideVolumeHint:
    'Erhöht während der Erinnerung die Weckerlautstärke des Handys, auch wenn es auf lautlos gestellt ist.',
  done: 'Fertig',
  languageTitle: 'Sprache',
  languageAuto: 'Sprache des Handys',
  testTitle: 'Erinnerung testen',
  testHint:
    'Sende eine Test-Erinnerung, um zu prüfen, ob Ton und Benachrichtigung funktionieren.',
  test: 'Test-Erinnerung senden (10 Sek.)',
  testSent: 'In 10 Sekunden erscheint eine Test-Erinnerung.',
  save: 'Einstellungen speichern',
  saved: 'Deine Einstellungen wurden gespeichert.',
  allSaved: 'Alle Änderungen gespeichert',
  unsaved: 'Du hast ungespeicherte Änderungen.',
  unsavedTitle: 'Ungespeicherte Änderungen',
  unsavedPrompt: 'Änderungen vor dem Verlassen speichern?',
  discard: 'Ohne Speichern verlassen',
  cancel: 'Bleiben',
  privacyPolicy: 'Datenschutzerklärung',
  privacyUrl: 'https://ym987.github.io/DontForgetMe/privacy/',
  contactDesigner: 'E-Mail an den Designer',
  // Legal (draft, pending legal review)
  legalTitle: 'Wichtiger Sicherheitshinweis',
  legalPoints: [
    'Vergissmeinnicht ist nur eine Erinnerungshilfe. Die App ist kein Sicherheitssystem und kein lebensrettendes System und ersetzt nicht deine eigene Verantwortung und Aufmerksamkeit.',
    'Erinnerungen hängen von deinem Handy, Bluetooth, Berechtigungen, Akku-Einstellungen und dem Betriebssystem ab und können sich verzögern oder ganz ausbleiben.',
    'Prüfe die Rückbank jedes Mal selbst, wenn du das Auto verlässt. Verlass dich nie allein auf die App.',
    'Die App wird „wie besehen“ bereitgestellt. Soweit gesetzlich zulässig, übernehmen die Entwickler keine Haftung für Schäden, die aus ihrer Nutzung oder aus einer verspäteten oder ausgebliebenen Erinnerung entstehen.',
  ],
  legalAccept: 'Verstanden, ich stimme zu',
  legalReadFull: 'Vollständige Bedingungen lesen',
  termsTitle: 'Nutzungsbedingungen und Haftungsausschluss',
  terms: [
    {
      title: 'Nur eine Erinnerungshilfe',
      text: 'Vergissmeinnicht („die App“) ist ein kostenloses Werkzeug, das Fahrern helfen soll, nach dem Verlassen des Fahrzeugs an die Kontrolle der Rückbank zu denken. Die App ist kein Medizinprodukt, kein Sicherheitssystem, kein System zur Erkennung von Kindern im Fahrzeug und kein Notdienst. Sie ist weder dafür ausgelegt, Verletzungen oder Todesfälle zu verhindern, noch garantiert sie dies.',
    },
    {
      title: 'Deine Verantwortung',
      text: 'Die Verantwortung für die Sicherheit und Beaufsichtigung von Kindern und anderen Mitfahrenden liegt allein beim Fahrer und bei der aufsichtspflichtigen Person. Du musst das Fahrzeug jedes Mal selbst kontrollieren, wenn du es verlässt – unabhängig davon, ob du eine Erinnerung erhältst.',
    },
    {
      title: 'Keine Funktionsgarantie',
      text: 'Die App hängt von Faktoren ab, auf die die Entwickler keinen Einfluss haben, darunter Hardware und Betriebssystem des Handys, die Bluetooth-Verbindung mit dem Fahrzeug, Berechtigungen, Energiespar- und „Bitte nicht stören“-Einstellungen, die Lautstärke sowie die Frage, ob das Handy eingeschaltet und geladen ist. Erinnerungen können sich verzögern, überhört werden oder ganz ausbleiben.',
    },
    {
      title: 'Keine Gewährleistung',
      text: 'Die App wird „wie besehen“ und „nach Verfügbarkeit“ bereitgestellt, ohne ausdrückliche oder stillschweigende Gewährleistungen oder Garantien jeglicher Art, einschließlich solcher für die Eignung für einen bestimmten Zweck, die Genauigkeit, die Zuverlässigkeit oder einen unterbrechungsfreien Betrieb.',
    },
    {
      title: 'Haftungsbeschränkung',
      text: 'Soweit nach geltendem Recht zulässig, haften die Entwickler, Gestalter und Anbieter der App nicht für unmittelbare, mittelbare, Neben- oder Folgeschäden, Verletzungen oder Verluste jeglicher Art, einschließlich Körperverletzung oder Tod, die aus der Nutzung oder der Unmöglichkeit der Nutzung der App oder aus einer verspäteten, nicht zugestellten oder nicht bemerkten Erinnerung entstehen oder damit zusammenhängen.',
    },
    {
      title: 'Zustimmung',
      text: 'Mit der Nutzung der App bestätigst du, dass du diese Bedingungen gelesen und verstanden hast und ihnen zustimmst. Wenn du nicht zustimmst, nutze die App nicht.',
    },
  ],
  legalNotice: 'Nur eine Erinnerungshilfe. Prüfe die Rückbank immer selbst.',
};
