import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/auth/useAuth';
import Loading from '@/components/Loading';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isSessionLoading } = useAuth();
  const location = useLocation();

  if (isSessionLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
