import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals/attribution';
import type { Metric } from 'web-vitals/attribution';

import { env } from '@/config/env';
import {
  backendReporter,
  composeReporters,
  consoleReporter,
  ga4Reporter,
} from '@/performance/reporters';
import { addWebVitalMetric } from '@/performance/store';
import type { WebVitalName, WebVitalPayload, WebVitalReporter } from '@/performance/types';

let hasStarted = false;

function toPayload(metric: Metric): WebVitalPayload {
  const metricWithAttribution = metric as Metric & { attribution?: Record<string, unknown> };

  return {
    name: metric.name as WebVitalName,
    value: metric.value,
    delta: metric.delta,
    rating: metric.rating,
    id: metric.id,
    navigationType: metric.navigationType,
    entriesCount: metric.entries.length,
    reportedAt: new Date().toISOString(),
    attribution: metricWithAttribution.attribution,
  };
}

function resolveReporters(): WebVitalReporter[] {
  const reporters: WebVitalReporter[] = [];
  const enabled = new Set(env.webVitalsReporters);

  if (enabled.has('console') || env.webVitalsDebug) reporters.push(consoleReporter);
  if (enabled.has('backend')) reporters.push(backendReporter);
  if (enabled.has('ga4')) reporters.push(ga4Reporter);

  return reporters;
}

function registerMetric(metric: Metric, reporter: WebVitalReporter) {
  const payload = toPayload(metric);
  addWebVitalMetric(payload);
  reporter(payload);
}

export function startWebVitals() {
  if (!env.webVitalsEnabled || hasStarted) return;
  hasStarted = true;

  const reporters = resolveReporters();
  const fanoutReporter = composeReporters(reporters);

  onCLS((metric) => registerMetric(metric, fanoutReporter));
  onINP((metric) => registerMetric(metric, fanoutReporter));
  onLCP((metric) => registerMetric(metric, fanoutReporter));
  onFCP((metric) => registerMetric(metric, fanoutReporter));
  onTTFB((metric) => registerMetric(metric, fanoutReporter));

  if (env.webVitalsDebug) {
    console.info('[web-vitals] initialized', {
      reporters: env.webVitalsReporters,
      ga4Enabled: env.webVitalsGa4Enabled,
    });
  }
}
