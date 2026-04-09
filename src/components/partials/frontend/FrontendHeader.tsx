import { Link, NavLink } from 'react-router-dom'

import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/button'
import { useAppearance } from '@/hooks/useAppearance'
import { cn } from '@/lib/utils'

export function FrontendHeader() {
  const { isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useAppearance()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-semibold tracking-tight">
          React + Vite + Laravel
        </Link>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                'text-muted-foreground hover:text-foreground',
                isActive && 'text-foreground',
              )
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              cn(
                'text-muted-foreground hover:text-foreground',
                isActive && 'text-foreground',
              )
            }
          >
            Cart
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
          {isAuthenticated ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void logout()
              }}
            >
              Logout
            </Button>
          ) : (
            <Button asChild type="button">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

