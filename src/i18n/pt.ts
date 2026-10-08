import type { Strings } from './en';

const minutes = (n: number) => (n === 1 ? '1 minuto' : `${n} minutos`);

/** Brazilian Portuguese. */
export const pt: Strings = {
  appTitle: 'Não Me Esqueça',
  subtitle:
    'Receba um lembrete para verificar o banco de trás alguns minutos depois que o celular se desconectar do Bluetooth do carro.',
  tagline: 'Grátis · Sem anúncios · Sem cadastro',

  statusActive: 'Ativo',
  statusOff: 'Desligado',
  statusSetup: 'Não configurado',
  monitoringOn: 'Monitoramento ativo',
  monitoringOff: 'Monitoramento desligado',
  monitoringToggle: 'Lembrete ao sair do carro',
  monitoringOffHint:
    'Você não vai receber lembretes enquanto o monitoramento estiver desligado.',
  setupTitle: 'Escolha seu carro',
  noneSelected:
    'Selecione pelo menos um dispositivo do carro para ativar o monitoramento.',
  chooseDevices: 'Escolher dispositivos',
  reminderAfter: (n: number) =>
    `Um lembrete ${minutes(n)} depois de desconectar do carro.`,
  delayTile: 'Lembrete após',
  carsTile: 'Monitorados',
  carsNone: 'Nenhum selecionado',
  minuteUnit: (n: number) => (n === 1 ? 'minuto' : 'minutos'),
  minShort: (n: number) => `${n} min`,
  permissionsTitle: 'Permissões',
  permissionsProgress: (granted: number, total: number) =>
    `${granted} de ${total}`,
  permBluetooth: 'Acesso ao Bluetooth',
  permBluetoothWhy: 'Detecta quando você sai do carro',
  permNotifications: 'Notificações',
  permNotificationsWhy: 'Mostra o lembrete',
  permExactAlarms: 'Lembretes na hora certa (alarmes exatos)',
  permExactAlarmsWhy: 'Faz o lembrete chegar na hora certa',
  permBattery: 'Sem restrições de bateria',
  permBatteryWhy: 'Para o sistema não atrasar o lembrete',
  allow: 'Permitir',
  granted: 'OK',
  allGranted: 'Todas as permissões concedidas',
  allGrantedHint: 'Tudo pronto para os lembretes chegarem na hora certa.',
  howTitle: 'Como funciona',
  steps: [
    { title: 'Dirigir', text: 'Seu celular se conecta ao carro' },
    { title: 'Sair', text: 'O Bluetooth se desconecta' },
    { title: 'Conferir', text: 'Um lembrete para olhar o banco de trás' },
  ],

  settings: 'Configurações',
  back: 'Voltar',
  delayTitle: 'Lembrar depois de',
  devicesTitle: 'Dispositivos Bluetooth do carro',
  devicesHint:
    'Selecione o dispositivo Bluetooth do seu carro (ou mais de um). Os dispositivos reconhecidos como carro são monitorados por padrão.',
  noDevices:
    'Nenhum dispositivo pareado encontrado. Primeiro pareie o celular com o carro.',
  needBluetooth: 'Permita o acesso ao Bluetooth para ver seus dispositivos.',
  carTag: 'Carro',
  refresh: 'Atualizar',
  soundTitle: 'Som do lembrete',
  soundNames: {
    chimes: 'Sininhos',
    marimba: 'Marimba',
    harp: 'Harpa',
    musicbox: 'Caixinha de música',
    bells: 'Sinos',
    piano: 'Piano',
    pizzicato: 'Pizzicato',
    steeldrum: 'Steel drum',
    synth: 'Sintetizador',
    chiptune: 'Fliperama',
    system: 'Alarme do celular',
  },
  chooseSound: 'Escolha um som',
  play: 'Tocar',
  stop: 'Parar',
  volume: 'Volume',
  percent: (n: number) => `${n}%`,
  overrideVolume: 'Mais alto que o volume do celular',
  overrideVolumeHint:
    'Aumenta o volume do alarme enquanto o lembrete toca, mesmo com o celular no modo silencioso.',
  done: 'Concluído',
  languageTitle: 'Idioma',
  languageAuto: 'Idioma do celular',
  testTitle: 'Testar o lembrete',
  testHint:
    'Envie um lembrete de teste para conferir se o som e a notificação funcionam.',
  test: 'Enviar um teste (10 s)',
  testSent: 'Um lembrete de teste vai aparecer em 10 segundos.',
  save: 'Salvar configurações',
  saved: 'Suas configurações foram salvas.',
  allSaved: 'Todas as alterações salvas',
  unsaved: 'Você tem alterações não salvas.',
  unsavedTitle: 'Alterações não salvas',
  unsavedPrompt: 'Salvar as alterações antes de sair?',
  discard: 'Sair sem salvar',
  cancel: 'Ficar',
  privacyPolicy: 'Política de privacidade',
  privacyUrl: 'https://ym987.github.io/DontForgetMe/privacy/',
  contactDesigner: 'Enviar e-mail para o designer',
  // Legal (draft, pending legal review)
  legalTitle: 'Aviso importante de segurança',
  legalPoints: [
    'O app Não Me Esqueça é apenas uma ferramenta de lembrete. Não é um sistema de segurança nem um dispositivo para salvar vidas, e não substitui a sua própria responsabilidade nem a sua atenção.',
    'Os lembretes dependem do seu celular, do Bluetooth, das permissões, das configurações de bateria e do sistema operacional, e podem atrasar ou não chegar.',
    'Sempre verifique pessoalmente o banco de trás toda vez que sair do carro. Nunca confie apenas no app.',
    'O app é fornecido “no estado em que se encontra”. Na máxima extensão permitida por lei, os desenvolvedores não se responsabilizam por quaisquer danos ou prejuízos decorrentes do seu uso ou de um lembrete atrasado ou não entregue.',
  ],
  legalAccept: 'Entendi e concordo',
  legalReadFull: 'Ler os termos completos',
  termsTitle: 'Termos de uso e isenção de responsabilidade',
  terms: [
    {
      title: 'Apenas uma ferramenta de lembrete',
      text: 'O aplicativo Não Me Esqueça (“App”) é uma ferramenta gratuita criada para ajudar motoristas a se lembrarem de verificar o banco de trás depois de saírem do veículo. O App não é um dispositivo médico, um sistema de segurança, um sistema de detecção de presença de crianças nem um serviço de emergência, e não foi projetado para evitar ferimentos ou morte, nem garante que eles sejam evitados.',
    },
    {
      title: 'Sua responsabilidade',
      text: 'A responsabilidade pela segurança e supervisão de crianças e outros passageiros cabe exclusivamente ao motorista e à pessoa responsável por eles. Você deve verificar o veículo pessoalmente toda vez que sair dele, recebendo ou não um lembrete.',
    },
    {
      title: 'Sem garantia de funcionamento',
      text: 'O App depende de fatores fora do controle dos desenvolvedores, incluindo o hardware e o sistema operacional do celular, a conexão Bluetooth com o veículo, as permissões, as configurações de economia de bateria e do modo Não perturbe, o volume e o fato de o celular estar ligado e carregado. Os lembretes podem atrasar, não ser ouvidos ou não ser entregues de forma alguma.',
    },
    {
      title: 'Isenção de garantias',
      text: 'O App é fornecido “no estado em que se encontra” e “conforme disponível”, sem garantias de qualquer tipo, expressas ou implícitas, incluindo quaisquer garantias de adequação a uma finalidade específica, precisão, confiabilidade ou funcionamento ininterrupto.',
    },
    {
      title: 'Limitação de responsabilidade',
      text: 'Na máxima extensão permitida pela legislação aplicável, os desenvolvedores, designers e distribuidores do App não serão responsáveis por quaisquer danos diretos, indiretos, incidentais ou consequenciais, ferimentos ou perdas de qualquer natureza, incluindo lesões corporais ou morte, decorrentes do uso ou da impossibilidade de uso do App, ou de qualquer lembrete atrasado, não entregue ou não percebido, ou a eles relacionados.',
    },
    {
      title: 'Aceitação',
      text: 'Ao usar o App, você confirma que leu e entendeu estes termos e que concorda com eles. Se não concordar, não use o App.',
    },
  ],
  legalNotice:
    'Apenas uma ferramenta de lembrete. Sempre verifique pessoalmente o banco de trás.',
};
