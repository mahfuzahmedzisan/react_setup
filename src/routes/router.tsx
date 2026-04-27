import { Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

import { FrontendLayout } from '@/layouts/frontend/FrontendLayout';
import { AuthLayout } from '@/layouts/auth/AuthLayout';
import { AdminLayout } from '@/layouts/admin/AdminLayout';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';
import {
  AccountPage,
  AdminDashboardPage,
  AdminOrdersPage,
  AdminProductsPage,
  AdminUsersPage,
  CartPage,
  CatalogDemoPage,
  FeedDemoPage,
  FormDemoPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  PerformancePage,
  ReelsDemoPage,
  UnauthorizedPage,
  UserDashboardPage,
} from '@/routes/lazy-pages';

import { RoleGate } from '@/routes/RoleGate';
import { GuestGate } from '@/routes/GuestGate';

function withSuspense(element: ReactNode) {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading page...</div>}>
      {element}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <FrontendLayout />,
        children: [
          { path: '/', element: withSuspense(<HomePage />) },
          { path: '/cart', element: withSuspense(<CartPage />) },
          { path: '/demo/feed', element: withSuspense(<FeedDemoPage />) },
          { path: '/demo/catalog', element: withSuspense(<CatalogDemoPage />) },
          { path: '/demo/reels', element: withSuspense(<ReelsDemoPage />) },
          { path: '/demo/form', element: withSuspense(<FormDemoPage />) },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: (
              <GuestGate>
                {withSuspense(<LoginPage />)}
              </GuestGate>
            ),
          },
        ],
      },
      {
        path: '/unauthorized',
        element: withSuspense(<UnauthorizedPage />),
      },
      {
        element: (
          <RoleGate allow={['user', 'buyer']} fallback="/unauthorized">
            <Outlet />
          </RoleGate>
        ),
        children: [
          { path: '/dashboard', element: withSuspense(<UserDashboardPage />) },
          { path: '/account', element: withSuspense(<AccountPage />) },
        ],
      },
      {
        element: (
          <RoleGate allow="admin" fallback="/login">
            <AdminLayout />
          </RoleGate>
        ),
        children: [
          { path: '/admin', element: withSuspense(<AdminDashboardPage />) },
          { path: '/admin/users', element: withSuspense(<AdminUsersPage />) },
          { path: '/admin/orders', element: withSuspense(<AdminOrdersPage />) },
          { path: '/admin/products', element: withSuspense(<AdminProductsPage />) },
          { path: '/admin/performance', element: withSuspense(<PerformancePage />) },
        ],
      },
      {
        path: '*',
        element: withSuspense(<NotFoundPage />),
      },
    ],
  },
]);
