import type { PersistedRegistrationDraft } from '../types/registration';

const STORAGE_KEY = 'registration-form:draft:v1';

export function loadRegistrationDraft(): PersistedRegistrationDraft | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PersistedRegistrationDraft;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveRegistrationDraft(draft: PersistedRegistrationDraft) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearRegistrationDraft() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
