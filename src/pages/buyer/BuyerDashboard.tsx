import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function BuyerDashboard() {
  const { t } = useTranslation();

  return (
    <DashboardLayout
      title={t('dashboard.buyer')}
      nav={[
        { label: t('common.dashboard'), to: '/buyer' },
        { label: t('common.account'), to: '/account' },
        { label: t('common.cart'), to: '/cart' },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.buyerDashboard')}</CardTitle>
          <CardDescription>{t('dashboard.buyerArea')}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {t('dashboard.buyerStub')}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
