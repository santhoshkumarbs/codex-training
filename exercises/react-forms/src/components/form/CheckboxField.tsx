import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: ReactNode;
  error?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField(
    { label, description, error, id, className, ...props },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="space-y-2">
        <label
          className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-3xl border px-4 py-4 transition ${
            error
              ? 'border-rose-300 bg-rose-50/80'
              : 'border-slate-200 bg-white/95 hover:border-amber-300'
          } ${className ?? ''}`}
          htmlFor={inputId}
        >
          <input
            aria-describedby={describedBy}
            aria-invalid={error ? 'true' : 'false'}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            id={inputId}
            ref={ref}
            type="checkbox"
            {...props}
          />
          <span className="space-y-1">
            <span className="block text-sm font-semibold text-slate-900">
              {label}
            </span>
            {description ? (
              <span className="block text-sm text-slate-600" id={descriptionId}>
                {description}
              </span>
            ) : null}
          </span>
        </label>
        {error ? (
          <p className="text-sm font-medium text-rose-700" id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
