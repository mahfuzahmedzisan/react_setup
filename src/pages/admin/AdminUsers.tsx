import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/layouts/DashboardLayout'

export default function AdminUsers() {
  return (
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
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Admin users page stub.
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

