import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout
      title="Admin"
      nav={[
        { label: "Dashboard", to: "/admin" },
        { label: "Users", to: "/admin/users" },
        { label: "Orders", to: "/admin/orders" },
        { label: "Products", to: "/admin/products" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Admin-only area</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Replace this with your admin pages (users, orders, products, etc.).
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
