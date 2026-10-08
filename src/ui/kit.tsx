import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewStyle,
} from 'react-native';
import { useI18n } from '../i18n';
import { fontFor, radius, useTheme } from '../theme';
import { Icon, IconName } from './Icon';

// ---------------------------------------------------------------------------
// Typography

const variants = {
  display: { weight: 'extrabold', fontSize: 30, lineHeight: 38 },
  title: { weight: 'bold', fontSize: 23, lineHeight: 30 },
  headline: { weight: 'semibold', fontSize: 17, lineHeight: 24 },
  body: { weight: 'regular', fontSize: 15, lineHeight: 22 },
  bodyStrong: { weight: 'medium', fontSize: 15, lineHeight: 22 },
  label: { weight: 'medium', fontSize: 13, lineHeight: 18 },
  caption: { weight: 'regular', fontSize: 13, lineHeight: 18 },
  number: { weight: 'extrabold', fontSize: 54, lineHeight: 62 },
} as const;

type TxtProps = TextProps & {
  variant?: keyof typeof variants;
  color?: string;
  center?: boolean;
};

/**
 * Text in the app font of the current language. Aligned to the start of the
 * line (right in Hebrew and Arabic).
 */
export function Txt({
  variant = 'body',
  color,
  center,
  style,
  ...rest
}: TxtProps) {
  const theme = useTheme();
  const { lang } = useI18n();
  const { weight, fontSize, lineHeight } = variants[variant];
  const font = fontFor(lang, weight);
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[
        font.style,
        {
          fontSize,
          lineHeight: Math.round(lineHeight * font.lineScale),
          color: color ?? theme.text,
          textAlign: center ? 'center' : 'left',
        },
        style,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Surfaces

export function Card({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          boxShadow: theme.cardShadow,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Soft aurora gradients behind every screen. */
export function Backdrop() {
  const theme = useTheme();
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: theme.bg, backgroundImage: theme.aurora },
      ]}
    />
  );
}

/** Round tinted badge holding an icon. */
export function IconChip({
  name,
  color,
  background,
  size = 40,
  filled = true,
}: {
  name: IconName;
  color: string;
  background: string;
  size?: number;
  filled?: boolean;
}) {
  return (
    <View
      style={[
        styles.chip,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background,
        },
      ]}
    >
      <Icon name={name} size={size * 0.52} color={color} filled={filled} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Pressables

type PressyProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
  children: React.ReactNode;
};

/** Pressable that gently shrinks while pressed. */
export function Pressy({
  style,
  containerStyle,
  scaleTo = 0.965,
  children,
  onPressIn,
  onPressOut,
  ...rest
}: PressyProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: 7,
    }).start();
  return (
    <Pressable
      {...rest}
      style={containerStyle}
      onPressIn={e => {
        animate(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={e => {
        animate(1);
        onPressOut?.(e);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'done';
  size?: 'md' | 'sm';
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  icon,
  variant = 'primary',
  size = 'md',
  disabled,
  testID,
  style,
  containerStyle,
}: ButtonProps) {
  const theme = useTheme();
  const look: ViewStyle =
    variant === 'primary'
      ? { backgroundImage: theme.primaryGradient, boxShadow: theme.floatShadow }
      : variant === 'secondary'
      ? { backgroundColor: theme.primarySoft }
      : { backgroundColor: theme.successSoft };
  const color =
    variant === 'primary'
      ? theme.onPrimary
      : variant === 'secondary'
      ? theme.primary
      : theme.success;
  return (
    <Pressy
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      containerStyle={containerStyle}
      style={[size === 'md' ? styles.button : styles.buttonSm, look, style]}
    >
      {icon && (
        <Icon name={icon} size={size === 'md' ? 21 : 18} color={color} filled />
      )}
      <Txt
        variant={size === 'md' ? 'bodyStrong' : 'label'}
        color={color}
        numberOfLines={size === 'md' ? 2 : 1}
        center
        style={styles.buttonText}
      >
        {title}
      </Txt>
    </Pressy>
  );
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  testID,
  color,
  background,
  size = 46,
  style,
}: {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  testID?: string;
  color?: string;
  background?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  return (
    <Pressy
      testID={testID}
      onPress={onPress}
      hitSlop={8}
      scaleTo={0.9}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.chip,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background ?? theme.surface,
          borderColor: theme.border,
          borderWidth: background ? 0 : 1,
          boxShadow: background ? undefined : theme.cardShadow,
        },
        style,
      ]}
    >
      <Icon name={icon} size={size * 0.5} color={color ?? theme.text} />
    </Pressy>
  );
}

// ---------------------------------------------------------------------------
// Motion

/** Fades and lifts its content in once, `delay` ms after mounting. */
export function FadeIn({
  delay = 0,
  style,
  children,
}: {
  delay?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 560,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [v, delay]);
  const translateY = v.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 0],
  });
  return (
    <Animated.View style={[style, { opacity: v, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

/** A dot with a breathing halo. */
export function StatusDot({ color, pulse }: { color: string; pulse: boolean }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!pulse) {
      v.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(v, {
        toValue: 1,
        duration: 1600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [v, pulse]);
  return (
    <View style={styles.dotWrap}>
      {pulse && (
        <Animated.View
          style={[
            styles.dotHalo,
            {
              backgroundColor: color,
              opacity: v.interpolate({
                inputRange: [0, 1],
                outputRange: [0.55, 0],
              }),
              transform: [
                {
                  scale: v.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 2.6],
                  }),
                },
              ],
            },
          ]}
        />
      )}
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  chip: { alignItems: 'center', justifyContent: 'center' },
  button: {
    minHeight: 56,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: { flexShrink: 1 },
  buttonSm: {
    minHeight: 38,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dotWrap: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotHalo: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
});
