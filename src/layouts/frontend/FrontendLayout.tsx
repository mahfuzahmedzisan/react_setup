import { Outlet } from 'react-router-dom'

import { FrontendFooter } from '@/components/partials/frontend/FrontendFooter'
import { FrontendHeader } from '@/components/partials/frontend/FrontendHeader'

export function FrontendLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <FrontendHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <FrontendFooter />
    </div>
  )
}

