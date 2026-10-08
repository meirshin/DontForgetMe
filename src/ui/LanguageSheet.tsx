import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { languages, phoneLanguage, useI18n, type Lang } from '../i18n';
import { fontFor, radius, useTheme } from '../theme';
import { Icon } from './Icon';
import { Button, IconChip, Pressy, Txt } from './kit';
import { Sheet } from './Sheet';

const nameOf = (code: Lang) =>
  languages.find(l => l.code === code)?.name ?? code;

/** Each language's name in its own script and font. */
function LanguageName({ code, color }: { code: Lang; color: string }) {
  const font = fontFor(code, 'medium');
  return (
    <Text style={[font.style, styles.name, { color }]}>{nameOf(code)}</Text>
  );
}

export function LanguageSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { t, choice, setChoice } = useI18n();
  const theme = useTheme();
  const phone = phoneLanguage();

  const pick = (next: Lang | '') => {
    setChoice(next);
    onClose();
  };

  const row = (
    key: string,
    selected: boolean,
    onPress: () => void,
    content: React.ReactNode,
  ) => (
    <Pressy
      key={key}
      testID={`lang-${key}`}
      onPress={onPress}
      scaleTo={0.98}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[
        styles.row,
        { backgroundColor: selected ? theme.primarySoft : 'transparent' },
      ]}
    >
      {content}
      <Icon
        name="check"
        size={22}
        color={theme.primary}
        style={{ opacity: selected ? 1 : 0 }}
      />
    </Pressy>
  );

  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <IconChip
          name="language"
          color={theme.primary}
          background={theme.primarySoft}
        />
        <Txt variant="title">{t.languageTitle}</Txt>
      </View>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {row(
          'auto',
          choice === '',
          () => pick(''),
          <View style={styles.flex}>
            <Txt variant="bodyStrong">{t.languageAuto}</Txt>
            <LanguageName code={phone} color={theme.textMuted} />
          </View>,
        )}
        {languages.map(l =>
          row(
            l.code,
            choice === l.code,
            () => pick(l.code),
            <View style={styles.flex}>
              <LanguageName code={l.code} color={theme.text} />
            </View>,
          ),
        )}
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

export { nameOf as languageName };

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
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  name: { fontSize: 16, lineHeight: 24, textAlign: 'left' },
  done: { marginTop: 12 },
});
