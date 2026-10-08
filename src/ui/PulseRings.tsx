import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const RINGS = 3;
const DURATION = 3600;

/** Rings that keep spreading out from the center, like a radar signal. */
export function PulseRings({
  active,
  size,
  color,
}: {
  active: boolean;
  size: number;
  color: string;
}) {
  const values = useRef(
    [...Array(RINGS)].map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    if (!active) {
      values.forEach(v => v.setValue(0));
      return;
    }
    const loops = values.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay((DURATION / RINGS) * i),
          Animated.timing(v, {
            toValue: 1,
            duration: DURATION,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [active, values]);

  return (
    <View
      pointerEvents="none"
      style={[styles.wrap, { width: size, height: size }]}
    >
      {values.map((v, i) => (
        <Animated.View
          key={i}
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: color,
              opacity: v.interpolate({
                inputRange: [0, 0.15, 1],
                outputRange: [0, 0.75, 0],
              }),
              transform: [
                {
                  scale: v.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.35, 1],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderWidth: 1.5 },
});
