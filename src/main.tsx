import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import './index.css'
import { AuthProvider } from '@/auth/AuthProvider'
import { ErrorFallback } from '@/components/ErrorFallback'
import { router } from '@/routes/router'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
