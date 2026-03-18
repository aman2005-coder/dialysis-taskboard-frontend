import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TaskList } from "./TaskList";
import { TaskStatus, StaffRole } from "../../types/enums";

const useTasksMock = vi.fn();
const useUpdateTaskStatusMock = vi.fn();
const mutateMock = vi.fn();
const refetchMock = vi.fn();

vi.mock("../../hooks/useTasks", () => ({
  useTasks: (...args: unknown[]) => useTasksMock(...args),
}));

vi.mock("../../hooks/useUpdateTaskStatus", () => ({
  useUpdateTaskStatus: (...args: unknown[]) => useUpdateTaskStatusMock(...args),
}));

describe("TaskList", () => {
  beforeEach(() => {
    mutateMock.mockReset();
    refetchMock.mockReset();
    useTasksMock.mockReset();
    useUpdateTaskStatusMock.mockReset();
  });

  it("surfaces the load failure state and retries on click", () => {
    useTasksMock.mockReturnValue({
      tasks: [],
      counts: { overdue: 0, inProgress: 0, completed: 0, total: 0 },
      isLoading: false,
      isError: true,
      error: new Error("Backend offline"),
      refetch: refetchMock,
    });
    useUpdateTaskStatusMock.mockReturnValue({
      mutate: mutateMock,
      variables: undefined,
      isPending: false,
    });

    render(<TaskList patientId="patient-001" />);

    expect(screen.getByText("Failed to load tasks: Backend offline")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows pending state only for the updating task and forwards status changes", () => {
    useTasksMock.mockReturnValue({
      tasks: [
        {
          id: "task-001",
          patientId: "patient-001",
          title: "Draw labs",
          status: TaskStatus.InProgress,
          assignedRole: StaffRole.Nurse,
          dueDate: null,
          notes: "",
          createdAt: new Date("2024-01-01T00:00:00Z"),
        },
        {
          id: "task-002",
          patientId: "patient-001",
          title: "Meal plan review",
          status: TaskStatus.Overdue,
          assignedRole: StaffRole.Dietician,
          dueDate: null,
          notes: "",
          createdAt: new Date("2024-01-01T00:00:00Z"),
        },
      ],
      counts: { overdue: 1, inProgress: 1, completed: 0, total: 2 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: refetchMock,
    });
    useUpdateTaskStatusMock.mockReturnValue({
      mutate: mutateMock,
      variables: { taskId: "task-001", patientId: "patient-001", status: TaskStatus.Completed },
      isPending: true,
    });

    render(<TaskList patientId="patient-001" />);

    expect(screen.getAllByText("Saving…")).toHaveLength(1);
    expect(screen.getByLabelText("Change status for Draw labs")).toHaveProperty("disabled", true);
    expect(screen.getByLabelText("Change status for Meal plan review")).toHaveProperty("disabled", false);

    fireEvent.change(screen.getByLabelText("Change status for Meal plan review"), {
      target: { value: TaskStatus.Completed },
    });

    expect(mutateMock).toHaveBeenCalledWith({
      taskId: "task-002",
      patientId: "patient-001",
      status: TaskStatus.Completed,
    });
  });
});
