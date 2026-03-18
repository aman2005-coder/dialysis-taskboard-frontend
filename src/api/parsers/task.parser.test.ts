import { describe, it, expect } from "vitest";
import { parseTask, parseTasks } from "./task.parser";
import { TaskStatus, StaffRole } from "../../types/enums";

describe("parseTask", () => {
  it("parses a fully valid DTO correctly", () => {
    const task = parseTask({
      id:           "t1",
      patientId:    "p1",
      title:        "Draw labs",
      status:       "OVERDUE",
      assignedRole: "NURSE",
      dueDate:      "2024-11-01T08:00:00Z",
      notes:        "Urgent",
      createdAt:    "2024-10-25T09:00:00Z",
    });

    expect(task.id).toBe("t1");
    expect(task.title).toBe("Draw labs");
    expect(task.status).toBe(TaskStatus.Overdue);
    expect(task.assignedRole).toBe(StaffRole.Nurse);
    expect(task.dueDate).toBeInstanceOf(Date);
    expect(task.notes).toBe("Urgent");
  });

  it("falls back to defaults for a completely empty DTO", () => {
    const task = parseTask({});

    expect(task.title).toBe("Untitled Task");
    expect(task.status).toBe(TaskStatus.InProgress);
    expect(task.assignedRole).toBe(StaffRole.Nurse);
    expect(task.dueDate).toBeNull();
    expect(task.notes).toBe("");
    // id should be a valid UUID
    expect(task.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  it("treats an invalid status string as InProgress", () => {
    const task = parseTask({ status: "in_progress_typo" });
    expect(task.status).toBe(TaskStatus.InProgress);
  });

  it("treats an invalid role string as Nurse", () => {
    const task = parseTask({ assignedRole: "JANITOR" });
    expect(task.assignedRole).toBe(StaffRole.Nurse);
  });

  it("treats an invalid date string as null", () => {
    const task = parseTask({ dueDate: "not-a-date" });
    expect(task.dueDate).toBeNull();
  });

  it("trims whitespace-only titles to the default", () => {
    const task = parseTask({ title: "   " });
    expect(task.title).toBe("Untitled Task");
  });

  it("returns a default task for non-object input", () => {
    // @ts-expect-error — deliberately passing bad input
    const task = parseTask(null);
    expect(task.title).toBe("Untitled Task");
  });
});

describe("parseTasks", () => {
  it("returns an empty array for non-array input", () => {
    // @ts-expect-error — deliberately passing bad input
    expect(parseTasks(null)).toEqual([]);
    // @ts-expect-error - intentionally passing a non-array input
    expect(parseTasks("string")).toEqual([]);
  });

  it("returns a default task for malformed records instead of dropping them", () => {
    const dtos = [
      { id: "t1", title: "Good task", status: "COMPLETED", assignedRole: "NURSE" },
      null,
      { id: "t2", title: "Another good task", status: "IN_PROGRESS", assignedRole: "DIETICIAN" },
    ];
    const tasks = parseTasks(dtos);
    expect(tasks.length).toBe(3);
    expect(tasks[0]?.id).toBe("t1");
    expect(tasks[1]?.title).toBe("Untitled Task");
    expect(tasks[2]?.id).toBe("t2");
  });

  it("batch-parses a valid array", () => {
    const tasks = parseTasks([
      { id: "t1", title: "Task A", status: "OVERDUE",     assignedRole: "NURSE" },
      { id: "t2", title: "Task B", status: "IN_PROGRESS", assignedRole: "DIETICIAN" },
    ]);
    expect(tasks).toHaveLength(2);
  });
});
