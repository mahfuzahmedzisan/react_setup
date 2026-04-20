import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { isActivePath } from '@/lib/nav.utils';
import { useActiveUrl } from '@/hooks/useActiveUrl';

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useActiveUrl();
  const { t } = useTranslation();
  const items = [
    { to: '/admin', label: t('common.dashboard'), end: true },
    { to: '/admin/users', label: t('dashboard.users') },
    { to: '/admin/orders', label: t('dashboard.orders') },
    { to: '/admin/products', label: t('dashboard.products') },
  ];

  return (
    <aside className="relative">
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        role="presentation"
      />
      <div
        className={cn(
          'z-50 rounded-lg border bg-card p-3',
          'md:sticky md:top-20 md:h-[calc(100dvh-7rem)] md:translate-x-0',
          'fixed top-16 left-4 w-[min(260px,calc(100vw-2rem))] transition-transform md:static md:w-auto',
          open ? 'translate-x-0' : '-translate-x-[120%] md:block',
        )}
      >
        <div className="mb-3 flex items-center justify-between md:hidden">
          <div className="text-sm font-medium">{t('admin.admin')}</div>
          <button className="text-sm text-muted-foreground" onClick={onClose} type="button">
            {t('common.close')}
          </button>
        </div>

        <nav className="grid gap-1">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.end as boolean | undefined}
              className={() =>
                cn(
                  'rounded-md px-3 py-2 text-sm transition-colors',
                  isActivePath(pathname, i.to, Boolean(i.end))
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )
              }
            >
              {i.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
