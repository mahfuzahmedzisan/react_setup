function required(name: string) {
  const v = (import.meta.env as Record<string, string | undefined>)[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

export type AuthStrategy = 'bearer_memory' | 'http_only_cookie'

/** Where to keep the Bearer token when using Passport JSON (no HttpOnly cookie from API). */
export type BearerTokenPersistence = 'memory' | 'session' | 'local'

function authStrategyFromEnv(): AuthStrategy {
  const raw = (import.meta.env.VITE_AUTH_STRATEGY as string | undefined)?.toLowerCase()
  if (raw === 'http_only_cookie' || raw === 'cookie') return 'http_only_cookie'
  return 'bearer_memory'
}

function bearerTokenPersistenceFromEnv(): BearerTokenPersistence {
  const raw = (import.meta.env.VITE_BEARER_TOKEN_STORAGE as string | undefined)?.toLowerCase()
  if (raw === 'memory' || raw === 'ram') return 'memory'
  if (raw === 'local' || raw === 'localstorage') return 'local'
  if (raw === 'session' || raw === 'sessionstorage') return 'session'
  // Default: survives hard refresh in this tab; standard SPA compromise when API only returns Bearer JSON
  return 'session'
}

export const env = {
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  // Vite only exposes env vars to the client when prefixed with VITE_
  apiBaseUrl: required('VITE_API_BASE_URL'),
  /**
   * `bearer_memory` — Passport returns `token` in JSON; see `bearerTokenPersistence`.
   * `http_only_cookie` — Backend sets HttpOnly session cookie; no Bearer in JS.
   */
  authStrategy: authStrategyFromEnv(),
  /**
   * Only for `bearer_memory`. `session` (default) survives Ctrl+Shift+R in this tab.
   * `local` = cross-tab until logout. `memory` = never survives reload.
   */
  bearerTokenPersistence: bearerTokenPersistenceFromEnv(),
  /** Laravel `UserManagementController@me` — path after `VITE_API_BASE_URL` (e.g. `/me`) */
  authMePath: import.meta.env.VITE_AUTH_ME_PATH ?? '/me',
  /** Optional: POST to clear server session + cookies (e.g. `/logout`) */
  authLogoutPath: import.meta.env.VITE_AUTH_LOGOUT_PATH ?? '/logout',
}
