import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function SellerDashboard() {
  const { t } = useTranslation();

  return (
    <DashboardLayout
      title={t('dashboard.seller')}
      nav={[
        { label: t('common.dashboard'), to: '/seller' },
        { label: t('dashboard.inventory'), to: '/seller/inventory' },
        { label: t('dashboard.orders'), to: '/seller/orders' },
        { label: t('dashboard.payouts'), to: '/seller/payouts' },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.sellerDashboard')}</CardTitle>
          <CardDescription>{t('dashboard.sellerArea')}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {t('dashboard.sellerStub')}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
