import axios, { type AxiosError, type AxiosInstance } from 'axios'

import { clearAccessToken, getAccessToken } from '@/auth/token'
import { env } from '@/config/env'

function shouldLog() {
  return env.isDev
}

export const api: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  if (shouldLog()) {
    console.debug('[api] request', {
      method: config.method,
      url: config.baseURL ? `${config.baseURL}${config.url ?? ''}` : config.url,
      params: config.params,
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
      const next = encodeURIComponent(window.location.pathname + window.location.search)
      window.location.assign(`/login?next=${next}`)
    }

    return Promise.reject(err)
  },
)

