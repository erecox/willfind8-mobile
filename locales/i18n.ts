import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '@/locales/en/translation.json';

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
  en,
});

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? 'en';
i18n.enableFallback = true;

export { i18n };