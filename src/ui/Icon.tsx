import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

/**
 * Material Symbols Rounded, subset to the glyphs below
 * (android/app/src/main/assets/fonts/MaterialSymbolsRounded*.ttf).
 * After adding an icon here, run scripts/brand/subset-icons.py.
 */
export const glyphs = {
  add: '\ue145',
  alarm: '\ue855',
  arrow_back: '\ue5c4',
  arrow_forward: '\ue5c8',
  battery_charging_full: '\ue1a3',
  bluetooth: '\ue1a7',
  bluetooth_connected: '\ue1a8',
  check: '\ue668',
  check_circle: '\uf0be',
  chevron_left: '\ue5cb',
  chevron_right: '\ue5cc',
  directions_car: '\ueff7',
  directions_walk: '\ue536',
  error: '\uf8b6',
  favorite: '\ue87e',
  gavel: '\ue90e',
  info: '\ue88e',
  language: '\uea07',
  lock: '\ue899',
  mail: '\ue159',
  music_note: '\ue405',
  notifications: '\ue7f5',
  notifications_active: '\ue7f7',
  open_in_new: '\ue89e',
  play_arrow: '\ue037',
  refresh: '\ue5d5',
  remove: '\ue15b',
  settings: '\ue8b8',
  shield_with_heart: '\ue78f',
  smartphone: '\ue7ba',
  stop: '\ue047',
  timer: '\ue425',
  verified_user: '\uf013',
  volume_up: '\ue050',
} as const;

export type IconName = keyof typeof glyphs;

type Props = {
  name: IconName;
  size?: number;
  color: string;
  filled?: boolean;
  style?: StyleProp<TextStyle>;
};

export function Icon({ name, size = 22, color, filled = false, style }: Props) {
  return (
    <Text
      allowFontScaling={false}
      accessible={false}
      importantForAccessibility="no"
      style={[
        styles.icon,
        {
          fontFamily: filled
            ? 'MaterialSymbolsRounded-Filled'
            : 'MaterialSymbolsRounded',
          fontSize: size,
          lineHeight: size,
          width: size,
          height: size,
          color,
        },
        style,
      ]}
    >
      {glyphs[name]}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: { textAlign: 'center', includeFontPadding: false },
});
