function required(name: string) {
  const v = (import.meta.env as Record<string, string | undefined>)[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

export const env = {
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  // Vite only exposes env vars to the client when prefixed with VITE_
  // See: https://vite.dev/guide/env-and-mode.html
  apiBaseUrl: required('VITE_API_BASE_URL'),
}

