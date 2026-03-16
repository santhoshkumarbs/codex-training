interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  disablePrimary?: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function FormNavigation({
  currentStep,
  totalSteps,
  isSubmitting,
  disablePrimary,
  onBack,
  onNext,
}: FormNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <button
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={currentStep === 0 || isSubmitting}
        onClick={onBack}
        type="button"
      >
        Back
      </button>
      <button
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={disablePrimary || isSubmitting}
        onClick={isLastStep ? undefined : onNext}
        type={isLastStep ? 'submit' : 'button'}
      >
        {isSubmitting
          ? 'Submitting...'
          : isLastStep
            ? 'Create account'
            : 'Continue'}
      </button>
    </div>
  );
}
