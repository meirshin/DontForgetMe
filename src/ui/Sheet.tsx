import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../i18n';
import { radius, useTheme } from '../theme';

type Props = {
  visible: boolean;
  /** Back button and tapping outside the sheet. Omit to make the sheet mandatory. */
  onClose?: () => void;
  children: React.ReactNode;
};

/** A panel that slides up from the bottom over a dimmed screen. */
export function Sheet({ visible, onClose, children }: Props) {
  const theme = useTheme();
  const { rtl } = useI18n();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const v = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(v, {
        toValue: 1,
        useNativeDriver: true,
        speed: 16,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(v, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => finished && setMounted(false));
    }
  }, [visible, v]);

  if (!mounted) return null;
  return (
    <Modal
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      visible
      onRequestClose={() => onClose?.()}
    >
      <View style={[styles.root, { direction: rtl ? 'rtl' : 'ltr' }]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.scrim, opacity: v },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            disabled={!onClose}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight: height * 0.88,
              backgroundColor: theme.surface,
              paddingBottom: insets.bottom + 20,
              transform: [
                {
                  translateY: v.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height * 0.6, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    marginBottom: 14,
  },
});
