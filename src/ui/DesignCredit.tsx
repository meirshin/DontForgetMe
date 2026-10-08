import React from 'react';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../i18n';
import { fontFor, radius, useTheme } from '../theme';
import { Pressy } from './kit';

const logo = require('../assets/images/credit-mm.png');
const EMAIL = 'm0527603401@gmail.com';
const CREDIT = 'Designed by';

/** "Designed by" over the designer's logo (the same in every language); opens an email. */
export function DesignCredit() {
  const { t } = useI18n();
  const theme = useTheme();
  return (
    <Pressy
      onPress={() =>
        Linking.openURL(
          `mailto:${EMAIL}?subject=${encodeURIComponent(t.appTitle)}`,
        )
      }
      scaleTo={0.94}
      accessibilityRole="link"
      accessibilityLabel={`${CREDIT} MM. ${t.contactDesigner}`}
      style={styles.credit}
    >
      <Text
        style={[
          fontFor('en', 'medium').style,
          styles.text,
          { color: theme.textFaint },
        ]}
      >
        {CREDIT}
      </Text>
      {/* The logo is navy, so on the dark theme it sits on a light chip. */}
      <View style={theme.dark && styles.logoChip}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
    </Pressy>
  );
}

const styles = StyleSheet.create({
  credit: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  logo: { width: 56, height: 34 },
  text: { fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
});
