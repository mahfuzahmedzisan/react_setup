const ACCESS_TOKEN_KEY = 'mts_ecom.access_token'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? null
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

