import { usePatient } from "../../hooks/usePatient";

interface Props {
  patientId: string;
}

function formatDate(date: Date | null): string {
  if (!date) return "N/A";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function calcAge(dob: Date | null): string {
  if (!dob) return "N/A";
  const diff = Date.now() - dob.getTime();
  return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))} yrs`;
}

export function PatientHeader({ patientId }: Props) {
  const { data: patient, isLoading, isError } = usePatient(patientId);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gray-200" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-48 rounded bg-gray-200" />
            <div className="h-3 w-32 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">Patient information unavailable.</p>
      </div>
    );
  }

  const initials = `${patient.firstName[0] ?? "?"}${patient.lastName[0] ?? "?"}`.toUpperCase();

  const details = [
    { label: "MRN",           value: patient.mrn },
    { label: "DOB",           value: `${formatDate(patient.dateOfBirth)} (${calcAge(patient.dateOfBirth)})` },
    { label: "Center",        value: patient.dialysisCenter },
    { label: "Treatment since", value: formatDate(patient.startDate) },
    { label: "Primary nurse", value: patient.primaryNurse },
    { label: "Phone",         value: patient.phone },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
          {initials}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{patient.fullName}</h2>
          <p className="text-sm text-gray-500">MRN: {patient.mrn}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-gray-100 pt-4 sm:grid-cols-3">
        {details.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {patient.emergencyContact.name !== "N/A" && (
        <div className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
          Emergency contact: <span className="font-medium text-gray-700">{patient.emergencyContact.name}</span>
          {" · "}{patient.emergencyContact.phone}
        </div>
      )}
    </div>
  );
}
