import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/components/seo/PageMeta';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function AdminDashboard() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t('meta.adminTitle')}
        description={t('meta.adminDescription')}
        keywords={t('meta.adminKeywords')}
      />
      <DashboardLayout
        title={t('admin.admin')}
        nav={[
          { label: t('common.dashboard'), to: '/admin' },
          { label: t('dashboard.users'), to: '/admin/users' },
          { label: t('dashboard.orders'), to: '/admin/orders' },
          { label: t('dashboard.products'), to: '/admin/products' },
        ]}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.adminDashboard')}</CardTitle>
            <CardDescription>{t('admin.adminOnly')}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t('admin.adminStub')}
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
