export type WebVitalName = 'CLS' | 'INP' | 'LCP' | 'FCP' | 'TTFB';

export type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

export interface WebVitalPayload {
  name: WebVitalName;
  value: number;
  delta: number;
  rating: WebVitalRating;
  id: string;
  navigationType: string;
  entriesCount: number;
  reportedAt: string;
  attribution?: Record<string, unknown>;
}

export type WebVitalReporter = (payload: WebVitalPayload) => void | Promise<void>;
