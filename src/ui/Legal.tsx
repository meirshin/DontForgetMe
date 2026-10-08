import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useI18n } from '../i18n';
import { useTheme } from '../theme';
import { Icon, IconName } from './Icon';
import { Button, IconChip, Pressy, Txt } from './kit';
import { Sheet } from './Sheet';

const POINT_ICONS: IconName[] = [
  'info',
  'bluetooth',
  'directions_car',
  'gavel',
];

function Terms() {
  const { t } = useI18n();
  const theme = useTheme();
  return (
    <View style={styles.terms}>
      {t.terms.map((section, i) => (
        <View key={section.title} style={styles.section}>
          <Txt variant="headline">
            {i + 1}. {section.title}
          </Txt>
          <Txt variant="caption" color={theme.textMuted}>
            {section.text}
          </Txt>
        </View>
      ))}
    </View>
  );
}

/** Safety notice the user has to accept before using the app. */
export function LegalSheet({
  visible,
  onAccept,
}: {
  visible: boolean;
  onAccept: () => void;
}) {
  const { t } = useI18n();
  const theme = useTheme();
  const [full, setFull] = useState(false);
  return (
    <Sheet visible={visible}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <IconChip
            name="shield_with_heart"
            color={theme.warning}
            background={theme.warningSoft}
            size={56}
          />
          <Txt variant="title" center>
            {t.legalTitle}
          </Txt>
        </View>
        {t.legalPoints.map((point, i) => (
          <View key={point} style={styles.point}>
            <Icon
              name={POINT_ICONS[i]}
              size={22}
              color={theme.primary}
              filled
            />
            <Txt style={styles.flex}>{point}</Txt>
          </View>
        ))}
        {full ? (
          <Terms />
        ) : (
          <Pressy
            onPress={() => setFull(true)}
            accessibilityRole="button"
            style={styles.readMore}
          >
            <Txt variant="bodyStrong" color={theme.primary}>
              {t.legalReadFull}
            </Txt>
          </Pressy>
        )}
      </ScrollView>
      <Button
        testID="acceptLegal"
        title={t.legalAccept}
        icon="check"
        onPress={onAccept}
        style={styles.button}
      />
    </Sheet>
  );
}

/** The full terms of use, opened from the settings. */
export function TermsSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  return (
    <Sheet visible={visible} onClose={onClose}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Txt variant="title">{t.termsTitle}</Txt>
        <Terms />
      </ScrollView>
      <Button
        title={t.done}
        variant="secondary"
        onPress={onClose}
        style={styles.button}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexShrink: 1 },
  content: { gap: 14, paddingBottom: 8 },
  head: { alignItems: 'center', gap: 10 },
  point: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  readMore: { alignSelf: 'center', paddingVertical: 6 },
  terms: { gap: 14 },
  section: { gap: 4 },
  button: { marginTop: 12 },
});
