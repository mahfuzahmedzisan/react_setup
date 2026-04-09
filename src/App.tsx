import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppBootstrap } from "@/AppBootstrap";
import { AuthProvider } from "@/auth/AuthProvider";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <AppBootstrap />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}
