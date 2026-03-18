export function TaskListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="flex gap-2">
                <div className="h-5 w-20 rounded-full bg-gray-200" />
                <div className="h-5 w-16 rounded bg-gray-200" />
              </div>
              <div className="h-3 w-1/3 rounded bg-gray-100" />
            </div>
            <div className="h-7 w-28 rounded-md bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
