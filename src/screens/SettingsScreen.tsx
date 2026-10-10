import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  Image,
  Keyboard,
  Linking,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import NativeCarBluetooth, {
  type MonitorSettings,
  type PairedDevice,
} from '../../specs/NativeCarBluetooth';
import { useI18n } from '../i18n';
import { fontFor, radius, useTheme } from '../theme';
import { ConfirmSheet } from '../ui/ConfirmSheet';
import { DesignCredit } from '../ui/DesignCredit';
import { Icon, IconName } from '../ui/Icon';
import {
  Button,
  Card,
  FadeIn,
  IconButton,
  IconChip,
  Pressy,
  Txt,
} from '../ui/kit';
import { LanguageSheet, languageName } from '../ui/LanguageSheet';
import { TermsSheet } from '../ui/Legal';
import { Slider } from '../ui/Slider';
import { SoundSheet, type SoundId } from '../ui/SoundSheet';
import { Toggle } from '../ui/Toggle';
import type { PermState } from './types';

export const MIN_DELAY = 1;
export const MAX_DELAY = 60;
const TEST_SECONDS = 10;
const PRESETS = [1, 2, 5, 10, 15];
const MIN_VOLUME = 10;
const MAX_VOLUME = 100;
/** Sounds are ~7 s long; previews from the volume slider are shorter. */
const PREVIEW_MS = 7500;
const SHORT_PREVIEW_MS = 2500;
/** Same limit as Prefs.MAX_MESSAGE_LENGTH. */
const MAX_MESSAGE_LENGTH = 200;

const testBanner = require('../assets/images/test-banner.jpg');
// Seamless 8 s loop of test-banner.jpg, generated with Veo (see scripts/brand/README.md).
const testLoop = require('../assets/images/test-loop.webp');

export type SettingsDraft = {
  delayMinutes: number;
  selectedDevices: string[];
  sound: string;
  volume: number;
  overrideVolume: boolean;
  /** The user's own reminder text, or '' for the default message. */
  message: string;
};

type SettingsProps = {
  settings: MonitorSettings;
  devices: PairedDevice[];
  perms: PermState | null;
  onRefresh: () => void;
  onSave: (draft: SettingsDraft) => void;
  onBack: () => void;
  notify: (text: string, icon: IconName) => void;
};

export function SettingsScreen({
  settings,
  devices,
  perms,
  onRefresh,
  onSave,
  onBack,
  notify,
}: SettingsProps) {
  const theme = useTheme();
  const { t, rtl, lang, choice } = useI18n();
  const insets = useSafeAreaInsets();
  const [delay, setDelay] = useState(settings.delayMinutes);
  // Devices the user switched since the last save (relative to the saved list),
  // so devices added in the background still show up correctly.
  const [toggled, setToggled] = useState<string[]>([]);
  const [sound, setSound] = useState(settings.sound);
  const [volume, setVolume] = useState(settings.volume);
  const [overrideVolume, setOverrideVolume] = useState(settings.overrideVolume);
  const [message, setMessage] = useState(settings.message);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [sheet, setSheet] = useState<'sound' | 'language' | 'terms' | null>(
    null,
  );
  const [playing, setPlaying] = useState<string | null>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const messageY = useRef(0);
  const messageFocused = useRef(false);

  // Android doesn't scroll a focused field above the keyboard, so bring the
  // message card into view when the keyboard opens for it.
  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      if (messageFocused.current) {
        scroll.current?.scrollTo({ y: Math.max(0, messageY.current - 12) });
      }
    });
    return () => sub.remove();
  }, []);

  const saved = settings.selectedDevices;
  const selected = [
    ...saved.filter(a => !toggled.includes(a)),
    ...toggled.filter(a => !saved.includes(a)),
  ];
  const dirty =
    delay !== settings.delayMinutes ||
    toggled.length > 0 ||
    sound !== settings.sound ||
    volume !== settings.volume ||
    overrideVolume !== settings.overrideVolume ||
    message.trim() !== settings.message;

  const changeDelay = (diff: number) => {
    setDelay(Math.min(MAX_DELAY, Math.max(MIN_DELAY, delay + diff)));
  };

  const toggleDevice = (address: string) => {
    setToggled(prev =>
      prev.includes(address)
        ? prev.filter(a => a !== address)
        : [...prev, address],
    );
  };

  const stopPreview = () => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = null;
    NativeCarBluetooth.stopSound();
    setPlaying(null);
  };

  const preview = (id: string, ms = PREVIEW_MS, atVolume = volume) => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    NativeCarBluetooth.previewSound(id, atVolume, overrideVolume);
    setPlaying(id);
    previewTimer.current = setTimeout(() => {
      previewTimer.current = null;
      NativeCarBluetooth.stopSound();
      setPlaying(null);
    }, ms);
  };

  // Never leave a preview playing after the screen closes.
  useEffect(
    () => () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
      NativeCarBluetooth.stopSound();
    },
    [],
  );

  const save = () => {
    onSave({
      delayMinutes: delay,
      selectedDevices: selected,
      sound,
      volume,
      overrideVolume,
      message: message.trim(),
    });
    setToggled([]);
    setMessage(message.trim());
  };

  const goBack = () => {
    if (!dirty) {
      onBack();
      return;
    }
    setConfirmLeave(true);
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  });

  const sendTest = () => {
    NativeCarBluetooth.testReminder(TEST_SECONDS);
    notify(t.testSent, 'notifications_active');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <IconButton
          testID="back"
          icon={rtl ? 'arrow_forward' : 'arrow_back'}
          accessibilityLabel={t.back}
          onPress={goBack}
        />
        <Txt variant="display" style={styles.flexShrink} numberOfLines={1}>
          {t.settings}
        </Txt>
      </View>

      {/* Keyed by language: after a live language switch Android keeps stale
          text and layout in rows that were off screen, so remount the content. */}
      <ScrollView
        ref={scroll}
        key={lang}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 170 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn>
          <DelayCard delay={delay} onChange={changeDelay} onPreset={setDelay} />
        </FadeIn>

        <FadeIn delay={70}>
          <Card>
            <View style={styles.cardHeader}>
              <IconChip
                name="bluetooth"
                color={theme.primary}
                background={theme.primarySoft}
              />
              <Txt variant="headline" style={styles.flex}>
                {t.devicesTitle}
              </Txt>
              <RefreshButton onPress={onRefresh} />
            </View>
            <Txt variant="caption" color={theme.textMuted}>
              {!perms?.bluetooth
                ? t.needBluetooth
                : devices.length === 0
                ? t.noDevices
                : t.devicesHint}
            </Txt>
            {devices.length > 0 && (
              <View
                style={[
                  styles.deviceList,
                  { backgroundColor: theme.surfaceAlt },
                ]}
              >
                {devices.map((d, i) => (
                  <Pressy
                    key={d.address}
                    scaleTo={0.98}
                    onPress={() => toggleDevice(d.address)}
                    style={[
                      styles.deviceRow,
                      i > 0 && { borderTopWidth: 1, borderColor: theme.border },
                    ]}
                  >
                    <IconChip
                      name={d.isCar ? 'directions_car' : 'bluetooth'}
                      color={
                        selected.includes(d.address)
                          ? theme.onPrimary
                          : theme.textMuted
                      }
                      background={
                        selected.includes(d.address)
                          ? theme.primary
                          : theme.surface
                      }
                      size={38}
                    />
                    <View style={styles.deviceInfo}>
                      <Txt
                        variant="bodyStrong"
                        numberOfLines={1}
                        style={styles.flexShrink}
                      >
                        {d.name}
                      </Txt>
                      {d.isCar && (
                        <View
                          style={[
                            styles.tag,
                            { backgroundColor: theme.goldSoft },
                          ]}
                        >
                          <Txt variant="label" color={theme.gold}>
                            {t.carTag}
                          </Txt>
                        </View>
                      )}
                    </View>
                    <Toggle
                      value={selected.includes(d.address)}
                      onValueChange={() => toggleDevice(d.address)}
                      accessibilityLabel={d.name}
                    />
                  </Pressy>
                ))}
              </View>
            )}
          </Card>
        </FadeIn>

        <FadeIn delay={140}>
          <Card>
            <View style={styles.cardHeader}>
              <IconChip
                name="music_note"
                color={theme.primary}
                background={theme.primarySoft}
              />
              <Txt variant="headline" style={styles.flex}>
                {t.soundTitle}
              </Txt>
            </View>
            <Pressy
              testID="chooseSound"
              onPress={() => setSheet('sound')}
              scaleTo={0.98}
              accessibilityRole="button"
              style={[styles.pickRow, { backgroundColor: theme.surfaceAlt }]}
            >
              <Pressy
                testID="previewSound"
                onPress={() =>
                  playing === sound ? stopPreview() : preview(sound)
                }
                scaleTo={0.85}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={playing === sound ? t.stop : t.play}
                style={[
                  styles.playButton,
                  { backgroundImage: theme.primaryGradient },
                ]}
              >
                <Icon
                  name={playing === sound ? 'stop' : 'play_arrow'}
                  size={24}
                  color={theme.onPrimary}
                  filled
                />
              </Pressy>
              <Txt variant="bodyStrong" style={styles.flex} numberOfLines={1}>
                {t.soundNames[sound as SoundId] ?? sound}
              </Txt>
              <Icon
                name={rtl ? 'chevron_left' : 'chevron_right'}
                size={24}
                color={theme.textFaint}
              />
            </Pressy>

            <View style={styles.volumeHeader}>
              <Icon name="volume_up" size={20} color={theme.textMuted} filled />
              <Txt variant="bodyStrong" style={styles.flex}>
                {t.volume}
              </Txt>
              <Txt variant="bodyStrong" color={theme.primary}>
                {t.percent(volume)}
              </Txt>
            </View>
            <Slider
              testID="volume"
              value={volume}
              min={MIN_VOLUME}
              max={MAX_VOLUME}
              step={5}
              onChange={setVolume}
              onRelease={v => preview(sound, SHORT_PREVIEW_MS, v)}
              accessibilityLabel={t.volume}
            />

            <View style={styles.overrideRow}>
              <View style={styles.flex}>
                <Txt variant="bodyStrong">{t.overrideVolume}</Txt>
                <Txt variant="caption" color={theme.textMuted}>
                  {t.overrideVolumeHint}
                </Txt>
              </View>
              <Toggle
                testID="overrideVolume"
                value={overrideVolume}
                onValueChange={setOverrideVolume}
                accessibilityLabel={t.overrideVolume}
              />
            </View>
          </Card>
        </FadeIn>

        <FadeIn
          delay={175}
          onLayout={e => {
            messageY.current = e.nativeEvent.layout.y;
          }}
        >
          <Card>
            <View style={styles.cardHeader}>
              <IconChip
                name="notifications"
                color={theme.primary}
                background={theme.primarySoft}
              />
              <Txt variant="headline" style={styles.flex}>
                {t.messageTitle}
              </Txt>
            </View>
            <TextInput
              testID="message"
              value={message}
              onChangeText={setMessage}
              onFocus={() => {
                messageFocused.current = true;
              }}
              onBlur={() => {
                messageFocused.current = false;
              }}
              placeholder={t.messageDefault}
              placeholderTextColor={theme.textFaint}
              maxLength={MAX_MESSAGE_LENGTH}
              multiline
              accessibilityLabel={t.messageTitle}
              style={[
                styles.messageInput,
                fontFor(lang, 'regular').style,
                {
                  color: theme.text,
                  backgroundColor: theme.surfaceAlt,
                  textAlign: rtl ? 'right' : 'left',
                },
              ]}
            />
            <Txt variant="caption" color={theme.textMuted}>
              {t.messageHint}
            </Txt>
            {message.length > 0 && (
              <Pressy
                testID="resetMessage"
                onPress={() => setMessage('')}
                scaleTo={0.95}
                accessibilityRole="button"
                style={styles.resetMessage}
              >
                <Icon name="refresh" size={18} color={theme.primary} />
                <Txt variant="bodyStrong" color={theme.primary}>
                  {t.messageReset}
                </Txt>
              </Pressy>
            )}
          </Card>
        </FadeIn>

        <FadeIn delay={210}>
          <SettingRow
            testID="language"
            icon="language"
            title={t.languageTitle}
            value={choice ? languageName(lang) : t.languageAuto}
            onPress={() => setSheet('language')}
          />
        </FadeIn>

        <FadeIn delay={280}>
          <Card style={styles.testCard}>
            <View style={styles.banner}>
              <Image
                source={testBanner}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <Image
                source={testLoop}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 45%, ${theme.surface} 100%)`,
                  },
                ]}
              />
            </View>
            <View style={styles.testBody}>
              <Txt variant="headline">{t.testTitle}</Txt>
              <Txt variant="caption" color={theme.textMuted}>
                {t.testHint}
              </Txt>
              <Button
                title={t.test}
                icon="notifications_active"
                variant="secondary"
                onPress={sendTest}
                style={styles.testButton}
              />
            </View>
          </Card>
        </FadeIn>

        <FadeIn delay={350} style={styles.links}>
          <SettingRow
            icon="lock"
            title={t.privacyPolicy}
            trailing="open_in_new"
            onPress={() => Linking.openURL(t.privacyUrl)}
          />
          <SettingRow
            testID="terms"
            icon="gavel"
            title={t.termsTitle}
            onPress={() => setSheet('terms')}
          />
        </FadeIn>

        <FadeIn delay={420}>
          <DesignCredit />
        </FadeIn>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 14,
            backgroundColor: theme.surface,
            borderColor: theme.border,
            boxShadow: theme.footerShadow,
          },
        ]}
      >
        {dirty && (
          <View style={styles.unsaved}>
            <View
              style={[styles.unsavedDot, { backgroundColor: theme.warning }]}
            />
            <Txt variant="label" color={theme.warning}>
              {t.unsaved}
            </Txt>
          </View>
        )}
        <Button
          testID="save"
          disabled={!dirty}
          variant={dirty ? 'primary' : 'done'}
          icon={dirty ? 'check' : 'check_circle'}
          title={dirty ? t.save : t.allSaved}
          onPress={save}
        />
      </View>

      <SoundSheet
        visible={sheet === 'sound'}
        selected={sound}
        playing={playing}
        onSelect={id => {
          setSound(id);
          preview(id);
        }}
        onTogglePlay={id => (playing === id ? stopPreview() : preview(id))}
        onClose={() => {
          stopPreview();
          setSheet(null);
        }}
      />
      <LanguageSheet
        visible={sheet === 'language'}
        onClose={() => setSheet(null)}
      />
      <TermsSheet visible={sheet === 'terms'} onClose={() => setSheet(null)} />
      <ConfirmSheet
        visible={confirmLeave}
        title={t.unsavedTitle}
        message={t.unsavedPrompt}
        confirm={{
          title: t.save,
          onPress: () => {
            save();
            onBack();
          },
        }}
        destructive={{ title: t.discard, onPress: onBack }}
        cancel={{ title: t.cancel, onPress: () => setConfirmLeave(false) }}
      />
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  title,
  value,
  trailing,
  onPress,
  testID,
}: {
  icon: IconName;
  title: string;
  value?: string;
  trailing?: IconName;
  onPress: () => void;
  testID?: string;
}) {
  const theme = useTheme();
  const { rtl } = useI18n();
  return (
    <Pressy
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.linkRow,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <IconChip
        name={icon}
        color={theme.textMuted}
        background={theme.surfaceAlt}
        size={36}
      />
      <Txt variant="bodyStrong" style={styles.flex}>
        {title}
      </Txt>
      {value !== undefined && (
        <Txt variant="label" color={theme.textMuted} numberOfLines={1}>
          {value}
        </Txt>
      )}
      <Icon
        name={trailing ?? (rtl ? 'chevron_left' : 'chevron_right')}
        size={20}
        color={theme.textFaint}
      />
    </Pressy>
  );
}

function DelayCard({
  delay,
  onChange,
  onPreset,
}: {
  delay: number;
  onChange: (diff: number) => void;
  onPreset: (minutes: number) => void;
}) {
  const theme = useTheme();
  const { t } = useI18n();
  const pop = useRef(new Animated.Value(1)).current;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pop.setValue(1.18);
    Animated.spring(pop, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  }, [delay, pop]);

  return (
    <Card>
      <View style={styles.cardHeader}>
        <IconChip
          name="timer"
          color={theme.primary}
          background={theme.primarySoft}
        />
        <Txt variant="headline" style={styles.flex}>
          {t.delayTitle}
        </Txt>
      </View>
      <View style={styles.stepper}>
        <IconButton
          testID="delayMinus"
          icon="remove"
          accessibilityLabel="-1"
          size={54}
          color={theme.primary}
          background={theme.primarySoft}
          onPress={() => onChange(-1)}
        />
        <Animated.View
          style={[styles.delayValue, { transform: [{ scale: pop }] }]}
        >
          <Txt variant="number" center>
            {delay}
          </Txt>
          <Txt variant="label" color={theme.textMuted} center>
            {t.minuteUnit(delay)}
          </Txt>
        </Animated.View>
        <IconButton
          testID="delayPlus"
          icon="add"
          accessibilityLabel="+1"
          size={54}
          color={theme.primary}
          background={theme.primarySoft}
          onPress={() => onChange(1)}
        />
      </View>
      <View style={styles.presets}>
        {PRESETS.map(p => {
          const active = p === delay;
          return (
            <Pressy
              key={p}
              onPress={() => onPreset(p)}
              scaleTo={0.92}
              containerStyle={styles.flex}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[
                styles.preset,
                active
                  ? { backgroundImage: theme.primaryGradient }
                  : { backgroundColor: theme.surfaceAlt },
              ]}
            >
              <Txt
                variant="label"
                color={active ? theme.onPrimary : theme.textMuted}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {t.minShort(p)}
              </Txt>
            </Pressy>
          );
        })}
      </View>
      <Txt variant="caption" color={theme.textMuted} center>
        {t.reminderAfter(delay)}
      </Txt>
    </Card>
  );
}

function RefreshButton({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  const { t } = useI18n();
  const spin = useRef(new Animated.Value(0)).current;
  const press = () => {
    spin.setValue(0);
    Animated.timing(spin, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    onPress();
  };
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <IconButton
        icon="refresh"
        accessibilityLabel={t.refresh}
        size={40}
        color={theme.primary}
        background={theme.primarySoft}
        onPress={press}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  flexShrink: { flexShrink: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  content: { padding: 20, paddingTop: 12, gap: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingVertical: 4,
  },
  delayValue: { minWidth: 90, alignItems: 'center' },
  presets: { flexDirection: 'row', gap: 8 },
  preset: {
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  deviceList: { borderRadius: radius.md, overflow: 'hidden' },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  deviceInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    paddingEnd: 14,
    borderRadius: radius.md,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: -8,
  },
  overrideRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  messageInput: {
    minHeight: 84,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  resetMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 4,
  },
  testCard: { padding: 0, overflow: 'hidden', gap: 0 },
  banner: { width: '100%', aspectRatio: 2 },
  bannerImage: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
  testBody: { padding: 18, paddingTop: 4, gap: 6 },
  testButton: { marginTop: 8 },
  links: { gap: 10 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingEnd: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 10,
    borderTopWidth: 1,
  },
  unsaved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  unsavedDot: { width: 7, height: 7, borderRadius: 4 },
});
