import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/components/seo/PageMeta';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Unauthorized() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t('meta.unauthorizedTitle')}
        description={t('meta.unauthorizedDescription')}
        keywords={t('meta.unauthorizedKeywords')}
      />
      <div className="mx-auto flex min-h-dvh max-w-3xl items-center justify-center px-4 py-12">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('errors.unauthorized')}</CardTitle>
            <CardDescription>{t('errors.unauthorizedBody')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild type="button">
              <Link to="/">{t('errors.goHome')}</Link>
            </Button>
            <Button asChild variant="outline" type="button">
              <Link to="/login">{t('common.signIn')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
