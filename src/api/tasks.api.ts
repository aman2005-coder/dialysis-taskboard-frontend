import { TaskDTO } from "../types/task";
import { TaskStatus } from "../types/enums";
import { MOCK_TASKS } from "../lib/mockData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const USE_MOCK_API = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== "false";

function normalizeMockTask(task: (typeof MOCK_TASKS)[number]): TaskDTO {
  return {
    ...(typeof task.id === "string" ? { id: task.id } : {}),
    ...(typeof task.patientId === "string" ? { patientId: task.patientId } : {}),
    ...(typeof task.title === "string" ? { title: task.title } : {}),
    ...(typeof task.status === "string" ? { status: task.status } : {}),
    ...(typeof task.assignedRole === "string" ? { assignedRole: task.assignedRole } : {}),
    ...(typeof task.dueDate === "string" ? { dueDate: task.dueDate } : {}),
    ...(typeof task.notes === "string" ? { notes: task.notes } : {}),
    ...(typeof task.createdAt === "string" ? { createdAt: task.createdAt } : {}),
  };
}

let mockTaskStore: TaskDTO[] = MOCK_TASKS.map(normalizeMockTask);

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "No response body");
    throw new Error(`[API ${res.status}] ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

function shouldUseMockFallback(error: unknown): boolean {
  return USE_MOCK_API && error instanceof TypeError;
}

/** Fetch all tasks for a given patient */
export async function fetchTasksByPatient(patientId: string): Promise<TaskDTO[]> {
  try {
    const res = await fetch(`${BASE_URL}/patients/${patientId}/tasks`, {
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse<TaskDTO[]>(res);
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      console.warn(`[tasks.api] Falling back to mock tasks for ${patientId}.`);
      return mockTaskStore
        .filter((task) => task.patientId === patientId || !task.patientId)
        .map((task) => ({ ...task, patientId: task.patientId ?? patientId }));
    }
    throw error;
  }
}

/** Update the status of a single task */
export async function updateTaskStatusApi(
  taskId: string,
  status: TaskStatus
): Promise<TaskDTO> {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}/status`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
    return handleResponse<TaskDTO>(res);
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      const existingTask = mockTaskStore.find((task) => task.id === taskId);
      if (!existingTask) {
        throw new Error(`Mock task ${taskId} not found.`);
      }

      const updatedTask = { ...existingTask, status };
      mockTaskStore = mockTaskStore.map((task) => (task.id === taskId ? updatedTask : task));
      return updatedTask;
    }
    throw error;
  }
}

/** Create a new task */
export async function createTaskApi(
  patientId: string,
  payload: Partial<TaskDTO>
): Promise<TaskDTO> {
  try {
    const res = await fetch(`${BASE_URL}/patients/${patientId}/tasks`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    return handleResponse<TaskDTO>(res);
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      const createdTask: TaskDTO = {
        id: crypto.randomUUID(),
        patientId,
        title: payload.title ?? "Untitled Task",
        status: payload.status ?? TaskStatus.InProgress,
        assignedRole: payload.assignedRole ?? "NURSE",
        notes: payload.notes ?? "",
        createdAt: new Date().toISOString(),
        ...(payload.dueDate ? { dueDate: payload.dueDate } : {}),
      };
      mockTaskStore = [...mockTaskStore, createdTask];
      return createdTask;
    }
    throw error;
  }
}

/** Delete a task */
export async function deleteTaskApi(taskId: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`[API ${res.status}] Delete failed: ${body}`);
    }
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      mockTaskStore = mockTaskStore.filter((task) => task.id !== taskId);
      return;
    }
    throw error;
  }
}
