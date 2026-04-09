import { Outlet } from 'react-router-dom'

import { AdminFooter } from '@/components/partials/admin/AdminFooter'
import { AdminHeader } from '@/components/partials/admin/AdminHeader'
import { AdminSidebar } from '@/components/partials/admin/AdminSidebar'
import { useNav } from '@/hooks/useNav'

export function AdminLayout() {
  const nav = useNav()

  return (
    <div className="min-h-dvh bg-background">
      <AdminHeader onToggleSidebar={nav.toggle} />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[260px_1fr]">
        <AdminSidebar open={nav.open} onClose={nav.close} />
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
      <AdminFooter />
    </div>
  )
}

