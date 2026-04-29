import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import { AppBootstrap } from '@/AppBootstrap';
import { AuthProvider } from '@/auth/AuthProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { WebVitalsDebugPanel } from '@/components/performance/WebVitalsDebugPanel';
import { useDocumentLanguage } from '@/hooks/useDocumentLanguage';
import { Toaster } from 'sonner';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const queryClient = new QueryClient();

export default function App() {
  useDocumentLanguage();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundary>
            <AppBootstrap />
            <WebVitalsDebugPanel />
            <Toaster
              position="top-right"
              richColors
              closeButton
              expand={true}
              duration={3000}
              icons={{
                success: <CheckCircle className="h-4 w-4" />,
                error: <XCircle className="h-4 w-4" />,
                warning: <AlertTriangle className="h-4 w-4" />,
                info: <Info className="h-4 w-4" />,
              }}
            />
          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
