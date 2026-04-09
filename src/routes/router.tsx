import { createBrowserRouter } from "react-router-dom";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Account from "@/pages/Account";
import Cart from "@/pages/Cart";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminLogin from "@/pages/admin/AdminLogin";
import SellerDashboard from "@/pages/seller/SellerDashboard";
import SellerLogin from "@/pages/seller/SellerLogin";
import UserDashboard from "@/pages/user/UserDashboard";
import BuyerDashboard from "@/pages/buyer/BuyerDashboard";
import VendorDashboard from "@/pages/vendor/VendorDashboard";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleGate } from "@/routes/RoleGate";
import { GuestGate } from "@/routes/GuestGate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: (
      <GuestGate roleScope="user">
        <Login />
      </GuestGate>
    ),
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/account",
    element: (
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RoleGate allow={["user", "buyer"]} fallback="/unauthorized">
        <UserDashboard />
      </RoleGate>
    ),
  },
  {
    path: "/buyer",
    element: (
      <RoleGate allow="buyer" fallback="/unauthorized">
        <BuyerDashboard />
      </RoleGate>
    ),
  },
  {
    path: "/vendor",
    element: (
      <RoleGate allow="vendor" fallback="/unauthorized">
        <VendorDashboard />
      </RoleGate>
    ),
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/admin/login",
    element: (
      <GuestGate roleScope="admin">
        <AdminLogin />
      </GuestGate>
    ),
  },
  {
    path: "/admin",
    element: <RoleGate allow="admin" fallback="/admin/login"><AdminDashboard /></RoleGate>,
  },
  {
    path: "/admin/users",
    element: <RoleGate allow="admin" fallback="/admin/login"><AdminUsers /></RoleGate>,
  },
  {
    path: "/admin/orders",
    element: <RoleGate allow="admin" fallback="/admin/login"><AdminOrders /></RoleGate>,
  },
  {
    path: "/admin/products",
    element: <RoleGate allow="admin" fallback="/admin/login"><AdminProducts /></RoleGate>,
  },
  {
    path: "/seller/login",
    element: (
      <GuestGate roleScope="seller">
        <SellerLogin />
      </GuestGate>
    ),
  },
  {
    path: "/seller",
    element: (
      <RoleGate allow="seller" fallback="/seller/login">
        <SellerDashboard />
      </RoleGate>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
