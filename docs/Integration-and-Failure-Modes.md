# Integration & Failure Modes

## Module Boundaries

- `src/api`: API client functions plus DTO parsing at the trust boundary.
- `src/hooks`: state management built on TanStack Query, including fetch orchestration and optimistic mutations.
- `src/components`: UI split between `features` for query-connected views and `ui` for presentational building blocks.

This separation keeps backend shape changes isolated to DTO/parser code, while the UI consumes only domain-safe objects.

## Partial Failure Behavior

- Patient header and task list fail independently. A patient fetch failure shows a patient-only error card; a task fetch failure shows a task-only retry surface.
- Task status mutations are optimistic. The UI updates immediately, then rolls back to the cached snapshot if the server rejects the change.
- Queries retry automatically, but mutations do not. This avoids duplicating state-changing requests.
- In local development, API fetches fall back to bundled mock data when the configured backend is unreachable. This keeps the UI usable without hiding true API errors in production.

## Adaptation Strategy

### New roles

- Add the backend enum/string to [`enums.ts`](/Users/amanagrawal/Desktop/webdevpro/Project_fronend/dialysis-taskboard/src/types/enums.ts).
- Add a label entry in [`constants.ts`](/Users/amanagrawal/Desktop/webdevpro/Project_fronend/dialysis-taskboard/src/lib/constants.ts).
- The parser fallback remains safe for unknown values until the new role is fully wired.
- UI filters and badges automatically pick up the new role from the enum/label maps.

### New task categories or fields

- Extend `TaskDTO` and `Task` in [`task.ts`](/Users/amanagrawal/Desktop/webdevpro/Project_fronend/dialysis-taskboard/src/types/task.ts).
- Normalize the new field once in [`task.parser.ts`](/Users/amanagrawal/Desktop/webdevpro/Project_fronend/dialysis-taskboard/src/api/parsers/task.parser.ts).
- Keep rendering logic inside `ui` components so category-specific visuals do not leak into the API layer.
- Add or update query keys only if the new category requires a distinct cache slice.

## Operational Notes

- If a backend introduces partial payload regressions, the parser defaults prevent most UI crashes.
- If optimistic mutations become more complex, move the mutation lifecycle into a dedicated state helper so rollback rules remain testable outside the component tree.
