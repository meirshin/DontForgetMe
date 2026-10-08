import React from 'react';
import { StyleSheet, View } from 'react-native';
import { radius, useTheme } from '../theme';
import { Button, IconChip, Pressy, Txt } from './kit';
import { Sheet } from './Sheet';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirm: { title: string; onPress: () => void };
  destructive: { title: string; onPress: () => void };
  cancel: { title: string; onPress: () => void };
};

/** Bottom sheet asking the user to choose between saving, discarding or staying. */
export function ConfirmSheet({
  visible,
  title,
  message,
  confirm,
  destructive,
  cancel,
}: Props) {
  const theme = useTheme();
  return (
    <Sheet visible={visible} onClose={cancel.onPress}>
      <View style={styles.body}>
        <IconChip
          name="error"
          color={theme.warning}
          background={theme.warningSoft}
          size={52}
        />
        <Txt variant="title" center>
          {title}
        </Txt>
        <Txt color={theme.textMuted} center>
          {message}
        </Txt>
        <View style={styles.actions}>
          <Button
            title={confirm.title}
            icon="check"
            onPress={confirm.onPress}
          />
          <Pressy
            onPress={destructive.onPress}
            accessibilityRole="button"
            style={[styles.flat, { backgroundColor: theme.dangerSoft }]}
          >
            <Txt variant="bodyStrong" color={theme.danger}>
              {destructive.title}
            </Txt>
          </Pressy>
          <Pressy
            onPress={cancel.onPress}
            accessibilityRole="button"
            style={styles.flat}
          >
            <Txt variant="bodyStrong" color={theme.textMuted}>
              {cancel.title}
            </Txt>
          </Pressy>
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { alignItems: 'center', gap: 10 },
  actions: { alignSelf: 'stretch', gap: 10, marginTop: 12 },
  flat: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
