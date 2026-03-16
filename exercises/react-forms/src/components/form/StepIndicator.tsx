import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { FORM_STEPS } from '../../types/registration';

const icons = [ShieldCheckIcon, UserCircleIcon, CheckBadgeIcon];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          aria-hidden="true"
          className="h-2 overflow-hidden rounded-full bg-slate-200"
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#ca8a04,#f97316,#0f766e)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ol
        aria-label="Registration steps"
        className="grid gap-3 sm:grid-cols-3"
      >
        {FORM_STEPS.map((step, index) => {
          const Icon = icons[index];
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <li
              className={`rounded-3xl border px-4 py-4 transition ${
                isActive
                  ? 'border-amber-400 bg-amber-50/90 shadow-sm'
                  : isComplete
                    ? 'border-emerald-300 bg-emerald-50/80'
                    : 'border-slate-200 bg-white/75'
              }`}
              key={step.id}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    isActive
                      ? 'bg-amber-200 text-amber-900'
                      : isComplete
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p
                    className="text-sm font-semibold text-slate-900"
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-600">{step.description}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
