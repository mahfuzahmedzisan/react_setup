import { api } from '@/api/client'
import { extractUserFromAuthPayload } from '@/api/laravelResponse'
import { env } from '@/config/env'
import { type AuthUser } from '@/auth/types'

/** GET current user — Laravel Passport Bearer or cookie session. */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await api.get<unknown>(env.authMePath, {
      skipAuthRedirect: true,
    })
    return extractUserFromAuthPayload(res.data)
  } catch {
    return null
  }
}
