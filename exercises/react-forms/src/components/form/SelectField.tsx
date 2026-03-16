import {
  forwardRef,
  useId,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';

import { fieldClassName } from './TextField';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  status?: ReactNode;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    { children, label, hint, error, id, status, className, ...props },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;
    const statusId = status ? `${selectId}-status` : undefined;
    const describedBy = [hintId, errorId, statusId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="space-y-2">
        <label
          className="flex items-center gap-2 text-sm font-semibold text-slate-900"
          htmlFor={selectId}
        >
          {label}
        </label>
        <select
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : 'false'}
          className={`${fieldClassName} ${
            error
              ? 'border-rose-400 bg-rose-50/80 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-200 bg-white/95 focus:border-amber-500 focus:ring-amber-100'
          } ${className ?? ''}`}
          id={selectId}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {hint ? (
          <p className="text-sm text-slate-500" id={hintId}>
            {hint}
          </p>
        ) : null}
        {status ? (
          <div className="text-sm text-slate-600" id={statusId}>
            {status}
          </div>
        ) : null}
        {error ? (
          <p className="text-sm font-medium text-rose-700" id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
