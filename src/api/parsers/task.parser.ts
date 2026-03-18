import { TaskDTO, Task, createDefaultTask } from "../../types/task";
import { TaskStatus, StaffRole } from "../../types/enums";

const VALID_STATUSES = new Set(Object.values(TaskStatus));
const VALID_ROLES    = new Set(Object.values(StaffRole));

function parseSafeDate(raw?: string): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Converts a raw API TaskDTO into a safe Task domain object.
 * Any missing or invalid field falls back to a sensible default.
 * Throws only if the input is not an object at all.
 */
export function parseTask(dto: TaskDTO): Task {
  if (!dto || typeof dto !== "object") {
    console.warn("[parseTask] Received non-object DTO, returning default task.");
    return createDefaultTask();
  }

  return createDefaultTask({
    id:           typeof dto.id === "string" && dto.id ? dto.id : crypto.randomUUID(),
    patientId:    typeof dto.patientId === "string" && dto.patientId ? dto.patientId : "unknown",
    title:        typeof dto.title === "string" && dto.title.trim() ? dto.title.trim() : "Untitled Task",
    status:       VALID_STATUSES.has(dto.status as TaskStatus)
                    ? (dto.status as TaskStatus)
                    : TaskStatus.InProgress,
    assignedRole: VALID_ROLES.has(dto.assignedRole as StaffRole)
                    ? (dto.assignedRole as StaffRole)
                    : StaffRole.Nurse,
    dueDate:      parseSafeDate(dto.dueDate),
    notes:        typeof dto.notes === "string" ? dto.notes : "",
    createdAt:    parseSafeDate(dto.createdAt) ?? new Date(),
  });
}

/** Batch-parse; silently drops records that throw during parsing */
export function parseTasks(dtos: unknown[]): Task[] {
  if (!Array.isArray(dtos)) return [];

  return dtos.reduce<Task[]>((acc, dto) => {
    try {
      acc.push(parseTask(dto as TaskDTO));
    } catch (err) {
      console.error("[parseTasks] Skipping malformed task record:", dto, err);
    }
    return acc;
  }, []);
}
