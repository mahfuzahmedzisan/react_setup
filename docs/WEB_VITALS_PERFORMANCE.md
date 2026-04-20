# Web Vitals Production Setup and Testing

This project now includes production-ready real-user monitoring for Core Web Vitals using `web-vitals`.

## What is instrumented

- Metrics: `LCP`, `INP`, `CLS`, `FCP`, `TTFB`
- Collection entrypoint: `src/main.tsx` via `startWebVitals()`
- Reporters:
  - `console` reporter for local debugging
  - `backend` reporter with `sendBeacon` and `fetch` fallback
  - `ga4` reporter through `window.gtag` when configured
- In-app visibility:
  - floating debug panel (`src/components/performance/WebVitalsDebugPanel.tsx`)
  - dashboard page at `/admin/performance`

## Environment configuration

Add these variables to `.env` as needed:

```dotenv
# Enable/disable instrumentation
VITE_WEB_VITALS_ENABLED=true

# Enables verbose browser logs and floating debug widget
VITE_WEB_VITALS_DEBUG=true

# Comma-separated reporters: console,backend,ga4
VITE_WEB_VITALS_REPORTERS=console,backend,ga4

# Backend collector endpoint (absolute URL or relative path)
VITE_WEB_VITALS_BACKEND_ENDPOINT=/observability/web-vitals

# Optional header for backend auth
VITE_WEB_VITALS_BACKEND_AUTH_HEADER=X-Observability-Key
VITE_WEB_VITALS_BACKEND_AUTH_TOKEN=replace-me

# GA4 reporter toggle and metadata
VITE_WEB_VITALS_GA4_ENABLED=true
VITE_WEB_VITALS_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Recommended defaults by environment

- Local development:
  - `VITE_WEB_VITALS_ENABLED=true`
  - `VITE_WEB_VITALS_DEBUG=true`
  - `VITE_WEB_VITALS_REPORTERS=console`
- Staging:
  - `VITE_WEB_VITALS_ENABLED=true`
  - `VITE_WEB_VITALS_DEBUG=false`
  - `VITE_WEB_VITALS_REPORTERS=backend,ga4`
- Production:
  - `VITE_WEB_VITALS_ENABLED=true`
  - `VITE_WEB_VITALS_DEBUG=false`
  - `VITE_WEB_VITALS_REPORTERS=backend,ga4`

## How to test site performance

## 1) In-app real-user workflow

1. Start app: `npm run dev`
2. Open the app and perform real interactions:
   - route transitions
   - clicks, taps, typing
   - scroll and image-heavy views
3. Open `/admin/performance` to inspect captured metrics and ratings.
4. If debug mode is enabled, check floating panel updates in real time.

This validates runtime collection in the same way users experience the app.

## 2) Local Lighthouse workflow (manual)

For realistic checks, profile built assets instead of dev server:

1. Build app: `npm run build`
2. Serve built files: `npm run preview:perf`
3. Open Chrome DevTools Lighthouse tab
4. Run audits for:
   - `/`
   - `/admin/performance`
5. Repeat 3 times and compare medians.

## 3) Lighthouse CI workflow (automated)

This project includes `.lighthouserc.json`.

- If `@lhci/cli` is installed globally/in-project:
  - `npm run perf:lhci`
- Without installing:
  - `npm run perf:lhci:npx`

The config:

- runs 3 times
- audits `/` and `/admin/performance`
- applies recommended assertions with custom warnings for LCP/CLS/TTI
- uploads reports to temporary public storage

## 4) Backend reporter verification

When `backend` reporter is enabled:

- verify requests reach your collector endpoint
- validate payload includes:
  - `name`, `value`, `delta`, `rating`, `id`
  - `navigationType`, `reportedAt`
  - `pagePath`, `pageUrl`, `userAgent`
- ensure endpoint returns quickly and does not block unload flows

## 5) GA4 reporter verification

When `ga4` reporter is enabled and `gtag` is available:

- events are emitted as:
  - `web_vital_lcp`
  - `web_vital_inp`
  - `web_vital_cls`
  - `web_vital_fcp`
  - `web_vital_ttfb`
- key event params:
  - `metric_name`, `metric_id`, `metric_value`, `metric_delta`, `metric_rating`
  - `page_path`, `page_location`

Use GA4 DebugView to validate events before relying on reports.

## Threshold guidance

Use these guardrails during triage:

- LCP: good `<= 2500ms`
- INP: good `<= 200ms`
- CLS: good `<= 0.1`
- FCP: good `<= 1800ms`
- TTFB: good `<= 800ms`

## Performance triage loop

1. Detect regressions in `/admin/performance` and Lighthouse.
2. Correlate route and interaction type from metric samples.
3. Fix bottlenecks (bundle size, render cost, network latency, layout instability).
4. Re-run Lighthouse + in-app checks.
5. Keep thresholds and assertions updated as the product evolves.
