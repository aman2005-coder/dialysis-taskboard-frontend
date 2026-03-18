import { Suspense } from "react";
import { TaskErrorBoundary } from "../components/TaskErrorBoundary";
import { PatientHeader } from "../components/features/PatientHeader";
import { TaskList } from "../components/features/TaskList";
import { TaskListSkeleton } from "../components/ui/TaskListSkeleton";

interface Props {
  patientId: string;
}

export function CareBoard({ patientId }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Care Plan Board</h1>
          <p className="text-sm text-gray-500 mt-1">Dialysis Center — Task Management</p>
        </div>

        {/* Patient info — has its own internal error handling */}
        <PatientHeader patientId={patientId} />

        {/* Task list — wrapped in error boundary so a crash here
            doesn't take down the whole page */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Tasks
          </h2>
          <TaskErrorBoundary>
            <Suspense fallback={<TaskListSkeleton />}>
              <TaskList patientId={patientId} />
            </Suspense>
          </TaskErrorBoundary>
        </section>

      </div>
    </div>
  );
}
