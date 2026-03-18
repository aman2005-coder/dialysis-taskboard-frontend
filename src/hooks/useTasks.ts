import { useQuery } from "@tanstack/react-query";
import { fetchTasksByPatient } from "../api/tasks.api";
import { parseTasks } from "../api/parsers/task.parser";
import { Task } from "../types/task";
import { TaskStatus, StaffRole } from "../types/enums";
import { QUERY_KEYS } from "../lib/constants";

interface UseTasksOptions {
  patientId:    string;
  filterStatus?: TaskStatus;
  filterRole?:   StaffRole;
}

export function useTasks({ patientId, filterStatus, filterRole }: UseTasksOptions) {
  const query = useQuery({
    queryKey: QUERY_KEYS.tasks(patientId),
    queryFn:  async () => {
      const dtos = await fetchTasksByPatient(patientId);
      // Parse at the boundary — UI receives only clean Task[]
      return parseTasks(dtos);
    },
    enabled: Boolean(patientId),
  });

  // Derived filtered list — keep filtering out of components
  const tasks: Task[] = (query.data ?? []).filter((t) => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterRole   && t.assignedRole !== filterRole) return false;
    return true;
  });

  const counts = {
    overdue:    (query.data ?? []).filter(t => t.status === TaskStatus.Overdue).length,
    inProgress: (query.data ?? []).filter(t => t.status === TaskStatus.InProgress).length,
    completed:  (query.data ?? []).filter(t => t.status === TaskStatus.Completed).length,
    total:      (query.data ?? []).length,
  };

  return {
    tasks,
    counts,
    isLoading: query.isLoading,
    isError:   query.isError,
    error:     query.error,
    refetch:   query.refetch,
  };
}
