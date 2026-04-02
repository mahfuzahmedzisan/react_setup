import * as React from 'react'

import { type AuthUser } from '@/auth/types'

export type AuthContextValue = {
  accessToken: string | null
  isAuthenticated: boolean
  user: AuthUser | null
  setToken: (token: string) => void
  logout: () => void
  setUser: (user: AuthUser | null) => void
}

export const AuthContext = React.createContext<AuthContextValue | null>(null)

