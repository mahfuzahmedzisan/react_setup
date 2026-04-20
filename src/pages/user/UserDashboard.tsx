import { PageMeta } from '@/components/seo/PageMeta';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function UserDashboard() {
  return (
    <>
      <PageMeta
        title="Dashboard"
        description="Your personal dashboard: overview, account shortcuts, and cart."
        keywords={['dashboard', 'user', 'overview']}
      />
      <DashboardLayout
        title="Dashboard"
        nav={[
          { label: 'Overview', to: '/dashboard' },
          { label: 'Account', to: '/account' },
          { label: 'Cart', to: '/cart' },
        ]}
      >
        <Card>
          <CardHeader>
            <CardTitle>User Dashboard</CardTitle>
            <CardDescription>Your personal area</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Replace this with user pages (profile, addresses, orders, etc.).
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
