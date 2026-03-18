/**
 * Mock API responses for local development / Storybook.
 * Intentionally includes messy data (nulls, bad dates, unknown statuses)
 * to test our parsers against real-world backend noise.
 */

export const MOCK_PATIENT = {
  id:             "patient-001",
  firstName:      "Anitha",
  lastName:       "Krishnan",
  dateOfBirth:    "1962-04-15",
  mrn:            "DLY-20045",
  dialysisCenter: "Calicut Nephrology Center",
  startDate:      "2021-08-01",
  primaryNurse:   "Renu Thomas",
  phone:          "+91 98765 43210",
  emergencyContact: {
    name:  "Suresh Krishnan",
    phone: "+91 94432 11223",
  },
};

export const MOCK_TASKS = [
  {
    id:           "task-001",
    patientId:    "patient-001",
    title:        "Draw labs — creatinine, BUN, phosphorus",
    status:       "OVERDUE",
    assignedRole: "NURSE",
    dueDate:      "2024-11-01T08:00:00Z",
    notes:        "Patient reported fatigue. Expedite if possible.",
    createdAt:    "2024-10-25T09:00:00Z",
  },
  {
    id:           "task-002",
    patientId:    "patient-001",
    title:        "Review low-potassium meal plan",
    status:       "IN_PROGRESS",
    assignedRole: "DIETICIAN",
    dueDate:      "2024-11-15T00:00:00Z",
    notes:        "",
    createdAt:    "2024-11-01T10:00:00Z",
  },
  {
    id:           "task-003",
    patientId:    "patient-001",
    title:        "Insurance pre-authorisation follow-up",
    status:       "IN_PROGRESS",
    assignedRole: "SOCIAL_WORKER",
    dueDate:      null,           // intentionally missing
    notes:        "Awaiting callback from insurer.",
    createdAt:    "2024-11-02T11:00:00Z",
  },
  {
    id:           "task-004",
    patientId:    "patient-001",
    title:        "Vascular access inspection",
    status:       "COMPLETED",
    assignedRole: "NURSE",
    dueDate:      "2024-10-30T08:00:00Z",
    notes:        "AV fistula in good condition.",
    createdAt:    "2024-10-20T09:00:00Z",
  },
  // ---- Deliberately messy records to stress-test parsers ----
  {
    // Missing id — parser should generate one
    patientId:    "patient-001",
    title:        "Psychosocial assessment",
    status:       "in_progress",  // wrong casing — should default to IN_PROGRESS
    assignedRole: "SOCIAL_WORKER",
    dueDate:      "not-a-date",   // invalid date — should become null
    createdAt:    undefined,
  },
  {
    id:           "task-006",
    // Missing patientId
    title:        null,           // null title — should become "Untitled Task"
    status:       "UNKNOWN_STATUS", // unknown — should default to IN_PROGRESS
    assignedRole: "UNKNOWN_ROLE",   // unknown — should default to NURSE
    dueDate:      "2024-12-01T00:00:00Z",
  },
];
