import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { brand } from '../theme';
import { Icon, IconName } from './Icon';
import { Txt } from './kit';

export type ToastMessage = { id: number; text: string; icon: IconName };

const VISIBLE_MS = 2600;

/** A pill that drops in from the top, stays for a moment and leaves. */
export function Toast({
  message,
  onHide,
}: {
  message: ToastMessage | null;
  onHide: () => void;
}) {
  const insets = useSafeAreaInsets();
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    v.setValue(0);
    const anim = Animated.sequence([
      Animated.spring(v, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 8,
      }),
      Animated.delay(VISIBLE_MS),
      Animated.timing(v, {
        toValue: 0,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    anim.start(({ finished }) => finished && onHide());
    return () => anim.stop();
  }, [message, v, onHide]);

  if (!message) return null;
  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[
        styles.toast,
        {
          top: insets.top + 10,
          opacity: v,
          transform: [
            {
              translateY: v.interpolate({
                inputRange: [0, 1],
                outputRange: [-40, 0],
              }),
            },
            {
              scale: v.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Icon name={message.icon} size={22} color={brand.gold} filled />
      <Txt variant="bodyStrong" color="#FFFFFF" style={styles.text}>
        {message.text}
      </Txt>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(14, 17, 56, 0.96)',
    boxShadow: '0px 12px 32px rgba(8, 10, 40, 0.35)',
  },
  text: { flexShrink: 1 },
});
