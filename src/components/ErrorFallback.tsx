import { type FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl items-center justify-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('errors.somethingWentWrong')}</CardTitle>
          <CardDescription>
            {t('errors.unexpectedError')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <pre className="max-h-56 overflow-auto rounded-md border bg-muted p-3 text-xs">
            {error instanceof Error ? error.message : String(error)}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={resetErrorBoundary}>
              {t('errors.reloadPage')}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>
              {t('errors.reloadPage')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
