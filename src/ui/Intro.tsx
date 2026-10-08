import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { useI18n } from '../i18n';
import { brand } from '../theme';
import { Txt } from './kit';

const logo = require('../assets/images/logo.png');

/**
 * Continues the system splash screen (same color and logo), then fades away
 * once the app is ready.
 */
export function Intro({
  ready,
  onDone,
}: {
  ready: boolean;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const appear = useRef(new Animated.Value(0)).current;
  const leave = useRef(new Animated.Value(1)).current;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.back(1.6)),
      useNativeDriver: true,
    }).start(() => setShown(true));
  }, [appear]);

  useEffect(() => {
    if (!ready || !shown) return;
    Animated.timing(leave, {
      toValue: 0,
      duration: 420,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(onDone);
  }, [ready, shown, leave, onDone]);

  return (
    <Animated.View style={[styles.root, { opacity: leave }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: appear,
            backgroundImage:
              'radial-gradient(circle at 50% 45%, rgba(113, 131, 255, 0.45) 0%, rgba(113, 131, 255, 0) 60%)',
          },
        ]}
      />
      <Animated.Image
        source={logo}
        style={[
          styles.logo,
          {
            transform: [
              {
                scale: appear.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
              {
                rotate: appear.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-25deg', '0deg'],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={{
          opacity: appear,
          transform: [
            {
              translateY: appear.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        }}
      >
        <Txt variant="display" color="#FFFFFF" center>
          {t.appTitle}
        </Txt>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: brand.night,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
  },
  logo: { width: 150, height: 150 },
});
