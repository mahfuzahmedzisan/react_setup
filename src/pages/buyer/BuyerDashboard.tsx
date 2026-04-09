import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/layouts/DashboardLayout'

export default function BuyerDashboard() {
  return (
    <DashboardLayout
      title="Buyer"
      nav={[
        { label: 'Dashboard', to: '/buyer' },
        { label: 'Account', to: '/account' },
        { label: 'Cart', to: '/cart' },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Buyer Dashboard</CardTitle>
          <CardDescription>Buyer-only area</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Replace this with buyer pages (wishlists, orders, addresses, etc.).
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

