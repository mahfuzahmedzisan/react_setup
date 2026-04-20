import { env } from '@/config/env';
import type { WebVitalReporter } from '@/performance/types';

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, eventParams?: Record<string, unknown>) => void;
  }
}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
} as const;

export function composeReporters(reporters: WebVitalReporter[]): WebVitalReporter {
  return (payload) => {
    for (const reporter of reporters) {
      try {
        void reporter(payload);
      } catch (error) {
        if (env.webVitalsDebug) {
          console.warn('[web-vitals] reporter failed', error);
        }
      }
    }
  };
}

export const consoleReporter: WebVitalReporter = (payload) => {
  const label = `[web-vitals] ${payload.name}`;
  console.info(label, payload);
};

function buildBackendUrl() {
  const endpoint = env.webVitalsBackendEndpoint.trim();
  if (!endpoint) return '';
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  return `${env.apiBaseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
}

export const backendReporter: WebVitalReporter = (payload) => {
  const endpoint = buildBackendUrl();
  if (!endpoint) return;

  const body = JSON.stringify({
    ...payload,
    appMode: env.mode,
    pagePath: window.location.pathname,
    pageUrl: window.location.href,
    userAgent: navigator.userAgent,
  });

  const authHeaderName = env.webVitalsBackendAuthHeaderName.trim();
  const authHeaderValue = env.webVitalsBackendAuthHeaderValue.trim();
  const headers: Record<string, string> = { ...JSON_HEADERS };

  if (authHeaderName && authHeaderValue) {
    headers[authHeaderName] = authHeaderValue;
  }

  const beaconSent = navigator.sendBeacon?.(
    endpoint,
    new Blob([body], {
      type: JSON_HEADERS['Content-Type'],
    }),
  );

  if (beaconSent) return;

  void fetch(endpoint, {
    method: 'POST',
    headers,
    body,
    keepalive: true,
    mode: 'cors',
  }).catch((error) => {
    if (env.webVitalsDebug) {
      console.warn('[web-vitals] backend reporter fetch failed', error);
    }
  });
};

const GA4_EVENT_PREFIX = 'web_vital_';

export const ga4Reporter: WebVitalReporter = (payload) => {
  if (!env.webVitalsGa4Enabled) return;
  if (!window.gtag) return;

  window.gtag('event', `${GA4_EVENT_PREFIX}${payload.name.toLowerCase()}`, {
    metric_name: payload.name,
    metric_id: payload.id,
    metric_value: payload.value,
    metric_delta: payload.delta,
    metric_rating: payload.rating,
    page_path: window.location.pathname,
    page_location: window.location.href,
  });
};
