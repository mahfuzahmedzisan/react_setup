import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/auth/useAuth'

export function AdminHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onToggleSidebar}>
            Menu
          </Button>
          <Link to="/admin" className="font-semibold tracking-tight">
            Admin
          </Link>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void logout()
          }}
        >
          Logout
        </Button>
      </div>
    </header>
  )
}

