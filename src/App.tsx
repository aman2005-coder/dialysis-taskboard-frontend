import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";
import { CareBoard } from "./pages/CareBoard";

// In a real app this comes from routing (React Router, TanStack Router, etc.)
const DEMO_PATIENT_ID = "patient-001";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <CareBoard patientId={DEMO_PATIENT_ID} />

      {/* Toast notifications — position top-right, out of workflow flow */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
        }}
      />

      {/* Remove this in production builds */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}

    </QueryClientProvider>
  );
}
