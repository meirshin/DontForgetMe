import React, { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import { useI18n } from '../i18n';
import { useTheme } from '../theme';

type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Called when the finger is lifted. */
  onRelease?: (value: number) => void;
  accessibilityLabel: string;
  testID?: string;
};

const THUMB = 28;

/** Draggable slider. Fills from the start of the line, so in RTL it grows to the left. */
export function Slider({
  value,
  min,
  max,
  step,
  onChange,
  onRelease,
  accessibilityLabel,
  testID,
}: Props) {
  const theme = useTheme();
  const { rtl } = useI18n();
  const [width, setWidth] = useState(0);
  const track = useRef<React.ComponentRef<typeof View>>(null);
  const trackX = useRef(0);
  const latest = useRef({ onChange, onRelease, value, width, rtl });
  latest.current = { onChange, onRelease, value, width, rtl };

  const responder = useMemo(() => {
    const valueAt = (pageX: number) => {
      const { width: w, rtl: isRtl } = latest.current;
      if (w <= THUMB) return latest.current.value;
      let ratio = (pageX - trackX.current - THUMB / 2) / (w - THUMB);
      ratio = Math.min(1, Math.max(0, ratio));
      if (isRtl) ratio = 1 - ratio;
      return Math.round((min + ratio * (max - min)) / step) * step;
    };
    const update = (pageX: number) => {
      const next = valueAt(pageX);
      if (next !== latest.current.value) latest.current.onChange(next);
      return next;
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: e => {
        track.current?.measureInWindow(x => {
          trackX.current = x;
          update(e.nativeEvent.pageX);
        });
      },
      onPanResponderMove: e => {
        update(e.nativeEvent.pageX);
      },
      onPanResponderRelease: e => {
        latest.current.onRelease?.(update(e.nativeEvent.pageX));
      },
    });
  }, [min, max, step]);

  const ratio = (value - min) / (max - min);
  const offset = ratio * Math.max(0, width - THUMB);

  return (
    <View
      ref={track}
      testID={testID}
      style={styles.hit}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value, text: `${value}%` }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={e => {
        const next =
          value + (e.nativeEvent.actionName === 'increment' ? step : -step);
        const clamped = Math.min(max, Math.max(min, next));
        onChange(clamped);
        onRelease?.(clamped);
      }}
      {...responder.panHandlers}
    >
      <View style={[styles.track, { backgroundColor: theme.trackOff }]}>
        <View
          style={[
            styles.fill,
            {
              width: offset + THUMB / 2,
              backgroundImage: theme.primaryGradient,
            },
          ]}
        />
      </View>
      <View
        pointerEvents="none"
        style={[styles.thumb, { start: offset, borderColor: theme.primary }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hit: { height: 44, justifyContent: 'center' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, bottom: 0, start: 0, borderRadius: 4 },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    boxShadow: '0px 3px 8px rgba(10, 12, 50, 0.25)',
  },
});
