import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/layouts/DashboardLayout'

export default function SellerDashboard() {
  return (
    <DashboardLayout
      title="Seller"
      nav={[
        { label: 'Dashboard', to: '/seller' },
        { label: 'Inventory', to: '/seller/inventory' },
        { label: 'Orders', to: '/seller/orders' },
        { label: 'Payouts', to: '/seller/payouts' },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Seller Dashboard</CardTitle>
          <CardDescription>Seller-only area</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Replace this with seller pages (inventory, orders, payouts, etc.).
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

