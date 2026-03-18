import { useQuery } from "@tanstack/react-query";
import { fetchPatientById } from "../api/patients.api";
import { parsePatient } from "../api/parsers/patient.parser";
import { QUERY_KEYS } from "../lib/constants";

export function usePatient(patientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.patient(patientId),
    queryFn:  async () => {
      const dto = await fetchPatientById(patientId);
      return parsePatient(dto);
    },
    enabled: Boolean(patientId),
  });
}
