export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordStrengthResult {
  score: number;
  label: 'Very weak' | 'Weak' | 'Fair' | 'Strong' | 'Excellent';
  requirements: PasswordRequirement[];
}

const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'At least 12 characters',
    test: (value: string) => value.length >= 12,
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'number',
    label: 'One number',
    test: (value: string) => /\d/.test(value),
  },
  {
    id: 'symbol',
    label: 'One special character',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

const LABELS: PasswordStrengthResult['label'][] = [
  'Very weak',
  'Weak',
  'Fair',
  'Strong',
  'Excellent',
];

export function getPasswordStrength(value: string): PasswordStrengthResult {
  const requirements = PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    met: rule.test(value),
  }));

  const score = requirements.filter((requirement) => requirement.met).length;

  return {
    score,
    label: LABELS[Math.max(0, score - 1)] ?? 'Very weak',
    requirements,
  };
}
