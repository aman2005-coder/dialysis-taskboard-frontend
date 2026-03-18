import { TaskStatus, StaffRole } from "../types/enums";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.Overdue]:    "Overdue",
  [TaskStatus.InProgress]: "In Progress",
  [TaskStatus.Completed]:  "Completed",
};

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  [StaffRole.Nurse]:        "Nurse",
  [StaffRole.Dietician]:    "Dietician",
  [StaffRole.SocialWorker]: "Social Worker",
};

export const QUERY_KEYS = {
  tasks:   (patientId: string) => ["tasks", patientId] as const,
  patient: (patientId: string) => ["patient", patientId] as const,
  patients: ["patients"] as const,
} as const;
