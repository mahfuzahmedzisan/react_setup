import { Activity, RefreshCw, Trash2 } from 'lucide-react';

import { PageMeta } from '@/components/seo/PageMeta';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  formatMetricValue,
  getMetricUnit,
  latestMetricByName,
  metricOrder,
  metricRatingClass,
  ratingLabel,
} from '@/performance/format';
import { clearWebVitalMetrics, useWebVitalMetrics } from '@/performance/store';

export default function Performance() {
  const metrics = useWebVitalMetrics();
  const latestByName = latestMetricByName(metrics);
  const metricsCount = metrics.length;
  const hasData = metricsCount > 0;

  return (
    <>
      <PageMeta
        title="Performance Insights | Web Vitals"
        description="Live Web Vitals telemetry dashboard for diagnosing user-facing performance."
        keywords="web vitals, performance, rum, cls, lcp, inp, fcp, ttfb"
      />
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Activity className="h-5 w-5" /> Performance Insights
            </h1>
            <p className="text-sm text-muted-foreground">
              Live metrics from real browser sessions captured by web-vitals.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh page
            </Button>
            <Button type="button" variant="secondary" onClick={clearWebVitalMetrics}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear samples
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metricOrder().map((metricName) => {
            const metric = latestByName.get(metricName);
            const unit = getMetricUnit(metricName);
            const value = metric ? formatMetricValue(metricName, metric.value) : '--';

            return (
              <Card key={metricName}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{metricName}</CardTitle>
                  <CardDescription>Latest sample</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-semibold">
                    {value}
                    {unit ? <span className="ml-1 text-sm text-muted-foreground">{unit}</span> : null}
                  </div>
                  {metric ? (
                    <Badge className={metricRatingClass(metric.rating)} variant="secondary">
                      {ratingLabel(metric.rating)}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Captured Samples</CardTitle>
            <CardDescription>
              {hasData
                ? `${metricsCount} metrics captured in this tab session.`
                : 'No metrics yet. Interact with the page to generate samples.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {hasData ? (
              <div className="overflow-auto rounded-md border">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">Metric</th>
                      <th className="px-3 py-2 font-medium">Value</th>
                      <th className="px-3 py-2 font-medium">Rating</th>
                      <th className="px-3 py-2 font-medium">Navigation Type</th>
                      <th className="px-3 py-2 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric) => {
                      const unit = getMetricUnit(metric.name);
                      const ratingClass = metricRatingClass(metric.rating);
                      return (
                        <tr key={`${metric.id}-${metric.reportedAt}`} className="border-t">
                          <td className="px-3 py-2 font-medium">{metric.name}</td>
                          <td className="px-3 py-2">
                            {formatMetricValue(metric.name, metric.value)}
                            {unit ? ` ${unit}` : ''}
                          </td>
                          <td className="px-3 py-2">
                            <Badge variant="secondary" className={ratingClass}>
                              {ratingLabel(metric.rating)}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{metric.navigationType}</td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {new Date(metric.reportedAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
