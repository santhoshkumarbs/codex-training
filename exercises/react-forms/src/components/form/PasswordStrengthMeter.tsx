import {
  CheckCircleIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/solid';

import { getPasswordStrength } from '../../utils/passwordStrength';

interface PasswordStrengthMeterProps {
  password: string;
}

const strengthClasses = [
  'bg-slate-200',
  'bg-rose-400',
  'bg-orange-400',
  'bg-amber-400',
  'bg-lime-500',
  'bg-emerald-500',
];

export function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const result = getPasswordStrength(password);

  return (
    <section
      aria-live="polite"
      className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Password strength
          </p>
          <p className="text-sm text-slate-600">
            {password ? result.label : 'Start typing to evaluate strength.'}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          {password ? `${result.score}/5` : 'Ready'}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            aria-hidden="true"
            className={`h-2 rounded-full ${
              index < result.score
                ? strengthClasses[result.score]
                : 'bg-slate-200'
            }`}
            key={index}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {result.requirements.map((requirement) => (
          <li
            className="flex items-center gap-2 text-sm text-slate-600"
            key={requirement.id}
          >
            {requirement.met ? (
              <CheckCircleIcon
                aria-hidden="true"
                className="h-5 w-5 text-emerald-500"
              />
            ) : (
              <MinusCircleIcon
                aria-hidden="true"
                className="h-5 w-5 text-slate-300"
              />
            )}
            <span>{requirement.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
