import { FALLBACK_LANGUAGE, type LanguageCode } from '@/i18n/languages';

import ar from '@/i18n/locales/ar.json';
import bn from '@/i18n/locales/bn.json';
import en from '@/i18n/locales/en.json';
import es from '@/i18n/locales/es.json';
import hi from '@/i18n/locales/hi.json';
import zh from '@/i18n/locales/zh.json';

export const resources: Record<LanguageCode, { translation: Record<string, unknown> }> = {
  en: { translation: en },
  ar: { translation: ar },
  bn: { translation: bn },
  es: { translation: es },
  zh: { translation: zh },
  hi: { translation: hi },
};

export const fallbackLanguage = FALLBACK_LANGUAGE;
