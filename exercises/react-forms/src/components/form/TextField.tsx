import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  status?: ReactNode;
}

export const fieldClassName =
  'w-full rounded-2xl border px-4 py-3.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70';

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, hint, error, id, status, className, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const statusId = status ? `${inputId}-status` : undefined;
    const describedBy = [hintId, errorId, statusId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="space-y-2">
        <label
          className="flex items-center gap-2 text-sm font-semibold text-slate-900"
          htmlFor={inputId}
        >
          {label}
          {props.required ? (
            <span className="text-xs font-medium text-rose-600">
              Required
            </span>
          ) : null}
        </label>
        <input
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : 'false'}
          className={`${fieldClassName} ${
            error
              ? 'border-rose-400 bg-rose-50/80 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-200 bg-white/95 focus:border-amber-500 focus:ring-amber-100'
          } ${className ?? ''}`}
          id={inputId}
          ref={ref}
          {...props}
        />
        {hint ? (
          <p className="text-sm text-slate-500" id={hintId}>
            {hint}
          </p>
        ) : null}
        {status ? (
          <div
            className="text-sm text-slate-600"
            id={statusId}
          >
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
