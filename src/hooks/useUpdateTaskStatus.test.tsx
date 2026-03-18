import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { useUpdateTaskStatus } from "./useUpdateTaskStatus";
import { TaskStatus, StaffRole } from "../types/enums";
import { QUERY_KEYS } from "../lib/constants";

const updateTaskStatusApi = vi.fn();
const toastError = vi.fn();
const toastSuccess = vi.fn();

vi.mock("../api/tasks.api", () => ({
  updateTaskStatusApi: (...args: unknown[]) => updateTaskStatusApi(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
    success: (...args: unknown[]) => toastSuccess(...args),
  },
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe("useUpdateTaskStatus", () => {
  beforeEach(() => {
    updateTaskStatusApi.mockReset();
    toastError.mockReset();
    toastSuccess.mockReset();
  });

  it("optimistically updates the cache and rolls back on server error", async () => {
    const patientId = "patient-001";
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const initialTasks = [
      {
        id: "task-001",
        patientId,
        title: "Draw labs",
        status: TaskStatus.InProgress,
        assignedRole: StaffRole.Nurse,
        dueDate: null,
        notes: "",
        createdAt: new Date("2024-01-01T00:00:00Z"),
      },
    ];

    queryClient.setQueryData(QUERY_KEYS.tasks(patientId), initialTasks);

    let rejectRequest!: (reason?: unknown) => void;
    updateTaskStatusApi.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectRequest = reject;
        })
    );

    const { result } = renderHook(() => useUpdateTaskStatus(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        taskId: "task-001",
        patientId,
        status: TaskStatus.Completed,
      });
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<typeof initialTasks>(QUERY_KEYS.tasks(patientId))?.[0]?.status
      ).toBe(TaskStatus.Completed);
    });

    rejectRequest(new Error("Server unavailable"));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledTimes(1);
    });

    expect(queryClient.getQueryData<typeof initialTasks>(QUERY_KEYS.tasks(patientId))?.[0]?.status)
      .toBe(TaskStatus.InProgress);
    expect(toastSuccess).not.toHaveBeenCalled();
  });
});
