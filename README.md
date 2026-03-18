# Dialysis Care Plan Taskboard

A React/TypeScript taskboard for managing dialysis patient care plan tasks across three staff roles: Nurse, Dietician, and Social Worker.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # type-check only (no emit)
npm run lint
npm test           # vitest
```

Set your backend URL in a `.env` file:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Architecture

```
src/
├── api/                   # Pure fetch functions + DTO parsers
│   ├── parsers/
│   │   ├── task.parser.ts         # TaskDTO → Task (trust boundary)
│   │   └── patient.parser.ts
│   ├── tasks.api.ts
│   └── patients.api.ts
│
├── types/                 # No logic — only types & enums
│   ├── enums.ts           # TaskStatus, StaffRole
│   ├── task.ts            # TaskDTO, Task, createDefaultTask
│   └── patient.ts
│
├── hooks/                 # All TanStack Query logic
│   ├── useTasks.ts
│   ├── useUpdateTaskStatus.ts   # Optimistic mutation + rollback
│   └── usePatient.ts
│
├── components/
│   ├── ui/                # Presentational only — zero data logic
│   │   ├── TaskCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── RoleBadge.tsx
│   │   ├── StatsBar.tsx
│   │   └── TaskListSkeleton.tsx
│   ├── features/          # Smart, query-connected components
│   │   ├── TaskList.tsx
│   │   └── PatientHeader.tsx
│   └── TaskErrorBoundary.tsx
│
├── pages/
│   └── CareBoard.tsx      # Composes features, handles layout
│
└── lib/
    ├── queryClient.ts     # Singleton QueryClient config
    ├── constants.ts       # Query keys, label maps
    └── mockData.ts        # Messy mock data for dev/testing
```

---

## Key design decisions

### Two-type pattern (DTO + Domain)
`TaskDTO` mirrors the raw API (every field optional `string | undefined`). `Task` is the domain model (every field required, typed). The `parseTask` function is the **only** place that handles bad data — everything downstream is guaranteed clean.

### Optimistic UI mutation
`useUpdateTaskStatus` follows three phases:
1. `onMutate` — cancel in-flight queries, snapshot cache, apply update immediately
2. `onError` — restore snapshot verbatim, fire error toast
3. `onSettled` — always invalidate (runs on both success and error)

### Null-Object / default factory
`createDefaultTask()` is the single source of fallback values. The UI never needs `task?.title ?? "Unknown"` — it's handled once at the parser boundary.

### Error Boundary
`TaskErrorBoundary` wraps the task list in `CareBoard.tsx`. A render crash in the task list shows a recovery UI without taking down the patient header or the rest of the page. Wire `onError` prop to Sentry/DataDog in production.

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `@tanstack/react-query` | Server state, caching, optimistic updates |
| `sonner` | Toast notifications |
| `tailwindcss` | Utility-first styling |
| `vitest` | Unit tests for parsers |
