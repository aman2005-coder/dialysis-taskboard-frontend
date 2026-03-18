import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useUpdateTaskStatus } from "../../hooks/useUpdateTaskStatus";
import { TaskCard } from "../ui/TaskCard";
import { TaskListSkeleton } from "../ui/TaskListSkeleton";
import { StatsBar } from "../ui/StatsBar";
import { TaskStatus, StaffRole } from "../../types/enums";
import { TASK_STATUS_LABELS, STAFF_ROLE_LABELS } from "../../lib/constants";

interface Props {
  patientId: string;
}

export function TaskList({ patientId }: Props) {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "">("");
  const [filterRole,   setFilterRole]   = useState<StaffRole | "">("");
  const taskFilters = {
    patientId,
    ...(filterStatus ? { filterStatus } : {}),
    ...(filterRole ? { filterRole } : {}),
  };

  const { tasks, counts, isLoading, isError, error, refetch } = useTasks(taskFilters);

  const { mutate: updateStatus, variables: pendingVars, isPending } = useUpdateTaskStatus();

  if (isLoading) return <TaskListSkeleton />;

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">
          Failed to load tasks: {error?.message ?? "Unknown error"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-xs text-red-600 underline hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StatsBar counts={counts} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 py-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "")}
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700
                     hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {Object.values(TaskStatus).map((s) => (
            <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
          ))}
        </select>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as StaffRole | "")}
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700
                     hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          {Object.values(StaffRole).map((r) => (
            <option key={r} value={r}>{STAFF_ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
          No tasks match the current filters.
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            // Track per-card pending state so only the updating card shows spinner
            const isThisUpdating =
              isPending &&
              pendingVars?.taskId    === task.id &&
              pendingVars?.patientId === patientId;

            return (
              <TaskCard
                key={task.id}
                task={task}
                isUpdating={isThisUpdating}
                onStatusChange={(taskId, status) =>
                  updateStatus({ taskId, patientId, status })
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
