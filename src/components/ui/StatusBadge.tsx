import { TaskStatus } from "../../types/enums";
import { TASK_STATUS_LABELS } from "../../lib/constants";

interface Props {
  status: TaskStatus;
  size?:  "sm" | "md";
}

const STATUS_STYLES: Record<TaskStatus, string> = {
  [TaskStatus.Overdue]:    "bg-red-100 text-red-800 border-red-200",
  [TaskStatus.InProgress]: "bg-amber-100 text-amber-800 border-amber-200",
  [TaskStatus.Completed]:  "bg-green-100 text-green-800 border-green-200",
};

const STATUS_DOT: Record<TaskStatus, string> = {
  [TaskStatus.Overdue]:    "bg-red-500",
  [TaskStatus.InProgress]: "bg-amber-500",
  [TaskStatus.Completed]:  "bg-green-500",
};

export function StatusBadge({ status, size = "md" }: Props) {
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClass} ${STATUS_STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {TASK_STATUS_LABELS[status]}
    </span>
  );
}
