export type LanguageCode = 'en' | 'ar' | 'bn' | 'es' | 'zh' | 'hi';
export type LanguageDirection = 'ltr' | 'rtl';

export type LanguageDefinition = {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  dir: LanguageDirection;
};

export const RECOMMENDED_LANGUAGES: Record<LanguageCode, LanguageDefinition> = {
  en: { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  ar: { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' },
  bn: { code: 'bn', label: 'Bangla', nativeLabel: 'বাংলা', dir: 'ltr' },
  es: { code: 'es', label: 'Spanish', nativeLabel: 'Español', dir: 'ltr' },
  zh: { code: 'zh', label: 'Chinese', nativeLabel: '中文', dir: 'ltr' },
  hi: { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', dir: 'ltr' },
};

export const FALLBACK_LANGUAGE: LanguageCode = 'en';

export function normalizeLanguageCode(input: string | null | undefined): string | null {
  if (!input) return null;
  const cleaned = input.trim().toLowerCase();
  if (!cleaned) return null;
  return cleaned.split('-')[0] ?? null;
}

export function isLanguageCode(input: string): input is LanguageCode {
  return input in RECOMMENDED_LANGUAGES;
}

export function toLanguageCode(input: string | null | undefined): LanguageCode | null {
  const normalized = normalizeLanguageCode(input);
  if (!normalized) return null;
  return isLanguageCode(normalized) ? normalized : null;
}

export function getLanguageDirection(code: string): LanguageDirection {
  return RECOMMENDED_LANGUAGES[toLanguageCode(code) ?? FALLBACK_LANGUAGE].dir;
}

export function getLanguageName(code: string) {
  return RECOMMENDED_LANGUAGES[toLanguageCode(code) ?? FALLBACK_LANGUAGE];
}
