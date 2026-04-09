import { env, type BearerTokenPersistence } from '@/config/env'

const STORAGE_KEY = 'mts_ecom.bearer_token'

/** In-RAM only — lost on full reload. */
let memoryToken: string | null = null

function readFromPersistence(mode: BearerTokenPersistence): string | null {
  if (typeof window === 'undefined') return null
  if (mode === 'memory') return memoryToken
  try {
    if (mode === 'session') return sessionStorage.getItem(STORAGE_KEY)
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writePersistence(mode: BearerTokenPersistence, token: string) {
  if (typeof window === 'undefined') return
  if (mode === 'memory') {
    memoryToken = token
    return
  }
  try {
    if (mode === 'session') {
      sessionStorage.setItem(STORAGE_KEY, token)
      return
    }
    localStorage.setItem(STORAGE_KEY, token)
  } catch {
    memoryToken = token
  }
}

function clearAllStoredTokens() {
  memoryToken = null
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

/**
 * Passport Bearer token location (only for `bearer_memory` strategy).
 *
 * - `memory` — never survives reload (most XSS-resistant client option; worst UX).
 * - `session` — **default**; survives Ctrl+Shift+R and F5 in this tab; cleared when tab closes.
 * - `local` — survives reload and new tabs until logout; common for SPAs when no HttpOnly refresh cookie exists (XSS can read it — mitigate with CSP).
 *
 * HttpOnly cookies are not available from your current API; persistence requires one of the above.
 */
export function getAccessToken(): string | null {
  if (env.authStrategy === 'http_only_cookie') return null
  return readFromPersistence(env.bearerTokenPersistence)
}

export function setAccessToken(token: string) {
  if (env.authStrategy === 'http_only_cookie') return
  writePersistence(env.bearerTokenPersistence, token)
}

export function clearAccessToken() {
  clearAllStoredTokens()
}
