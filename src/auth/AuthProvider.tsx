import * as React from 'react'

import { api } from '@/api/client'
import { AuthContext, type AuthContextValue } from '@/auth/context'
import { fetchCurrentUser } from '@/auth/session'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/auth/token'
import { type AuthUser } from '@/auth/types'
import { getRoleLogoutPath } from '@/auth/rolePolicy'
import { getUserRoles } from '@/auth/roles'
import { env } from '@/config/env'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessTokenState, setAccessTokenState] = React.useState<string | null>(
    () => getAccessToken(),
  )
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [isSessionLoading, setIsSessionLoading] = React.useState(
    () => env.authStrategy === 'http_only_cookie',
  )
  const [isUserLoading, setIsUserLoading] = React.useState(() => {
    return env.authStrategy === 'bearer_memory' && Boolean(getAccessToken())
  })

  const refreshSession = React.useCallback(async (): Promise<AuthUser | null> => {
    setIsUserLoading(true)
    try {
      const u = await fetchCurrentUser()
      // Never overwrite a known user with null due to a transient /me failure.
      if (u) setUser(u)
      return u
    } finally {
      setIsUserLoading(false)
    }
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
    setIsUserLoading(false)
    try {
      if (env.logoutMode === 'multi') {
        const roles = getUserRoles(user)
        const roleLogout = roles.map((r) => getRoleLogoutPath(r)).find(Boolean)
        await api.post(roleLogout ?? env.authLogoutPath)
      } else {
        await api.post(env.authLogoutPath)
      }
    } catch {
      // Session may already be invalid; still clear client state
    }
  }, [user])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      authStrategy: env.authStrategy,
      accessToken: accessTokenState,
      isAuthenticated:
        env.authStrategy === 'http_only_cookie'
          ? Boolean(user)
          : Boolean(accessTokenState),
      isSessionLoading,
      isUserLoading,
      user,
      setToken,
      logout,
      setUser,
      refreshSession,
    }),
    [
      accessTokenState,
      isSessionLoading,
      isUserLoading,
      logout,
      refreshSession,
      setToken,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
