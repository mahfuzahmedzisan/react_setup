import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import { AppBootstrap } from '@/AppBootstrap';
import { AuthProvider } from '@/auth/AuthProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { useDocumentLanguage } from '@/hooks/useDocumentLanguage';

const queryClient = new QueryClient();

export default function App() {
  useDocumentLanguage();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundary>
            <AppBootstrap />
          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
