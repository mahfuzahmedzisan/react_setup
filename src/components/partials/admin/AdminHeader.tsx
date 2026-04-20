import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuth } from '@/auth/useAuth';

export function AdminHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onToggleSidebar}>
            {t('common.menu')}
          </Button>
          <Link to="/admin" className="font-semibold tracking-tight">
            {t('admin.admin')}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void logout();
            }}
          >
            {t('common.logout')}
          </Button>
        </div>
      </div>
    </header>
  );
}
