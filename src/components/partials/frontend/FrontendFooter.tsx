import { useTranslation } from 'react-i18next';

export function FrontendFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {t('common.appName')}
      </div>
    </footer>
  );
}
