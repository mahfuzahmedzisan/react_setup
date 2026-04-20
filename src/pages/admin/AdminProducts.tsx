import { PageMeta } from '@/components/seo/PageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function AdminProducts() {
  return (
    <>
      <PageMeta
        title="Admin — Products"
        description="Manage product catalog from the admin panel."
        keywords={['admin', 'products', 'catalog']}
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
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Admin products page stub.
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
