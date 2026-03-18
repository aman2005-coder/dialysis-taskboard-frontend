/** Raw shape from the API */
export interface PatientDTO {
  id?:             string;
  firstName?:      string;
  lastName?:       string;
  dateOfBirth?:    string;
  mrn?:            string; // Medical Record Number
  dialysisCenter?: string;
  startDate?:      string; // Date dialysis treatment started
  primaryNurse?:   string;
  phone?:          string;
  emergencyContact?: {
    name?:  string;
    phone?: string;
  };
}

/** Domain model */
export interface Patient {
  id:              string;
  firstName:       string;
  lastName:        string;
  fullName:        string; // computed: firstName + lastName
  dateOfBirth:     Date | null;
  mrn:             string;
  dialysisCenter:  string;
  startDate:       Date | null;
  primaryNurse:    string;
  phone:           string;
  emergencyContact: {
    name:  string;
    phone: string;
  };
}

export const createDefaultPatient = (overrides: Partial<Patient> = {}): Patient => ({
  id:             "unknown",
  firstName:      "Unknown",
  lastName:       "Patient",
  fullName:       "Unknown Patient",
  dateOfBirth:    null,
  mrn:            "N/A",
  dialysisCenter: "Unknown Center",
  startDate:      null,
  primaryNurse:   "Unassigned",
  phone:          "N/A",
  emergencyContact: { name: "N/A", phone: "N/A" },
  ...overrides,
});
