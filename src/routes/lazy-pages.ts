import { lazy } from 'react';

export const HomePage = lazy(() => import('@/pages/Home'));
export const CartPage = lazy(() => import('@/pages/Cart'));
export const FeedDemoPage = lazy(() => import('@/pages/demo/FeedDemoPage'));
export const CatalogDemoPage = lazy(() => import('@/pages/demo/CatalogDemoPage'));
export const ReelsDemoPage = lazy(() => import('@/pages/demo/ReelsDemoPage'));
export const FormDemoPage = lazy(() => import('@/pages/demo/FormDemoPage'));
export const NotFoundPage = lazy(() => import('@/pages/NotFound'));
export const UnauthorizedPage = lazy(() => import('@/pages/Unauthorized'));
export const LoginPage = lazy(() => import('@/pages/Login'));
export const UserDashboardPage = lazy(() => import('@/pages/user/UserDashboard'));
export const AccountPage = lazy(() => import('@/pages/Account'));
export const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboard'));
export const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsers'));
export const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrders'));
export const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProducts'));
export const PerformancePage = lazy(() => import('@/pages/Performance'));
export const ImageDemoPage = lazy(() => import('@/pages/demo/ImageDemoPage'));