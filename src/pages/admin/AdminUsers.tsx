import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/components/seo/PageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function AdminUsers() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={`${t('admin.admin')} - ${t('dashboard.users')}`}
        description={t('meta.adminDescription')}
        keywords={t('meta.usersKeywords')}
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
            <CardTitle>{t('dashboard.users')}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t('admin.usersStub')}
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
