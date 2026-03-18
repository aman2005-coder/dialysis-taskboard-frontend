import { Task } from "../../types/task";
import { TaskStatus } from "../../types/enums";
import { StatusBadge } from "./StatusBadge";
import { RoleBadge } from "./RoleBadge";
import { TASK_STATUS_LABELS } from "../../lib/constants";

interface Props {
  task:            Task;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  isUpdating?:     boolean;
}

function formatDate(date: Date | null): string {
  if (!date) return "No due date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

function isOverdueDate(task: Task): boolean {
  return (
    task.status !== TaskStatus.Completed &&
    task.dueDate !== null &&
    task.dueDate < new Date()
  );
}

export function TaskCard({ task, onStatusChange, isUpdating = false }: Props) {
  const overdue = isOverdueDate(task);

  return (
    <div
      className={`
        rounded-xl border bg-white p-4 shadow-sm transition-all duration-200
        ${isUpdating ? "opacity-50 pointer-events-none" : "hover:shadow-md"}
        ${overdue ? "border-red-200" : "border-gray-200"}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{task.title}</p>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} size="sm" />
            <RoleBadge role={task.assignedRole} />
          </div>

          {task.notes && (
            <p className="mt-2 text-xs text-gray-500 line-clamp-2">{task.notes}</p>
          )}

          <p className={`mt-2 text-xs ${overdue ? "text-red-600 font-medium" : "text-gray-400"}`}>
            {overdue ? "⚠ Overdue · " : "Due: "}
            {formatDate(task.dueDate)}
          </p>
        </div>

        {onStatusChange && (
          <div className="shrink-0">
            <select
              value={task.status}
              disabled={isUpdating}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700
                         hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500
                         disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              aria-label={`Change status for ${task.title}`}
            >
              {Object.values(TaskStatus).map((s) => (
                <option key={s} value={s}>
                  {TASK_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {isUpdating && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          Saving…
        </div>
      )}
    </div>
  );
}
