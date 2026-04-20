import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function VendorDashboard() {
  const { t } = useTranslation();

  return (
    <DashboardLayout
      title={t('dashboard.vendor')}
      nav={[
        { label: t('common.dashboard'), to: '/vendor' },
        { label: t('common.account'), to: '/account' },
        { label: t('dashboard.orders'), to: '/vendor/orders' },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.vendorDashboard')}</CardTitle>
          <CardDescription>{t('dashboard.vendorArea')}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {t('dashboard.vendorStub')}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
