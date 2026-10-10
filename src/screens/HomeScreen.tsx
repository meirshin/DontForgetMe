import React, { useEffect, useRef } from 'react';
import { Animated, Image, ScrollView, StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import type {
  MonitorSettings,
  PairedDevice,
} from '../../specs/NativeCarBluetooth';
import { useI18n, type Strings } from '../i18n';
import { brand, radius, useTheme } from '../theme';
import { Icon, IconName } from '../ui/Icon';
import {
  Button,
  Card,
  FadeIn,
  IconButton,
  IconChip,
  Pressy,
  StatusDot,
  Txt,
} from '../ui/kit';
import { PulseRings } from '../ui/PulseRings';
import { DesignCredit } from '../ui/DesignCredit';
import { Toggle } from '../ui/Toggle';
import type { PermKey, PermState } from './types';

const heroOn = require('../assets/images/hero-on.jpg');
const heroOff = require('../assets/images/hero-off.jpg');
// Seamless 8 s loop of hero-on.jpg, generated with Veo (see scripts/brand/README.md).
const heroLoop = require('../assets/images/hero-loop.webp');
const appIcon = require('../assets/images/app-icon.png');

/** Edge colors of the hero images, so the card continues them seamlessly. */
const HERO_ON_BG = '#0F1042';
const HERO_OFF_BG = '#111822';
const fadeTo = (color: string) =>
  `linear-gradient(180deg, rgba(0, 0, 0, 0) 62%, ${color} 100%)`;

type HomeProps = {
  settings: MonitorSettings;
  devices: PairedDevice[];
  perms: PermState | null;
  onToggle: (enabled: boolean) => void;
  onFixPermission: (key: PermKey) => void;
  onOpenSettings: () => void;
};

export const permRowsFor = (
  t: Strings,
): { key: PermKey; label: string; why: string; icon: IconName }[] => [
  {
    key: 'bluetooth',
    label: t.permBluetooth,
    why: t.permBluetoothWhy,
    icon: 'bluetooth',
  },
  {
    key: 'notifications',
    label: t.permNotifications,
    why: t.permNotificationsWhy,
    icon: 'notifications',
  },
  {
    key: 'exactAlarms',
    label: t.permExactAlarms,
    why: t.permExactAlarmsWhy,
    icon: 'alarm',
  },
  {
    key: 'battery',
    label: t.permBattery,
    why: t.permBatteryWhy,
    icon: 'battery_charging_full',
  },
];

export function HomeScreen({
  settings,
  devices,
  perms,
  onToggle,
  onFixPermission,
  onOpenSettings,
}: HomeProps) {
  const theme = useTheme();
  const { t, lang } = useI18n();
  const insets = useSafeAreaInsets();
  const watched = devices
    .filter(d => settings.selectedDevices.includes(d.address))
    .map(d => d.name);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {/* Keyed by language, like the settings screen (the phone language can change while the app runs). */}
      <ScrollView
        key={lang}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 40 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn style={styles.header}>
          <View style={styles.brand}>
            <Image source={appIcon} style={styles.logo} />
            <Txt variant="headline" style={styles.brandName}>
              {t.appTitle}
            </Txt>
          </View>
          <IconButton
            testID="openSettings"
            icon="settings"
            accessibilityLabel={t.settings}
            onPress={onOpenSettings}
          />
        </FadeIn>

        <FadeIn delay={80}>
          <Hero
            settings={settings}
            onToggle={onToggle}
            onOpenSettings={onOpenSettings}
          />
        </FadeIn>

        <FadeIn delay={160} style={styles.tiles}>
          <Tile
            icon="timer"
            value={t.minShort(settings.delayMinutes)}
            label={t.delayTile}
            onPress={onOpenSettings}
          />
          <Tile
            icon="directions_car"
            value={String(settings.selectedDevices.length)}
            label={t.carsTile}
            detail={watched.length > 0 ? watched.join(', ') : t.carsNone}
            onPress={onOpenSettings}
          />
        </FadeIn>

        {perms && (
          <FadeIn delay={240}>
            <Permissions perms={perms} onFix={onFixPermission} />
          </FadeIn>
        )}

        <FadeIn delay={320}>
          <HowItWorks />
        </FadeIn>

        <FadeIn delay={360}>
          <View style={[styles.notice, { backgroundColor: theme.warningSoft }]}>
            <Icon name="info" size={20} color={theme.warning} filled />
            <Txt variant="caption" color={theme.text} style={styles.flexShrink}>
              {t.legalNotice}
            </Txt>
          </View>
        </FadeIn>

        <FadeIn delay={420} style={styles.footer}>
          <View style={styles.tagline}>
            <Icon name="favorite" size={16} color={theme.textFaint} filled />
            <Txt variant="caption" color={theme.textFaint}>
              {t.tagline}
            </Txt>
          </View>
          <DesignCredit />
        </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}

function Hero({
  settings,
  onToggle,
  onOpenSettings,
}: {
  settings: MonitorSettings;
  onToggle: (enabled: boolean) => void;
  onOpenSettings: () => void;
}) {
  const { t } = useI18n();
  const needsSetup = settings.enabled && settings.selectedDevices.length === 0;
  const active = settings.enabled && !needsSetup;

  const on = useRef(new Animated.Value(settings.enabled ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(on, {
      toValue: settings.enabled ? 1 : 0,
      duration: 650,
      useNativeDriver: true,
    }).start();
  }, [on, settings.enabled]);

  const status = active
    ? { text: t.statusActive, color: '#4BE3A9' }
    : needsSetup
    ? { text: t.statusSetup, color: brand.gold }
    : { text: t.statusOff, color: '#9AA3B8' };

  return (
    <View style={[styles.hero, { backgroundColor: HERO_OFF_BG }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: HERO_ON_BG, opacity: on },
        ]}
      />
      <View style={styles.heroArt}>
        <Image source={heroOff} style={styles.heroImage} resizeMode="cover" />
        <View
          style={[styles.heroImage, { backgroundImage: fadeTo(HERO_OFF_BG) }]}
        />
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: on }]}>
          <Image source={heroOn} style={styles.heroImage} resizeMode="cover" />
          {settings.enabled && (
            <Image
              source={heroLoop}
              style={styles.heroImage}
              resizeMode="cover"
            />
          )}
          <View
            style={[styles.heroImage, { backgroundImage: fadeTo(HERO_ON_BG) }]}
          />
        </Animated.View>
        <View style={styles.rings}>
          <PulseRings
            active={active}
            size={240}
            color="rgba(255, 214, 140, 0.85)"
          />
        </View>
        <View style={styles.statusPill}>
          <StatusDot color={status.color} pulse={active} />
          <Txt variant="label" color="#FFFFFF">
            {status.text}
          </Txt>
        </View>
      </View>

      <View style={styles.heroBody}>
        <Txt variant="title" color="#FFFFFF">
          {needsSetup
            ? t.setupTitle
            : settings.enabled
            ? t.monitoringOn
            : t.monitoringOff}
        </Txt>
        <Txt color="rgba(255, 255, 255, 0.72)">
          {needsSetup
            ? t.noneSelected
            : settings.enabled
            ? t.reminderAfter(settings.delayMinutes)
            : t.monitoringOffHint}
        </Txt>
        {needsSetup && (
          <Button
            title={t.chooseDevices}
            icon="directions_car"
            size="sm"
            onPress={onOpenSettings}
            style={styles.setupButton}
          />
        )}
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabel}>
            <Icon
              name="shield_with_heart"
              size={24}
              color={brand.gold}
              filled
            />
            <Txt variant="bodyStrong" color="#FFFFFF" style={styles.flexShrink}>
              {t.monitoringToggle}
            </Txt>
          </View>
          <Toggle
            testID="monitoring"
            hero
            value={settings.enabled}
            onValueChange={onToggle}
            accessibilityLabel={t.monitoringToggle}
          />
        </View>
      </View>
    </View>
  );
}

function Tile({
  icon,
  value,
  label,
  detail,
  onPress,
}: {
  icon: IconName;
  value: string;
  label: string;
  detail?: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressy
      onPress={onPress}
      containerStyle={styles.flex}
      accessibilityRole="button"
    >
      <Card style={styles.tile}>
        <IconChip
          name={icon}
          color={theme.primary}
          background={theme.primarySoft}
          size={38}
        />
        <View>
          <Txt variant="title">{value}</Txt>
          <Txt variant="label" color={theme.textMuted} numberOfLines={1}>
            {label}
          </Txt>
          {detail !== undefined && (
            <Txt variant="caption" color={theme.textFaint} numberOfLines={1}>
              {detail}
            </Txt>
          )}
        </View>
      </Card>
    </Pressy>
  );
}

function Permissions({
  perms,
  onFix,
}: {
  perms: PermState;
  onFix: (key: PermKey) => void;
}) {
  const theme = useTheme();
  const { t, rtl } = useI18n();
  const permRows = permRowsFor(t);
  const granted = permRows.filter(r => perms[r.key]).length;
  const allGranted = granted === permRows.length;

  if (allGranted) {
    return (
      <Card style={styles.allGranted}>
        <IconChip
          name="verified_user"
          color={theme.success}
          background={theme.successSoft}
          size={46}
        />
        <View style={styles.flex}>
          <Txt variant="headline">{t.allGranted}</Txt>
          <Txt variant="caption" color={theme.textMuted}>
            {t.allGrantedHint}
          </Txt>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.cardHeader}>
        <Txt variant="headline" style={styles.flex}>
          {t.permissionsTitle}
        </Txt>
        <View style={[styles.badge, { backgroundColor: theme.warningSoft }]}>
          <Txt variant="label" color={theme.warning}>
            {t.permissionsProgress(granted, permRows.length)}
          </Txt>
        </View>
      </View>
      <View
        style={[styles.progressTrack, { backgroundColor: theme.surfaceAlt }]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${(granted / permRows.length) * 100}%`,
              backgroundImage: `linear-gradient(${
                rtl ? 270 : 90
              }deg, #FFB938 0%, #4BE3A9 100%)`,
            },
          ]}
        />
      </View>
      {permRows.map(({ key, label, why, icon }) => (
        <View key={key} style={styles.permRow}>
          <IconChip
            name={icon}
            color={perms[key] ? theme.success : theme.primary}
            background={perms[key] ? theme.successSoft : theme.primarySoft}
          />
          <View style={styles.flex}>
            <Txt variant="bodyStrong">{label}</Txt>
            <Txt variant="caption" color={theme.textMuted}>
              {why}
            </Txt>
          </View>
          {perms[key] ? (
            <View
              style={[
                styles.badge,
                styles.okBadge,
                { backgroundColor: theme.successSoft },
              ]}
            >
              <Icon name="check" size={16} color={theme.success} />
              <Txt variant="label" color={theme.success}>
                {t.granted}
              </Txt>
            </View>
          ) : (
            <Button title={t.allow} size="sm" onPress={() => onFix(key)} />
          )}
        </View>
      ))}
    </Card>
  );
}

function HowItWorks() {
  const theme = useTheme();
  const { t } = useI18n();
  const icons: IconName[] = [
    'bluetooth_connected',
    'directions_walk',
    'notifications_active',
  ];
  return (
    <Card>
      <View>
        <Txt variant="headline">{t.howTitle}</Txt>
        <Txt variant="caption" color={theme.textMuted}>
          {t.subtitle}
        </Txt>
      </View>
      <View style={styles.steps}>
        <View
          style={[styles.stepLine, { backgroundColor: theme.surfaceAlt }]}
        />
        {t.steps.map((step, i) => (
          <View key={step.title} style={styles.step}>
            <View
              style={[
                styles.stepIcon,
                {
                  backgroundImage:
                    i === 2
                      ? 'linear-gradient(135deg, #FFD36E 0%, #FFA21F 100%)'
                      : theme.primaryGradient,
                  borderColor: theme.surface,
                },
              ]}
            >
              <Icon name={icons[i]} size={24} color="#FFFFFF" filled />
            </View>
            <Txt variant="bodyStrong" center>
              {step.title}
            </Txt>
            <Txt variant="caption" color={theme.textMuted} center>
              {step.text}
            </Txt>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 12, gap: 16, paddingBottom: 40 },
  flex: { flex: 1 },
  flexShrink: { flexShrink: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  brandName: { fontSize: 19 },
  logo: { width: 40, height: 40 },
  hero: { borderRadius: radius.xl, overflow: 'hidden' },
  heroArt: { width: '100%', aspectRatio: 16 / 9 },
  heroImage: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
  rings: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
  },
  statusPill: {
    position: 'absolute',
    top: 16,
    start: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(8, 10, 40, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  heroBody: { paddingHorizontal: 20, paddingBottom: 20, marginTop: -6, gap: 6 },
  setupButton: { alignSelf: 'flex-start', marginTop: 6 },
  toggleRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    paddingStart: 16,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  tiles: { flexDirection: 'row', gap: 12 },
  tile: { gap: 12, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  okBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: -4,
  },
  progressFill: { height: '100%', borderRadius: 3 },
  permRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  allGranted: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  steps: { flexDirection: 'row', gap: 8 },
  stepLine: {
    position: 'absolute',
    top: 26,
    left: '17%',
    right: '17%',
    height: 2,
  },
  step: { flex: 1, alignItems: 'center', gap: 4 },
  stepIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    marginBottom: 4,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.md,
  },
  footer: { alignItems: 'center', gap: 12, paddingTop: 4 },
  tagline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
