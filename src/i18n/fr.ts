import type { Strings } from './en';

/**
 * French typography: a no-break space before ? : ; ! and %, between a number
 * and its unit, and inside « guillemets ».
 */
const nb = '\u00A0';
const minutes = (n: number) => (n < 2 ? `${n}${nb}minute` : `${n}${nb}minutes`);

export const fr: Strings = {
  appTitle: 'Ne m’oubliez pas',
  subtitle:
    'Recevez un rappel pour vérifier la banquette arrière quelques minutes après que votre téléphone s’est déconnecté du Bluetooth de votre voiture.',
  tagline: 'Gratuit · Sans publicité · Sans inscription',

  statusActive: 'Actif',
  statusOff: 'Désactivé',
  statusSetup: 'À configurer',
  monitoringOn: 'Surveillance active',
  monitoringOff: 'Surveillance désactivée',
  monitoringToggle: 'Rappel en quittant la voiture',
  monitoringOffHint:
    'Vous ne recevrez aucun rappel tant que la surveillance est désactivée.',
  setupTitle: 'Choisissez votre voiture',
  noneSelected:
    'Sélectionnez au moins un appareil de votre voiture pour activer la surveillance.',
  chooseDevices: 'Choisir les appareils',
  reminderAfter: (n: number) =>
    `Un rappel ${minutes(n)} après la déconnexion de la voiture.`,
  delayTile: 'Rappel après',
  carsTile: 'Voitures suivies',
  carsNone: 'Aucune sélection',
  minuteUnit: (n: number) => (n < 2 ? 'minute' : 'minutes'),
  minShort: (n: number) => `${n}${nb}min`,
  permissionsTitle: 'Autorisations',
  permissionsProgress: (granted: number, total: number) =>
    `${granted} sur ${total}`,
  permBluetooth: 'Accès au Bluetooth',
  permBluetoothWhy: 'Pour détecter quand vous quittez la voiture',
  permNotifications: 'Notifications',
  permNotificationsWhy: 'Pour afficher le rappel',
  permExactAlarms: 'Rappels à l’heure (alarmes exactes)',
  permExactAlarmsWhy: 'Pour que le rappel arrive pile à l’heure',
  permBattery: 'Sans restriction de batterie',
  permBatteryWhy: 'Pour que le système ne retarde pas le rappel',
  allow: 'Autoriser',
  granted: 'OK',
  allGranted: 'Toutes les autorisations sont accordées',
  allGrantedHint: 'Tout est prêt pour que les rappels arrivent à l’heure.',
  howTitle: 'Comment ça marche',
  steps: [
    { title: 'Rouler', text: 'Votre téléphone se connecte à la voiture' },
    { title: 'Sortir', text: 'Le Bluetooth se déconnecte' },
    { title: 'Vérifier', text: 'Un rappel pour regarder à l’arrière' },
  ],

  settings: 'Paramètres',
  back: 'Retour',
  delayTitle: 'Me rappeler après',
  devicesTitle: 'Appareils Bluetooth de la voiture',
  devicesHint:
    'Sélectionnez le ou les appareils Bluetooth de votre voiture. Les appareils reconnus comme une voiture sont surveillés par défaut.',
  noDevices:
    'Aucun appareil associé trouvé. Associez d’abord votre téléphone à la voiture.',
  needBluetooth: 'Autorisez l’accès au Bluetooth pour voir vos appareils.',
  carTag: 'Voiture',
  refresh: 'Actualiser',
  soundTitle: 'Son du rappel',
  soundNames: {
    chimes: 'Carillon',
    marimba: 'Marimba',
    harp: 'Harpe',
    musicbox: 'Boîte à musique',
    bells: 'Cloches',
    piano: 'Piano',
    pizzicato: 'Pizzicato',
    steeldrum: 'Steel drum',
    synth: 'Synthé',
    chiptune: 'Arcade',
    system: 'Alarme du téléphone',
  },
  chooseSound: 'Choisir un son',
  play: 'Écouter',
  stop: 'Arrêter',
  volume: 'Volume',
  percent: (n: number) => `${n}${nb}%`,
  overrideVolume: 'Plus fort que le volume du téléphone',
  overrideVolumeHint:
    'Augmente le volume des alarmes pendant le rappel, même si le téléphone est en mode silencieux.',
  done: 'OK',
  languageTitle: 'Langue',
  languageAuto: 'Langue du téléphone',
  testTitle: 'Tester le rappel',
  testHint:
    'Envoyez un rappel d’essai pour vérifier que le son et la notification fonctionnent.',
  test: `Envoyer un essai (10${nb}s)`,
  testSent: `Un rappel d’essai apparaîtra dans 10${nb}secondes.`,
  save: 'Enregistrer',
  saved: 'Vos paramètres ont été enregistrés.',
  allSaved: 'Tout est enregistré',
  unsaved: 'Modifications non enregistrées.',
  unsavedTitle: 'Modifications non enregistrées',
  unsavedPrompt: `Enregistrer les modifications avant de quitter${nb}?`,
  discard: 'Quitter sans enregistrer',
  cancel: 'Rester',
  privacyPolicy: 'Politique de confidentialité',
  privacyUrl: 'https://ym987.github.io/DontForgetMe/privacy/',
  contactDesigner: 'Écrire au designer',
  // Legal (draft, pending legal review)
  legalTitle: 'Avertissement de sécurité important',
  legalPoints: [
    'L’application Ne m’oubliez pas est un simple outil de rappel. Elle ne constitue ni un système de sécurité ni un dispositif destiné à sauver des vies, et ne remplace ni votre propre responsabilité ni votre vigilance.',
    'Les rappels dépendent de votre téléphone, du Bluetooth, des autorisations, des paramètres de batterie et du système d’exploitation, et peuvent être retardés ou ne jamais arriver.',
    'Vérifiez toujours vous-même la banquette arrière chaque fois que vous quittez la voiture. Ne vous fiez jamais uniquement à l’application.',
    `L’application est fournie «${nb}en l’état${nb}». Dans toute la mesure permise par la loi, ses développeurs déclinent toute responsabilité pour tout préjudice ou dommage résultant de son utilisation ou d’un rappel qui aurait été retardé ou ne serait pas parvenu.`,
  ],
  legalAccept: 'J’ai compris et j’accepte',
  legalReadFull: 'Lire les conditions complètes',
  termsTitle: 'Conditions d’utilisation et clause de non-responsabilité',
  terms: [
    {
      title: 'Un simple outil de rappel',
      text: `L’application Ne m’oubliez pas (ci-après «${nb}l’Application${nb}») est un outil gratuit conçu pour aider les conducteurs à penser à vérifier la banquette arrière après avoir quitté leur véhicule. L’Application n’est ni un dispositif médical, ni un système de sécurité, ni un système de détection de présence d’enfants, ni un service d’urgence. Elle n’est pas conçue pour empêcher des blessures ou un décès et ne garantit pas de les empêcher.`,
    },
    {
      title: 'Votre responsabilité',
      text: 'La responsabilité de la sécurité et de la surveillance des enfants et des autres passagers incombe exclusivement au conducteur et à la personne qui en a la charge. Vous devez vérifier vous-même le véhicule chaque fois que vous le quittez, que vous receviez un rappel ou non.',
    },
    {
      title: 'Aucune garantie de fonctionnement',
      text: 'L’Application dépend de facteurs échappant au contrôle de ses développeurs, notamment le matériel et le système d’exploitation du téléphone, la connexion Bluetooth avec le véhicule, les autorisations, les paramètres d’économie de batterie et du mode Ne pas déranger, le volume sonore, ainsi que le fait que le téléphone soit allumé et chargé. Les rappels peuvent être retardés, ne pas être entendus ou ne pas vous parvenir du tout.',
    },
    {
      title: 'Absence de garantie',
      text: `L’Application est fournie «${nb}en l’état${nb}» et «${nb}selon disponibilité${nb}», sans garantie d’aucune sorte, expresse ou implicite, y compris toute garantie d’adéquation à un usage particulier, d’exactitude, de fiabilité ou de fonctionnement ininterrompu.`,
    },
    {
      title: 'Limitation de responsabilité',
      text: 'Dans toute la mesure permise par la loi applicable, les développeurs, concepteurs et distributeurs de l’Application ne sauraient être tenus responsables de tout dommage direct, indirect, accessoire ou consécutif, ni de toute blessure ou perte de quelque nature que ce soit, y compris un dommage corporel ou un décès, résultant de l’utilisation ou de l’impossibilité d’utiliser l’Application, ou d’un rappel retardé, non parvenu ou passé inaperçu, ou s’y rapportant de quelque manière que ce soit.',
    },
    {
      title: 'Acceptation',
      text: 'En utilisant l’Application, vous confirmez avoir lu et compris les présentes conditions et les accepter. Si vous ne les acceptez pas, n’utilisez pas l’Application.',
    },
  ],
  legalNotice:
    'Un simple outil de rappel. Vérifiez toujours vous-même la banquette arrière.',
};
