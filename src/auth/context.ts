import * as React from 'react'

import { type AuthUser } from '@/auth/types'
import { type AuthStrategy } from '@/config/env'

export type AuthContextValue = {
  authStrategy: AuthStrategy
  accessToken: string | null
  isAuthenticated: boolean
  /** True while checking HttpOnly cookie session on load */
  isSessionLoading: boolean
  /** True while fetching the current user profile for role checks */
  isUserLoading: boolean
  user: AuthUser | null
  setToken: (token: string) => void
  logout: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  refreshSession: () => Promise<AuthUser | null>
}

export const AuthContext = React.createContext<AuthContextValue | null>(null)
