import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    /** When true, 401 does not navigate to /login (session probes, login page). */
    skipAuthRedirect?: boolean
  }
}
