import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/layouts/DashboardLayout'

export default function VendorDashboard() {
  return (
    <DashboardLayout
      title="Vendor"
      nav={[
        { label: 'Dashboard', to: '/vendor' },
        { label: 'Account', to: '/account' },
        { label: 'Orders', to: '/vendor/orders' },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Vendor Dashboard</CardTitle>
          <CardDescription>Vendor-only area</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Replace this with vendor pages (stores, listings, fulfillment, etc.).
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

