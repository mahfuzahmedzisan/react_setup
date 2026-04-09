import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { isActivePath } from '@/lib/nav.utils'
import { useActiveUrl } from '@/hooks/useActiveUrl'

const items = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
]

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { pathname } = useActiveUrl()

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
          'fixed left-4 top-16 w-[min(260px,calc(100vw-2rem))] transition-transform md:static md:w-auto',
          open ? 'translate-x-0' : '-translate-x-[120%] md:block',
        )}
      >
      <div className="mb-3 flex items-center justify-between md:hidden">
        <div className="text-sm font-medium">Admin</div>
        <button className="text-sm text-muted-foreground" onClick={onClose} type="button">
          Close
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
  )
}

