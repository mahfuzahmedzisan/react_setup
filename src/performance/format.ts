import type { WebVitalName, WebVitalPayload, WebVitalRating } from '@/performance/types';

const UNIT_BY_METRIC: Record<WebVitalName, 'ms' | ''> = {
  CLS: '',
  INP: 'ms',
  LCP: 'ms',
  FCP: 'ms',
  TTFB: 'ms',
};

const ORDERED_METRICS: WebVitalName[] = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'];

export function getMetricUnit(name: WebVitalName) {
  return UNIT_BY_METRIC[name];
}

export function formatMetricValue(name: WebVitalName, value: number) {
  if (name === 'CLS') return value.toFixed(3);
  return Math.round(value).toString();
}

export function ratingLabel(rating: WebVitalRating) {
  if (rating === 'needs-improvement') return 'Needs Improvement';
  return rating.charAt(0).toUpperCase() + rating.slice(1);
}

export function metricRatingClass(rating: WebVitalRating) {
  if (rating === 'good') return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
  if (rating === 'needs-improvement') return 'bg-amber-500/20 text-amber-800 dark:text-amber-300';
  return 'bg-rose-500/20 text-rose-800 dark:text-rose-300';
}

export function latestMetricByName(metrics: WebVitalPayload[]) {
  const result = new Map<WebVitalName, WebVitalPayload>();

  for (const metric of metrics) {
    if (!result.has(metric.name)) {
      result.set(metric.name, metric);
    }
  }

  return result;
}

export function metricOrder() {
  return ORDERED_METRICS;
}
