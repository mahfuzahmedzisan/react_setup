import { env } from '@/config/env';
import { formatMetricValue, getMetricUnit, metricRatingClass, ratingLabel } from '@/performance/format';
import { useWebVitalMetrics } from '@/performance/store';

export function WebVitalsDebugPanel() {
  const metrics = useWebVitalMetrics();

  if (!env.webVitalsEnabled || !env.webVitalsDebug) return null;

  const latest = metrics.slice(0, 5);

  return (
    <aside className="fixed right-4 bottom-4 z-50 w-[min(92vw,380px)] rounded-lg border bg-background/95 p-3 text-xs shadow-lg backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold">Web Vitals (Debug)</p>
        <span className="text-muted-foreground">{latest.length} shown</span>
      </div>

      {latest.length === 0 ? (
        <p className="text-muted-foreground">
          Waiting for metrics. Navigate, scroll, and interact to generate samples.
        </p>
      ) : (
        <ul className="space-y-2">
          {latest.map((metric) => {
            const unit = getMetricUnit(metric.name);
            const value = formatMetricValue(metric.name, metric.value);

            return (
              <li
                key={`${metric.id}-${metric.reportedAt}`}
                className="rounded-md border bg-card px-2 py-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <strong>{metric.name}</strong>
                  <span className={`rounded-full px-2 py-0.5 ${metricRatingClass(metric.rating)}`}>
                    {ratingLabel(metric.rating)}
                  </span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  {value}
                  {unit ? ` ${unit}` : ''} at {new Date(metric.reportedAt).toLocaleTimeString()}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
