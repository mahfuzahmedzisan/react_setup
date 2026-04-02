import { createBrowserRouter } from 'react-router-dom'

import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Account from '@/pages/Account'
import Cart from '@/pages/Cart'
import NotFound from '@/pages/NotFound'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/account',
    element: (
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

