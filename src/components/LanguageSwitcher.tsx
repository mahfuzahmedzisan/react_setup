import { useTranslation } from 'react-i18next';

import { env } from '@/config/env';
import { languageRegistry } from '@/i18n';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const active = i18n.resolvedLanguage ?? i18n.language;

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">{t('common.language')}</span>
      <select
        aria-label={t('common.language')}
        className="rounded-md border bg-background px-2 py-1 text-sm"
        value={active}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value);
        }}
      >
        {env.i18nSupportedLanguages.map((code) => {
          const language = languageRegistry[code];
          return (
            <option key={language.code} value={language.code}>
              {language.nativeLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}
