import { AuditFormData } from "@/types/audit";

const FORM_KEY = "auditai-form";

export function saveFormData(data: AuditFormData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FORM_KEY, JSON.stringify(data));
}

export function loadFormData(): AuditFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FORM_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveToLocalStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage(key: string): unknown {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
