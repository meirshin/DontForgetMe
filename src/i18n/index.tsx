import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';
import NativeCarBluetooth from '../../specs/NativeCarBluetooth';
import { ar } from './ar';
import { bn } from './bn';
import { de } from './de';
import { en, type Strings } from './en';
import { es } from './es';
import { fr } from './fr';
import { he } from './he';
import { hi } from './hi';
import { id } from './id';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { pt } from './pt';
import { ru } from './ru';
import { tr } from './tr';
import { vi } from './vi';
import { zh } from './zh';

export type { Strings };

const strings = {
  en,
  he,
  ar,
  zh,
  es,
  fr,
  it,
  pt,
  ru,
  de,
  hi,
  bn,
  ja,
  id,
  tr,
  ko,
  vi,
};

export type Lang = keyof typeof strings;

/** Languages offered in the settings, by their own name. */
export const languages: { code: Lang; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'he', name: 'עברית' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '简体中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
];

const RTL_LANGUAGES: Lang[] = ['he', 'ar'];

const isLang = (code: string): code is Lang => code in strings;

/** Java still reports a few languages by their old codes. */
const LEGACY_CODES: Record<string, string> = { iw: 'he', in: 'id', ji: 'yi' };

function getDeviceLanguageSafe(): string {
  return typeof NativeCarBluetooth.getDeviceLanguage === 'function'
    ? NativeCarBluetooth.getDeviceLanguage()
    : 'en';
}

function getSavedLanguageSafe(): string {
  return typeof NativeCarBluetooth.getLanguage === 'function'
    ? NativeCarBluetooth.getLanguage()
    : '';
}

function setSavedLanguageSafe(language: Lang | ''): void {
  if (typeof NativeCarBluetooth.setLanguage === 'function') {
    NativeCarBluetooth.setLanguage(language);
  }
}

/** The phone's language if the app speaks it, otherwise English. */
export function phoneLanguage(): Lang {
  const code = getDeviceLanguageSafe();
  const normalized = LEGACY_CODES[code] ?? code;
  return isLang(normalized) ? normalized : 'en';
}

type I18n = {
  /** The language in use. */
  lang: Lang;
  /** What the user picked in the settings; '' follows the phone. */
  choice: Lang | '';
  t: Strings;
  rtl: boolean;
  setChoice: (choice: Lang | '') => void;
};

const I18nContext = createContext<I18n>({
  lang: 'en',
  choice: '',
  t: en,
  rtl: false,
  setChoice: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoiceState] = useState<Lang | ''>(() => {
    const saved = getSavedLanguageSafe();
    return isLang(saved) ? saved : '';
  });

  // The phone's language can change while the app is in the background.
  const [phone, setPhone] = useState(phoneLanguage);
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') setPhone(phoneLanguage());
    });
    return () => sub.remove();
  }, []);

  const setChoice = useCallback((next: Lang | '') => {
    setSavedLanguageSafe(next);
    setChoiceState(next);
  }, []);

  const value = useMemo(() => {
    const lang = choice || phone;
    return {
      lang,
      choice,
      t: strings[lang],
      rtl: RTL_LANGUAGES.includes(lang),
      setChoice,
    };
  }, [choice, phone, setChoice]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
