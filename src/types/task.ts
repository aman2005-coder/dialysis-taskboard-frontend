import { TaskStatus, StaffRole } from "./enums";

/** Raw shape from the API — every field is potentially absent */
export interface TaskDTO {
  id?:           string;
  patientId?:    string;
  title?:        string;
  status?:       string;
  assignedRole?: string;
  dueDate?:      string;
  notes?:        string;
  createdAt?:    string;
}

/** Domain model — safe, typed, no undefined surprises downstream */
export interface Task {
  id:           string;
  patientId:    string;
  title:        string;
  status:       TaskStatus;
  assignedRole: StaffRole;
  dueDate:      Date | null; // null = not scheduled, never undefined
  notes:        string;
  createdAt:    Date;
}

/** Null-Object factory — single source of all default values */
export const createDefaultTask = (overrides: Partial<Task> = {}): Task => ({
  id:           "unknown",
  patientId:    "unknown",
  title:        "Untitled Task",
  status:       TaskStatus.InProgress,
  assignedRole: StaffRole.Nurse,
  dueDate:      null,
  notes:        "",
  createdAt:    new Date(),
  ...overrides,
});
