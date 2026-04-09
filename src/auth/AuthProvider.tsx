import * as React from 'react'

import { api } from '@/api/client'
import { AuthContext, type AuthContextValue } from '@/auth/context'
import { fetchCurrentUser } from '@/auth/session'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/auth/token'
import { type AuthUser } from '@/auth/types'
import { env } from '@/config/env'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessTokenState, setAccessTokenState] = React.useState<string | null>(
    () => getAccessToken(),
  )
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [isSessionLoading, setIsSessionLoading] = React.useState(
    () => env.authStrategy === 'http_only_cookie',
  )

  const refreshSession = React.useCallback(async (): Promise<AuthUser | null> => {
    const u = await fetchCurrentUser()
    setUser(u)
    // Do not clear the bearer token when /me is missing or fails to parse — the token may
    // still be valid; only logout and the global 401 handler should clear it.
    return u
  }, [])

  React.useEffect(() => {
    if (env.authStrategy !== 'http_only_cookie') {
      setIsSessionLoading(false)
      return
    }

    let cancelled = false
    void (async () => {
      const u = await fetchCurrentUser()
      if (!cancelled) {
        setUser(u)
        setIsSessionLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  // After reload, re-fetch profile when Bearer token was restored from session/local storage
  React.useEffect(() => {
    if (env.authStrategy !== 'bearer_memory') return
    if (!getAccessToken()) return
    void refreshSession()
  }, [refreshSession])

  const setToken = React.useCallback((token: string) => {
    setAccessToken(token)
    setAccessTokenState(token)
  }, [])

  const logout = React.useCallback(async () => {
    clearAccessToken()
    setAccessTokenState(null)
    setUser(null)
    try {
      await api.post(env.authLogoutPath)
    } catch {
      // Session may already be invalid; still clear client state
    }
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      authStrategy: env.authStrategy,
      accessToken: accessTokenState,
      isAuthenticated:
        env.authStrategy === 'http_only_cookie'
          ? Boolean(user)
          : Boolean(accessTokenState),
      isSessionLoading,
      user,
      setToken,
      logout,
      setUser,
      refreshSession,
    }),
    [
      accessTokenState,
      isSessionLoading,
      logout,
      refreshSession,
      setToken,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
