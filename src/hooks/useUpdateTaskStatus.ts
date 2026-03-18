import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task } from "../types/task";
import { TaskStatus } from "../types/enums";
import { updateTaskStatusApi } from "../api/tasks.api";
import { parseTask } from "../api/parsers/task.parser";
import { QUERY_KEYS } from "../lib/constants";

interface Variables {
  taskId:    string;
  patientId: string;
  status:    TaskStatus;
}

// Context is passed from onMutate → onError so we can roll back
interface MutationContext {
  previousTasks: Task[] | undefined;
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, Variables, MutationContext>({
    mutationFn: async ({ taskId, status }) => {
      const dto = await updateTaskStatusApi(taskId, status);
      return parseTask(dto); // parse the response too
    },

    /** Step 1 — snapshot current cache, apply optimistic update */
    onMutate: async ({ taskId, patientId, status }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks(patientId) });

      // Snapshot the previous value for potential rollback
      const previousTasks = queryClient.getQueryData<Task[]>(
        QUERY_KEYS.tasks(patientId)
      );

      // Apply the optimistic update immediately
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks(patientId), (old = []) =>
        old.map((t) => (t.id === taskId ? { ...t, status } : t))
      );

      return { previousTasks };
    },

    /** Step 2 — rollback if the API call fails */
    onError: (err, { patientId }, context) => {
      if (context?.previousTasks !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.tasks(patientId),
          context.previousTasks
        );
      }

      toast.error("Failed to update task status", {
        description: `${err.message}. The previous status has been restored.`,
        duration:    5000,
      });
    },

    /** Step 3 — always re-sync with the server after settle (success OR error) */
    onSettled: (_, __, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks(patientId) });
    },

    onSuccess: () => {
      toast.success("Task status updated");
    },
  });
}
