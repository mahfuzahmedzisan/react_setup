import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/auth/useAuth';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/useAppearance';
import { cn } from '@/lib/utils';

export function FrontendHeader() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useAppearance();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-semibold tracking-tight">
          {t('common.appName')}
        </Link>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn('text-muted-foreground hover:text-foreground', isActive && 'text-foreground')
            }
            end
          >
            {t('common.home')}
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              cn('text-muted-foreground hover:text-foreground', isActive && 'text-foreground')
            }
          >
            {t('common.cart')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button type="button" variant="outline" onClick={() => toggleTheme()}>
            {theme === 'light' ? t('common.dark') : t('common.light')}
          </Button>
          {isAuthenticated ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void logout();
              }}
            >
              {t('common.logout')}
            </Button>
          ) : (
            <Button asChild type="button">
              <Link to="/login">{t('common.signIn')}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
