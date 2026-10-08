import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useI18n } from '../i18n';
import { useTheme } from '../theme';
import { Icon } from './Icon';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
  accessibilityLabel?: string;
  /** Larger switch with a translucent track, for dark surfaces. */
  hero?: boolean;
};

const PAD = 3;

/** Animated switch. In RTL it is mirrored like the system switch. */
export function Toggle({
  value,
  onValueChange,
  testID,
  accessibilityLabel,
  hero,
}: Props) {
  const theme = useTheme();
  const { rtl } = useI18n();
  const width = hero ? 60 : 52;
  const height = hero ? 36 : 32;
  const thumb = height - PAD * 2;
  const travel = (width - thumb - PAD * 2) * (rtl ? -1 : 1);

  const v = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(v, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 7,
    }).start();
  }, [v, value]);

  return (
    <Pressable
      testID={testID}
      onPress={() => onValueChange(!value)}
      hitSlop={10}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
    >
      <View
        style={[
          styles.track,
          {
            width,
            height,
            borderRadius: height / 2,
            backgroundColor: hero
              ? 'rgba(255, 255, 255, 0.16)'
              : theme.trackOff,
          },
        ]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: height / 2,
              backgroundImage: hero
                ? 'linear-gradient(135deg, #FFD36E 0%, #FFB938 100%)'
                : theme.primaryGradient,
              opacity: v,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumb,
              height: thumb,
              borderRadius: thumb / 2,
              transform: [
                {
                  translateX: v.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, travel],
                  }),
                },
                {
                  scale: v.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0.92, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View style={{ opacity: v }}>
            <Icon
              name="check"
              size={thumb * 0.62}
              color={hero ? '#B87400' : theme.primary}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { padding: PAD, justifyContent: 'center', alignItems: 'flex-start' },
  thumb: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(10, 12, 50, 0.25)',
  },
});
