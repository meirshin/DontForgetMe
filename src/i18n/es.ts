import type { Strings } from './en';

const minutes = (n: number) => (n === 1 ? '1 minuto' : `${n} minutos`);

export const es: Strings = {
  appTitle: 'No me olvides',
  subtitle:
    'Recibe un recordatorio para revisar el asiento trasero unos minutos después de que el teléfono se desconecte del Bluetooth del vehículo.',
  tagline: 'Gratis · Sin anuncios · Sin registro',

  statusActive: 'Activo',
  statusOff: 'Desactivado',
  statusSetup: 'Sin configurar',
  monitoringOn: 'Supervisión activa',
  monitoringOff: 'Supervisión desactivada',
  monitoringToggle: 'Supervisión del asiento trasero',
  monitoringOffHint:
    'No recibirás recordatorios mientras la supervisión esté desactivada.',
  setupTitle: 'Elige tu vehículo',
  noneSelected:
    'Selecciona al menos un dispositivo del vehículo para activar la supervisión.',
  chooseDevices: 'Elegir dispositivos',
  reminderAfter: (n: number) =>
    `Un recordatorio ${minutes(n)} después de desconectarte del vehículo.`,
  delayTile: 'Recordatorio tras',
  carsTile: 'En supervisión',
  carsNone: 'Ninguno seleccionado',
  minuteUnit: (n: number) => (n === 1 ? 'minuto' : 'minutos'),
  minShort: (n: number) => `${n} min`,
  permissionsTitle: 'Permisos',
  permissionsProgress: (granted: number, total: number) =>
    `${granted} de ${total}`,
  permBluetooth: 'Acceso a Bluetooth',
  permBluetoothWhy: 'Detecta cuándo sales del vehículo',
  permNotifications: 'Notificaciones',
  permNotificationsWhy: 'Muestra el recordatorio',
  permExactAlarms: 'Recordatorios puntuales (alarmas exactas)',
  permExactAlarmsWhy: 'Hace que el recordatorio llegue justo a tiempo',
  permBattery: 'Sin restricciones de batería',
  permBatteryWhy: 'Para que el sistema no retrase el recordatorio',
  allow: 'Permitir',
  granted: 'Listo',
  allGranted: 'Todos los permisos concedidos',
  allGrantedHint: 'Todo listo para que los recordatorios lleguen a tiempo.',
  howTitle: 'Cómo funciona',
  steps: [
    { title: 'Conducir', text: 'Tu teléfono se conecta al vehículo' },
    { title: 'Salir', text: 'El Bluetooth se desconecta' },
    { title: 'Revisar', text: 'Un recordatorio para mirar atrás' },
  ],

  settings: 'Ajustes',
  back: 'Atrás',
  delayTitle: 'Recordarme después de',
  devicesTitle: 'Dispositivos Bluetooth del vehículo',
  devicesHint:
    'Selecciona el dispositivo Bluetooth de tu vehículo (o varios). Los dispositivos reconocidos como vehículo se supervisan de forma predeterminada.',
  noDevices:
    'No se encontraron dispositivos vinculados. Primero vincula tu teléfono con el vehículo.',
  needBluetooth: 'Permite el acceso a Bluetooth para ver tus dispositivos.',
  carTag: 'Vehículo',
  refresh: 'Actualizar',
  soundTitle: 'Sonido del recordatorio',
  soundNames: {
    chimes: 'Campanillas',
    marimba: 'Marimba',
    harp: 'Arpa',
    musicbox: 'Caja de música',
    bells: 'Campanas',
    piano: 'Piano',
    pizzicato: 'Pizzicato',
    steeldrum: 'Tambor metálico',
    synth: 'Sintetizador',
    chiptune: 'Arcade',
    system: 'Alarma del teléfono',
  },
  chooseSound: 'Elige un sonido',
  play: 'Reproducir',
  stop: 'Detener',
  volume: 'Volumen',
  percent: (n: number) => `${n}\u00A0%`,
  overrideVolume: 'Más alto que el volumen del teléfono',
  overrideVolumeHint:
    'Sube el volumen de alarma mientras suena el recordatorio, incluso si el teléfono está en modo silencio.',
  done: 'Listo',
  languageTitle: 'Idioma',
  languageAuto: 'Idioma del teléfono',
  testTitle: 'Probar el recordatorio',
  testHint:
    'Envía un recordatorio de prueba para comprobar que el sonido y la notificación funcionan.',
  test: 'Enviar una prueba (10 s)',
  testSent: 'Aparecerá un recordatorio de prueba en 10 segundos.',
  save: 'Guardar ajustes',
  saved: 'Ajustes guardados.',
  allSaved: 'Todos los cambios guardados',
  unsaved: 'Tienes cambios sin guardar.',
  unsavedTitle: 'Cambios sin guardar',
  unsavedPrompt: '¿Quieres guardar los cambios antes de salir?',
  discard: 'Salir sin guardar',
  cancel: 'Quedarme',
  privacyPolicy: 'Política de privacidad',
  privacyUrl: 'https://ym987.github.io/DontForgetMe/privacy/',
  contactDesigner: 'Escribir al diseñador',
  // Legal (draft, pending legal review)
  legalTitle: 'Aviso importante de seguridad',
  legalPoints: [
    'La app No me olvides es solo una ayuda para recordar. No es un sistema de seguridad ni un dispositivo para salvar vidas, y no sustituye tu propia responsabilidad ni tu atención.',
    'Los recordatorios dependen de tu teléfono, del Bluetooth, de los permisos, de los ajustes de batería y del sistema operativo, y pueden retrasarse o no llegar nunca.',
    'Revisa siempre personalmente el asiento trasero cada vez que salgas del vehículo. Nunca confíes solo en la app.',
    'La app se proporciona «tal cual». En la máxima medida permitida por la ley, sus desarrolladores no asumen responsabilidad alguna por los daños o perjuicios derivados de su uso o de un recordatorio que se haya retrasado o no haya llegado.',
  ],
  legalAccept: 'Entiendo y acepto',
  legalReadFull: 'Leer los términos completos',
  termsTitle: 'Términos de uso y exención de responsabilidad',
  terms: [
    {
      title: 'Solo una ayuda para recordar',
      text: 'La aplicación No me olvides (en adelante, «la App») es una herramienta gratuita diseñada para ayudar a los conductores a recordar que deben revisar el asiento trasero al salir del vehículo. La App no es un dispositivo médico, un sistema de seguridad, un sistema de detección de presencia de niños ni un servicio de emergencias, y no está diseñada para evitar lesiones ni la muerte, ni garantiza que se eviten.',
    },
    {
      title: 'Tu responsabilidad',
      text: 'La responsabilidad por la seguridad y la supervisión de los niños y demás pasajeros recae exclusivamente en el conductor y en la persona a cargo de ellos. Debes revisar personalmente el vehículo cada vez que salgas de él, recibas o no un recordatorio.',
    },
    {
      title: 'Sin garantía de funcionamiento',
      text: 'La App depende de factores ajenos al control de sus desarrolladores, entre ellos el hardware y el sistema operativo del teléfono, la conexión Bluetooth con el vehículo, los permisos, los ajustes de ahorro de batería y de No molestar, el volumen y el hecho de que el teléfono esté encendido y con carga. Los recordatorios pueden retrasarse, no oírse o no llegar nunca.',
    },
    {
      title: 'Exclusión de garantías',
      text: 'La App se proporciona «tal cual» y «según disponibilidad», sin garantías de ningún tipo, expresas o implícitas, incluida cualquier garantía de idoneidad para un fin determinado, exactitud, fiabilidad o funcionamiento ininterrumpido.',
    },
    {
      title: 'Limitación de responsabilidad',
      text: 'En la máxima medida permitida por la legislación aplicable, los desarrolladores, diseñadores y distribuidores de la App no serán responsables de ningún daño directo, indirecto, incidental o consecuente, ni de ninguna lesión o pérdida de cualquier tipo, incluidas las lesiones corporales o la muerte, que se deriven del uso o de la imposibilidad de uso de la App, o de cualquier recordatorio que se haya retrasado, no haya llegado o no se haya advertido, o que guarden relación con ellos.',
    },
    {
      title: 'Aceptación',
      text: 'Al usar la App, confirmas que has leído y entendido estos términos y que los aceptas. Si no estás de acuerdo, no uses la App.',
    },
  ],
  legalNotice:
    'Solo una ayuda para recordar. Revisa siempre personalmente el asiento trasero.',
};
