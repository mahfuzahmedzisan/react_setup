import * as React from 'react'

import { clearAccessToken, getAccessToken, setAccessToken } from '@/auth/token'
import { AuthContext, type AuthContextValue } from '@/auth/context'
import { type AuthUser } from '@/auth/types'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessTokenState, setAccessTokenState] = React.useState<string | null>(
    () => getAccessToken(),
  )
  const [user, setUser] = React.useState<AuthUser | null>(null)

  const setToken = React.useCallback((token: string) => {
    setAccessToken(token)
    setAccessTokenState(token)
  }, [])

  const logout = React.useCallback(() => {
    clearAccessToken()
    setAccessTokenState(null)
    setUser(null)
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      accessToken: accessTokenState,
      isAuthenticated: Boolean(accessTokenState),
      user,
      setToken,
      logout,
      setUser,
    }),
    [accessTokenState, logout, setToken, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

