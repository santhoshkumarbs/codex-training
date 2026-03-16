export interface RegistrationData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
  newsletter: boolean;
  terms: boolean;
}

export type PersistedRegistrationDraft = Omit<
  RegistrationData,
  'password' | 'confirmPassword'
>;

export type RegistrationPayload = Omit<RegistrationData, 'confirmPassword'>;

export interface SubmissionReceipt {
  reference: string;
  createdAt: string;
  email: string;
  username: string;
  displayName: string;
}

export interface CountryOption {
  code: string;
  label: string;
}

export interface UsernameAvailabilityResult {
  available: boolean;
  message: string;
  suggestion?: string;
}

export const FORM_STEPS = [
  {
    id: 'account',
    label: 'Account',
    description: 'Secure credentials and your unique username.',
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'Optional details that personalize the account.',
  },
  {
    id: 'confirm',
    label: 'Confirm',
    description: 'Review your answers and accept the terms.',
  },
] as const;

export const DEFAULT_REGISTRATION_DATA: RegistrationData = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  dateOfBirth: '',
  country: '',
  newsletter: false,
  terms: false,
};

export function toPersistedDraft(
  data: RegistrationData,
): PersistedRegistrationDraft {
  return {
    email: data.email.trim(),
    username: data.username.trim(),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    phoneNumber: data.phoneNumber.trim(),
    dateOfBirth: data.dateOfBirth,
    country: data.country,
    newsletter: data.newsletter,
    terms: data.terms,
  };
}

export function toRegistrationPayload(
  data: RegistrationData,
): RegistrationPayload {
  return {
    email: data.email.trim().toLowerCase(),
    username: data.username.trim(),
    password: data.password,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    phoneNumber: data.phoneNumber.trim(),
    dateOfBirth: data.dateOfBirth,
    country: data.country,
    newsletter: data.newsletter,
    terms: data.terms,
  };
}
