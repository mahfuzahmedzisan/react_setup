import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/components/seo/PageMeta';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function UserDashboard() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t('common.dashboard')}
        description={t('dashboard.userArea')}
        keywords={t('meta.userDashboardKeywords')}
      />
      <DashboardLayout
        title={t('common.dashboard')}
        nav={[
          { label: t('dashboard.overview'), to: '/dashboard' },
          { label: t('common.account'), to: '/account' },
          { label: t('common.cart'), to: '/cart' },
        ]}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.userDashboard')}</CardTitle>
            <CardDescription>{t('dashboard.userArea')}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t('dashboard.userStub')}
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
