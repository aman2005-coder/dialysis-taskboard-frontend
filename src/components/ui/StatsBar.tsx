interface Counts {
  overdue:    number;
  inProgress: number;
  completed:  number;
  total:      number;
}

export function StatsBar({ counts }: { counts: Counts }) {
  const stats = [
    { label: "Total",       value: counts.total,      className: "text-gray-900" },
    { label: "Overdue",     value: counts.overdue,    className: "text-red-600"  },
    { label: "In Progress", value: counts.inProgress, className: "text-amber-600" },
    { label: "Completed",   value: counts.completed,  className: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map(({ label, value, className }) => (
        <div key={label} className="rounded-lg border border-gray-200 bg-white p-3 text-center">
          <p className={`text-2xl font-bold ${className}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
