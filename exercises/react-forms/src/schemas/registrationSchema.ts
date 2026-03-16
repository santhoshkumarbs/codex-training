import { z } from 'zod';

import { COUNTRY_OPTIONS } from '../constants/countries';

const disposableDomains = new Set([
  'mailinator.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
]);

const usernamePattern = /^[A-Za-z0-9_]{3,20}$/;
const phonePattern = /^\+?[1-9]\d{7,14}$/;

function isAdult(dateOfBirth: string) {
  const parsed = new Date(dateOfBirth);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > parsed.getMonth() ||
    (today.getMonth() === parsed.getMonth() &&
      today.getDate() >= parsed.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age >= 18;
}

const optionalProfileField = z
  .string()
  .trim()
  .max(40, 'Keep this answer under 40 characters.')
  .refine(
    (value) => value.length === 0 || value.length >= 2,
    'Use at least 2 characters.',
  );

export const registrationSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Email is required.')
      .email('Enter a valid email address.')
      .refine((value) => {
        const domain = value.split('@')[1]?.toLowerCase() ?? '';
        return !disposableDomains.has(domain);
      }, 'Use a permanent email address.'),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters.')
      .max(20, 'Username must stay under 20 characters.')
      .regex(
        usernamePattern,
        'Use letters, numbers, and underscores only.',
      ),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters.')
      .regex(/[a-z]/, 'Include at least one lowercase letter.')
      .regex(/[A-Z]/, 'Include at least one uppercase letter.')
      .regex(/\d/, 'Include at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Include at least one special character.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
    firstName: optionalProfileField,
    lastName: optionalProfileField,
    phoneNumber: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || phonePattern.test(value),
        'Use an international format like +14155550123.',
      ),
    dateOfBirth: z
      .string()
      .refine((value) => value.length === 0 || isAdult(value), 'You must be at least 18 years old.'),
    country: z
      .string()
      .trim()
      .refine(
        (value) =>
          value.length === 0 ||
          COUNTRY_OPTIONS.some((country) => country.code === value),
        'Select a valid country.',
      ),
    newsletter: z.boolean(),
    terms: z.boolean().refine(Boolean, 'You must accept the terms to continue.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

export type RegistrationValues = z.infer<typeof registrationSchema>;
