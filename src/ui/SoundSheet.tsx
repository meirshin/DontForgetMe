import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useI18n } from '../i18n';
import { radius, useTheme } from '../theme';
import { Icon } from './Icon';
import { Button, IconChip, Pressy, Txt } from './kit';
import { Sheet } from './Sheet';

/** Must match AlertSound.kt. */
export const SOUNDS = [
  'chimes',
  'marimba',
  'harp',
  'musicbox',
  'bells',
  'piano',
  'pizzicato',
  'steeldrum',
  'synth',
  'chiptune',
  'system',
] as const;

export type SoundId = (typeof SOUNDS)[number];

type Props = {
  visible: boolean;
  selected: string;
  playing: string | null;
  onSelect: (sound: SoundId) => void;
  onTogglePlay: (sound: SoundId) => void;
  onClose: () => void;
};

/** Picking a sound plays it, so the list doubles as a preview. */
export function SoundSheet({
  visible,
  selected,
  playing,
  onSelect,
  onTogglePlay,
  onClose,
}: Props) {
  const { t } = useI18n();
  const theme = useTheme();
  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <IconChip
          name="music_note"
          color={theme.primary}
          background={theme.primarySoft}
        />
        <Txt variant="title">{t.chooseSound}</Txt>
      </View>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {SOUNDS.map(id => {
          const isSelected = id === selected;
          const isPlaying = id === playing;
          return (
            <Pressy
              key={id}
              testID={`sound-${id}`}
              onPress={() => onSelect(id)}
              scaleTo={0.98}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.row,
                {
                  backgroundColor: isSelected
                    ? theme.primarySoft
                    : 'transparent',
                },
              ]}
            >
              <Pressy
                onPress={() => onTogglePlay(id)}
                scaleTo={0.85}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={isPlaying ? t.stop : t.play}
                style={[
                  styles.play,
                  isPlaying
                    ? { backgroundImage: theme.primaryGradient }
                    : { backgroundColor: theme.surfaceAlt },
                ]}
              >
                <Icon
                  name={isPlaying ? 'stop' : 'play_arrow'}
                  size={22}
                  color={isPlaying ? theme.onPrimary : theme.primary}
                  filled
                />
              </Pressy>
              <Txt variant="bodyStrong" style={styles.flex} numberOfLines={1}>
                {t.soundNames[id]}
              </Txt>
              <Icon
                name="check"
                size={22}
                color={theme.primary}
                style={{ opacity: isSelected ? 1 : 0 }}
              />
            </Pressy>
          );
        })}
      </ScrollView>
      <Button
        title={t.done}
        variant="secondary"
        onPress={onClose}
        style={styles.done}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  list: { flexShrink: 1 },
  flex: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  play: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: { marginTop: 12 },
});
