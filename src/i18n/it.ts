import type { Strings } from './en';

const minutes = (n: number) => (n === 1 ? '1 minuto' : `${n} minuti`);

export const it: Strings = {
  appTitle: 'Non ti scordar di me',
  subtitle:
    'Ricevi un promemoria per controllare il sedile posteriore pochi minuti dopo che il telefono si è disconnesso dal Bluetooth dell’auto.',
  tagline: 'Gratis · Senza pubblicità · Senza registrazione',

  statusActive: 'Attivo',
  statusOff: 'Disattivato',
  statusSetup: 'Da configurare',
  monitoringOn: 'Monitoraggio attivo',
  monitoringOff: 'Monitoraggio disattivato',
  monitoringToggle: 'Monitoraggio del sedile posteriore',
  monitoringOffHint:
    'Non riceverai promemoria finché il monitoraggio è disattivato.',
  setupTitle: 'Scegli la tua auto',
  noneSelected:
    'Seleziona almeno un dispositivo dell’auto per attivare il monitoraggio.',
  chooseDevices: 'Scegli i dispositivi',
  reminderAfter: (n: number) =>
    `Un promemoria ${minutes(n)} dopo la disconnessione dall’auto.`,
  delayTile: 'Promemoria dopo',
  carsTile: 'Auto monitorate',
  carsNone: 'Nessuna selezionata',
  minuteUnit: (n: number) => (n === 1 ? 'minuto' : 'minuti'),
  minShort: (n: number) => `${n} min`,
  permissionsTitle: 'Autorizzazioni',
  permissionsProgress: (granted: number, total: number) =>
    `${granted} di ${total}`,
  permBluetooth: 'Accesso al Bluetooth',
  permBluetoothWhy: 'Per rilevare quando scendi dall’auto',
  permNotifications: 'Notifiche',
  permNotificationsWhy: 'Per mostrare il promemoria',
  permExactAlarms: 'Promemoria puntuali (sveglie esatte)',
  permExactAlarmsWhy: 'Perché il promemoria arrivi puntuale',
  permBattery: 'Batteria senza restrizioni',
  permBatteryWhy: 'Perché il sistema non ritardi il promemoria',
  allow: 'Consenti',
  granted: 'OK',
  allGranted: 'Tutte le autorizzazioni concesse',
  allGrantedHint: 'Tutto pronto perché i promemoria arrivino puntuali.',
  howTitle: 'Come funziona',
  steps: [
    { title: 'Guidi', text: 'Il telefono si connette all’auto' },
    { title: 'Scendi', text: 'Il Bluetooth si disconnette' },
    { title: 'Controlli', text: 'Un promemoria per guardare dietro' },
  ],

  settings: 'Impostazioni',
  back: 'Indietro',
  delayTitle: 'Ricordamelo dopo',
  devicesTitle: 'Dispositivi Bluetooth dell’auto',
  devicesHint:
    'Seleziona il dispositivo Bluetooth della tua auto (o più di uno). I dispositivi riconosciuti come auto sono monitorati per impostazione predefinita.',
  noDevices:
    'Nessun dispositivo accoppiato trovato. Accoppia prima il telefono con l’auto.',
  needBluetooth:
    'Consenti l’accesso al Bluetooth per vedere i tuoi dispositivi.',
  carTag: 'Auto',
  refresh: 'Aggiorna',
  soundTitle: 'Suono del promemoria',
  soundNames: {
    chimes: 'Campanelli',
    marimba: 'Marimba',
    harp: 'Arpa',
    musicbox: 'Carillon',
    bells: 'Campane',
    piano: 'Pianoforte',
    pizzicato: 'Pizzicato',
    steeldrum: 'Steel drum',
    synth: 'Sintetizzatore',
    chiptune: 'Arcade',
    system: 'Sveglia del telefono',
  },
  chooseSound: 'Scegli un suono',
  play: 'Riproduci',
  stop: 'Interrompi',
  volume: 'Volume',
  percent: (n: number) => `${n}%`,
  overrideVolume: 'Più forte del volume del telefono',
  overrideVolumeHint:
    'Alza il volume della sveglia mentre suona il promemoria, anche se il telefono è in modalità silenziosa.',
  done: 'Fine',
  languageTitle: 'Lingua',
  languageAuto: 'Lingua del telefono',
  testTitle: 'Prova il promemoria',
  testHint:
    'Invia un promemoria di prova per verificare che il suono e la notifica funzionino.',
  test: 'Invia una prova (10 s)',
  testSent: 'Un promemoria di prova apparirà tra 10 secondi.',
  save: 'Salva impostazioni',
  saved: 'Impostazioni salvate.',
  allSaved: 'Tutte le modifiche salvate',
  unsaved: 'Hai modifiche non salvate.',
  unsavedTitle: 'Modifiche non salvate',
  unsavedPrompt: 'Salvare le modifiche prima di uscire?',
  discard: 'Esci senza salvare',
  cancel: 'Resta',
  privacyPolicy: 'Informativa sulla privacy',
  privacyUrl: 'https://ym987.github.io/DontForgetMe/privacy/',
  contactDesigner: 'Scrivi al designer',
  // Legal (draft, pending legal review)
  legalTitle: 'Avviso importante sulla sicurezza',
  legalPoints: [
    'L’app Non ti scordar di me è solo uno strumento di promemoria. Non è un sistema di sicurezza né un dispositivo salvavita e non sostituisce la tua responsabilità personale né la tua attenzione.',
    'I promemoria dipendono dal telefono, dal Bluetooth, dalle autorizzazioni, dalle impostazioni della batteria e dal sistema operativo, e possono arrivare in ritardo o non arrivare affatto.',
    'Controlla sempre di persona il sedile posteriore ogni volta che scendi dall’auto. Non affidarti mai solo all’app.',
    'L’app è fornita «così com’è». Nella misura massima consentita dalla legge, gli sviluppatori declinano ogni responsabilità per qualsiasi danno o pregiudizio derivante dal suo utilizzo o da un promemoria arrivato in ritardo o non recapitato.',
  ],
  legalAccept: 'Ho capito e accetto',
  legalReadFull: 'Leggi i termini completi',
  termsTitle: 'Termini d’uso ed esclusione di responsabilità',
  terms: [
    {
      title: 'Solo uno strumento di promemoria',
      text: 'L’applicazione Non ti scordar di me (di seguito «l’App») è uno strumento gratuito pensato per aiutare i conducenti a ricordarsi di controllare il sedile posteriore dopo essere scesi dal veicolo. L’App non è un dispositivo medico, un sistema di sicurezza, un sistema di rilevamento della presenza di bambini né un servizio di emergenza, e non è progettata per prevenire lesioni o la morte, né ne garantisce la prevenzione.',
    },
    {
      title: 'La tua responsabilità',
      text: 'La responsabilità della sicurezza e della sorveglianza dei bambini e degli altri passeggeri ricade esclusivamente sul conducente e sulla persona a cui sono affidati. Devi controllare di persona il veicolo ogni volta che lo lasci, che tu riceva o meno un promemoria.',
    },
    {
      title: 'Nessuna garanzia di funzionamento',
      text: 'L’App dipende da fattori al di fuori del controllo degli sviluppatori, tra cui l’hardware e il sistema operativo del telefono, la connessione Bluetooth con il veicolo, le autorizzazioni, le impostazioni di risparmio energetico e della modalità Non disturbare, il volume e il fatto che il telefono sia acceso e carico. I promemoria possono arrivare in ritardo, non essere uditi o non essere recapitati affatto.',
    },
    {
      title: 'Esclusione di garanzie',
      text: 'L’App è fornita «così com’è» e «come disponibile», senza garanzie di alcun tipo, esplicite o implicite, comprese quelle di idoneità a uno scopo specifico, accuratezza, affidabilità o funzionamento ininterrotto.',
    },
    {
      title: 'Limitazione di responsabilità',
      text: 'Nella misura massima consentita dalla legge applicabile, gli sviluppatori, i progettisti e i distributori dell’App non saranno responsabili di alcun danno diretto, indiretto, incidentale o consequenziale, né di lesioni o perdite di qualsiasi natura, incluse lesioni personali o la morte, derivanti dall’uso o dall’impossibilità di usare l’App o da un promemoria arrivato in ritardo, non recapitato o passato inosservato, o comunque a essi connessi.',
    },
    {
      title: 'Accettazione',
      text: 'Usando l’App confermi di aver letto e compreso i presenti termini e di accettarli. Se non li accetti, non usare l’App.',
    },
  ],
  legalNotice:
    'Solo uno strumento di promemoria. Controlla sempre di persona il sedile posteriore.',
};
