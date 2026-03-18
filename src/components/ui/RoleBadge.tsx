import { StaffRole } from "../../types/enums";
import { STAFF_ROLE_LABELS } from "../../lib/constants";

interface Props {
  role: StaffRole;
}

const ROLE_STYLES: Record<StaffRole, string> = {
  [StaffRole.Nurse]:        "bg-blue-100 text-blue-800",
  [StaffRole.Dietician]:    "bg-purple-100 text-purple-800",
  [StaffRole.SocialWorker]: "bg-teal-100 text-teal-800",
};

export function RoleBadge({ role }: Props) {
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${ROLE_STYLES[role]}`}
    >
      {STAFF_ROLE_LABELS[role]}
    </span>
  );
}
