function required(name: string) {
  const v = (import.meta.env as Record<string, string | undefined>)[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export type AuthStrategy = 'bearer_memory' | 'http_only_cookie';

/** Where to keep the Bearer token when using Passport JSON (no HttpOnly cookie from API). */
export type BearerTokenPersistence = 'memory' | 'session' | 'local';

/** How to interpret roles on the user object. */
export type RoleMode = 'single' | 'multi';

/** Whether login pages are single (global) or role-specific. */
export type LoginMode = 'single' | 'multi';

export type LogoutMode = 'single' | 'multi';
export type LanguageCode = 'en' | 'ar' | 'bn' | 'es' | 'zh' | 'hi';
export type WebVitalsReporter = 'console' | 'backend' | 'ga4';

function authStrategyFromEnv(): AuthStrategy {
  const raw = (import.meta.env.VITE_AUTH_STRATEGY as string | undefined)?.toLowerCase();
  if (raw === 'http_only_cookie' || raw === 'cookie') return 'http_only_cookie';
  return 'bearer_memory';
}

function bearerTokenPersistenceFromEnv(): BearerTokenPersistence {
  const raw = (import.meta.env.VITE_BEARER_TOKEN_STORAGE as string | undefined)?.toLowerCase();
  if (raw === 'memory' || raw === 'ram') return 'memory';
  if (raw === 'local' || raw === 'localstorage') return 'local';
  if (raw === 'session' || raw === 'sessionstorage') return 'session';
  // Default: survives hard refresh in this tab; standard SPA compromise when API only returns Bearer JSON
  return 'session';
}

function roleModeFromEnv(): RoleMode {
  const raw = (import.meta.env.VITE_ROLE_MODE as string | undefined)?.toLowerCase();
  if (raw === 'multi' || raw === 'multiple') return 'multi';
  return 'single';
}

function rolePolicyJsonFromEnv(): unknown | null {
  const raw = (import.meta.env.VITE_ROLE_POLICY_JSON as string | undefined)?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loginModeFromEnv(): LoginMode {
  const raw = (import.meta.env.VITE_LOGIN_MODE as string | undefined)?.toLowerCase();
  if (raw === 'multi' || raw === 'multiple') return 'multi';
  return 'single';
}

function logoutModeFromEnv(): LogoutMode {
  const raw = (import.meta.env.VITE_LOGOUT_MODE as string | undefined)?.toLowerCase();
  if (raw === 'multi' || raw === 'multiple') return 'multi';
  return 'single';
}

function refreshTokenConfigFromEnv() {
  const enabledFlag = import.meta.env.VITE_REFRESH_TOKEN_ENABLED === 'true';
  const path = (import.meta.env.VITE_AUTH_REFRESH_PATH as string | undefined)?.trim() ?? '';
  const key =
    (import.meta.env.VITE_REFRESH_TOKEN_BODY_KEY as string | undefined)?.trim() || 'refresh_token';
  const enabled = enabledFlag && path.length > 0;
  return { enabled, path, bodyKey: key };
}

const allowedLanguages = ['en', 'ar', 'bn', 'es', 'zh', 'hi'] as const;

function normalizeLanguageCode(input: string | null | undefined): LanguageCode | null {
  if (!input) return null;
  const normalized = input.trim().toLowerCase().split('-')[0];
  if (!normalized) return null;
  return allowedLanguages.includes(normalized as LanguageCode) ? (normalized as LanguageCode) : null;
}

function i18nSupportedLanguagesFromEnv(): LanguageCode[] {
  const raw = (import.meta.env.VITE_I18N_SUPPORTED_LANGS as string | undefined)?.trim();
  if (!raw) return ['en', 'ar', 'bn', 'es', 'zh', 'hi'];

  const parsed = raw
    .split(',')
    .map((item) => normalizeLanguageCode(item))
    .filter((item): item is LanguageCode => item !== null);

  const deduped = [...new Set(parsed)];
  return deduped.length > 0 ? deduped : ['en', 'ar', 'bn', 'es', 'zh', 'hi'];
}

function i18nDefaultLanguageFromEnv(supported: LanguageCode[]): LanguageCode {
  const fromEnv = normalizeLanguageCode(import.meta.env.VITE_I18N_DEFAULT_LANG as string | undefined);
  if (fromEnv && supported.includes(fromEnv)) return fromEnv;
  return 'en';
}

function boolFromEnv(value: string | undefined, fallback = false): boolean {
  if (value == null) return fallback;
  return value.trim().toLowerCase() === 'true';
}

function positiveNumberFromEnv(value: string | undefined, fallback: number): number {
  if (value == null) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function webVitalsReportersFromEnv(): WebVitalsReporter[] {
  const raw = (import.meta.env.VITE_WEB_VITALS_REPORTERS as string | undefined)?.trim();
  if (!raw) return [];

  const allow = new Set<WebVitalsReporter>(['console', 'backend', 'ga4']);
  const values = raw
    .split(',')
    .map((item) => item.trim().toLowerCase() as WebVitalsReporter)
    .filter((item) => allow.has(item));

  return [...new Set(values)];
}

const refreshTokenEnv = refreshTokenConfigFromEnv();
const i18nSupportedLanguages = i18nSupportedLanguagesFromEnv();
const webVitalsReporters = webVitalsReportersFromEnv();

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
  /** Role parsing: `single` uses `user.role`, `multi` uses `user.roles` (array) */
  roleMode: roleModeFromEnv(),
  /** Optional JSON overrides for role policy (fallback/dashboard mappings). */
  rolePolicyJson: rolePolicyJsonFromEnv(),
  /** Login pages mode: `single` redirects any authed user away from login; `multi` only redirects if the page matches their role. */
  loginMode: loginModeFromEnv(),
  /** Logout mode: `single` always uses `authLogoutPath`; `multi` can use rolePolicy logoutPath when present. */
  logoutMode: logoutModeFromEnv(),
  /**
   * When `true` **and** `authRefreshPath` is non-empty: POST refresh + retry on 401.
   * If disabled or path missing, refresh logic is not loaded.
   */
  refreshTokenEnabled: refreshTokenEnv.enabled,
  /** Path after `VITE_API_BASE_URL` (e.g. `/oauth/token` or `/refresh`) */
  authRefreshPath: refreshTokenEnv.path,
  /** JSON body field name for the refresh token (default `refresh_token`) */
  refreshTokenBodyKey: refreshTokenEnv.bodyKey,
  /** Supported languages for i18n (comma separated env value). */
  i18nSupportedLanguages,
  /** Default language if browser language is not supported. */
  i18nDefaultLanguage: i18nDefaultLanguageFromEnv(i18nSupportedLanguages),
  /** Guest token lifetime in days. Browser storage cannot expire by itself, so the app removes expired values when read. */
  guestTokenLifetimeDays: positiveNumberFromEnv(
    import.meta.env.VITE_GUEST_TOKEN_LIFETIME_DAYS as string | undefined,
    10,
  ),
  /** Toggle real-user web-vitals collection in runtime. */
  webVitalsEnabled: boolFromEnv(import.meta.env.VITE_WEB_VITALS_ENABLED as string | undefined),
  /** Extra logging and debug UI behaviors. */
  webVitalsDebug: boolFromEnv(import.meta.env.VITE_WEB_VITALS_DEBUG as string | undefined),
  /** Enabled reporter targets: console, backend, ga4. */
  webVitalsReporters,
  /** Full URL or relative API path for backend intake endpoint. */
  webVitalsBackendEndpoint: (import.meta.env.VITE_WEB_VITALS_BACKEND_ENDPOINT as string | undefined) ?? '',
  /** Optional auth header name/value for backend endpoint calls. */
  webVitalsBackendAuthHeaderName:
    (import.meta.env.VITE_WEB_VITALS_BACKEND_AUTH_HEADER as string | undefined) ?? '',
  webVitalsBackendAuthHeaderValue:
    (import.meta.env.VITE_WEB_VITALS_BACKEND_AUTH_TOKEN as string | undefined) ?? '',
  /** Enable GA4 reporter when gtag script is present. */
  webVitalsGa4Enabled: boolFromEnv(import.meta.env.VITE_WEB_VITALS_GA4_ENABLED as string | undefined),
  /** Reserved for future GA setup checks and docs. */
  webVitalsGa4MeasurementId:
    (import.meta.env.VITE_WEB_VITALS_GA4_MEASUREMENT_ID as string | undefined) ?? '',
};
