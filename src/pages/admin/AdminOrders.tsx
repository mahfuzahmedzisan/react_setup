import { PageMeta } from '@/components/seo/PageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function AdminOrders() {
  return (
    <>
      <PageMeta
        title="Admin — Orders"
        description="View and manage customer orders from the admin panel."
        keywords={['admin', 'orders', 'management']}
      />
      <DashboardLayout
        title="Admin"
        nav={[
          { label: 'Dashboard', to: '/admin' },
          { label: 'Users', to: '/admin/users' },
          { label: 'Orders', to: '/admin/orders' },
          { label: 'Products', to: '/admin/products' },
        ]}
      >
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Admin orders page stub.
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
