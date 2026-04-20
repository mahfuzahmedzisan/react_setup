import { useSyncExternalStore } from 'react';

import type { WebVitalPayload } from '@/performance/types';

type Listener = () => void;

const MAX_ITEMS = 50;
let metrics: WebVitalPayload[] = [];
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function addWebVitalMetric(metric: WebVitalPayload) {
  metrics = [metric, ...metrics].slice(0, MAX_ITEMS);
  emitChange();
}

export function clearWebVitalMetrics() {
  metrics = [];
  emitChange();
}

export function getWebVitalMetrics() {
  return metrics;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useWebVitalMetrics() {
  return useSyncExternalStore(subscribe, getWebVitalMetrics, getWebVitalMetrics);
}
