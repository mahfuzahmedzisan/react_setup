import axios, { type AxiosError, type AxiosInstance } from 'axios'

import { getXsrfTokenFromCookie } from '@/auth/csrf'
import { clearAccessToken, getAccessToken } from '@/auth/token'
import { env, type AuthStrategy } from '@/config/env'

function shouldLog() {
  return env.isDev
}

function shouldAttachBearer(strategy: AuthStrategy) {
  return strategy === 'bearer_memory'
}

function isLoginRoute(pathname: string) {
  return pathname === '/login' || pathname.startsWith('/login/')
}

export const api: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
  // Required for cross-origin HttpOnly cookies (Laravel Passport / Sanctum SPA)
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {}

  if (shouldAttachBearer(env.authStrategy)) {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  const method = config.method?.toLowerCase() ?? 'get'
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    const xsrf = getXsrfTokenFromCookie()
    if (xsrf) {
      config.headers['X-XSRF-TOKEN'] = xsrf
    }
  }

  if (shouldLog()) {
    console.debug('[api] request', {
      method: config.method,
      url: config.baseURL ? `${config.baseURL}${config.url ?? ''}` : config.url,
      params: config.params,
      auth: env.authStrategy,
    })
  }

  return config
})

api.interceptors.response.use(
  (res) => {
    if (shouldLog()) {
      console.debug('[api] response', {
        status: res.status,
        url: res.config.url,
      })
    }
    return res
  },
  (err: AxiosError) => {
    if (shouldLog()) {
      console.debug('[api] error', {
        status: err.response?.status,
        url: err.config?.url,
        message: err.message,
      })
    }

    if (err.response?.status === 401) {
      clearAccessToken()

      // Never redirect on "who am I?" probes — 401 means "not logged in", not "go to login"
      // (otherwise /login + fetchCurrentUser() creates an infinite ?next= nesting loop).
      if (err.config?.skipAuthRedirect) {
        return Promise.reject(err)
      }

      if (typeof window !== 'undefined' && isLoginRoute(window.location.pathname)) {
        return Promise.reject(err)
      }

      const next = encodeURIComponent(
        window.location.pathname + window.location.search,
      )
      window.location.assign(`/login?next=${next}`)
    }

    return Promise.reject(err)
  },
)
