import { PatientDTO, Patient, createDefaultPatient } from "../../types/patient";

function parseSafeDate(raw?: string): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

export function parsePatient(dto: PatientDTO): Patient {
  if (!dto || typeof dto !== "object") {
    console.warn("[parsePatient] Received non-object DTO, returning default patient.");
    return createDefaultPatient();
  }

  const firstName = typeof dto.firstName === "string" && dto.firstName.trim()
    ? dto.firstName.trim()
    : "Unknown";
  const lastName = typeof dto.lastName === "string" && dto.lastName.trim()
    ? dto.lastName.trim()
    : "Patient";

  return createDefaultPatient({
    id:             typeof dto.id === "string" && dto.id ? dto.id : crypto.randomUUID(),
    firstName,
    lastName,
    fullName:       `${firstName} ${lastName}`,
    dateOfBirth:    parseSafeDate(dto.dateOfBirth),
    mrn:            typeof dto.mrn === "string" && dto.mrn ? dto.mrn : "N/A",
    dialysisCenter: typeof dto.dialysisCenter === "string" && dto.dialysisCenter
                      ? dto.dialysisCenter
                      : "Unknown Center",
    startDate:      parseSafeDate(dto.startDate),
    primaryNurse:   typeof dto.primaryNurse === "string" && dto.primaryNurse
                      ? dto.primaryNurse
                      : "Unassigned",
    phone:          typeof dto.phone === "string" && dto.phone ? dto.phone : "N/A",
    emergencyContact: {
      name:  dto.emergencyContact?.name  ?? "N/A",
      phone: dto.emergencyContact?.phone ?? "N/A",
    },
  });
}

export function parsePatients(dtos: unknown[]): Patient[] {
  if (!Array.isArray(dtos)) return [];
  return dtos.reduce<Patient[]>((acc, dto) => {
    try {
      acc.push(parsePatient(dto as PatientDTO));
    } catch (err) {
      console.error("[parsePatients] Skipping malformed patient record:", dto, err);
    }
    return acc;
  }, []);
}
