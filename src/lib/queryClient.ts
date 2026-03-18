import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 30s stale time — clinical data changes slowly but shouldn't be stale too long
      staleTime:           30_000,
      // Cache for 5 minutes before garbage-collecting
      gcTime:              5 * 60 * 1000,
      // Retry failed queries twice with exponential back-off (default)
      retry:               2,
      // Avoid surprise re-fetches while a nurse is mid-workflow
      refetchOnWindowFocus: false,
      // Still refetch when the network reconnects after outage
      refetchOnReconnect:  true,
    },
    mutations: {
      // Mutations must NOT auto-retry — side effects (status changes) should
      // only fire once unless the user explicitly retries
      retry: 0,
    },
  },
});
