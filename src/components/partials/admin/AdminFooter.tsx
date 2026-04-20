import { useTranslation } from 'react-i18next';

export function AdminFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground">
        {t('admin.adminArea')}
      </div>
    </footer>
  );
}
