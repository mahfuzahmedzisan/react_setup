import { createBrowserRouter, Outlet } from 'react-router-dom';

import Home from '@/pages/Home';
import Cart from '@/pages/Cart';
import FeedDemoPage from '@/pages/demo/FeedDemoPage';
import CatalogDemoPage from '@/pages/demo/CatalogDemoPage';
import ReelsDemoPage from '@/pages/demo/ReelsDemoPage';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

import Login from '@/pages/Login';

import UserDashboard from '@/pages/user/UserDashboard';
import Account from '@/pages/Account';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminProducts from '@/pages/admin/AdminProducts';
import Performance from '@/pages/Performance';

import { FrontendLayout } from '@/layouts/frontend/FrontendLayout';
import { AuthLayout } from '@/layouts/auth/AuthLayout';
import { AdminLayout } from '@/layouts/admin/AdminLayout';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';

import { RoleGate } from '@/routes/RoleGate';
import { GuestGate } from '@/routes/GuestGate';

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <FrontendLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/cart', element: <Cart /> },
          { path: '/demo/feed', element: <FeedDemoPage /> },
          { path: '/demo/catalog', element: <CatalogDemoPage /> },
          { path: '/demo/reels', element: <ReelsDemoPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: (
              <GuestGate>
                <Login />
              </GuestGate>
            ),
          },
        ],
      },
      {
        path: '/unauthorized',
        element: <Unauthorized />,
      },
      {
        element: (
          <RoleGate allow={['user', 'buyer']} fallback="/unauthorized">
            <Outlet />
          </RoleGate>
        ),
        children: [
          { path: '/dashboard', element: <UserDashboard /> },
          { path: '/account', element: <Account /> },
        ],
      },
      {
        element: (
          <RoleGate allow="admin" fallback="/login">
            <AdminLayout />
          </RoleGate>
        ),
        children: [
          { path: '/admin', element: <AdminDashboard /> },
          { path: '/admin/users', element: <AdminUsers /> },
          { path: '/admin/orders', element: <AdminOrders /> },
          { path: '/admin/products', element: <AdminProducts /> },
          { path: '/admin/performance', element: <Performance /> },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
