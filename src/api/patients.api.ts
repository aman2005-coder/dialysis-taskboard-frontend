import { PatientDTO } from "../types/patient";
import { MOCK_PATIENT } from "../lib/mockData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const USE_MOCK_API = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== "false";

let mockPatientStore: PatientDTO = structuredClone(MOCK_PATIENT);

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "No response body");
    throw new Error(`[API ${res.status}] ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

function shouldUseMockFallback(error: unknown): boolean {
  return USE_MOCK_API && error instanceof TypeError;
}

export async function fetchAllPatients(): Promise<PatientDTO[]> {
  try {
    const res = await fetch(`${BASE_URL}/patients`, {
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse<PatientDTO[]>(res);
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      console.warn("[patients.api] Falling back to mock patient data.");
      return [mockPatientStore];
    }
    throw error;
  }
}

export async function fetchPatientById(patientId: string): Promise<PatientDTO> {
  try {
    const res = await fetch(`${BASE_URL}/patients/${patientId}`, {
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse<PatientDTO>(res);
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      console.warn(`[patients.api] Falling back to mock patient for ${patientId}.`);
      mockPatientStore = { ...mockPatientStore, id: patientId };
      return mockPatientStore;
    }
    throw error;
  }
}
