import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';
import {
  useForm,
  useWatch,
  type FieldPath,
} from 'react-hook-form';

import { useRegistrationFlow } from '../context/RegistrationFlowContext';
import { registrationSchema, type RegistrationValues } from '../schemas/registrationSchema';
import {
  checkUsernameAvailability,
  fetchCountries,
  submitRegistration,
} from '../services/registrationApi';
import {
  DEFAULT_REGISTRATION_DATA,
  FORM_STEPS,
  toPersistedDraft,
  toRegistrationPayload,
  type CountryOption,
  type SubmissionReceipt,
} from '../types/registration';
import { PasswordStrengthMeter } from './form/PasswordStrengthMeter';
import { SelectField } from './form/SelectField';
import { StepIndicator } from './form/StepIndicator';
import { CheckboxField } from './form/CheckboxField';
import { FormNavigation } from './form/FormNavigation';
import { TextField } from './form/TextField';

const ACCOUNT_FIELDS: FieldPath<RegistrationValues>[] = [
  'email',
  'username',
  'password',
  'confirmPassword',
];

const PROFILE_FIELDS: FieldPath<RegistrationValues>[] = [
  'firstName',
  'lastName',
  'phoneNumber',
  'dateOfBirth',
  'country',
  'newsletter',
];

const CONFIRM_FIELDS: FieldPath<RegistrationValues>[] = ['terms'];

type UsernameStatus =
  | { state: 'idle'; message: string }
  | { state: 'checking'; message: string }
  | { state: 'available'; message: string; suggestion?: string }
  | { state: 'unavailable'; message: string; suggestion?: string }
  | { state: 'error'; message: string };

const emptyUsernameStatus: UsernameStatus = {
  state: 'idle',
  message: 'Usernames are checked in real time after you stop typing.',
};
const usernamePattern = /^[A-Za-z0-9_]{3,20}$/;

function formatDate(value: string) {
  if (!value) {
    return 'Not provided';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(value));
}

function formatOptional(value: string) {
  return value || 'Not provided';
}

function summaryRows(values: RegistrationValues, countries: CountryOption[]) {
  const countryLabel =
    countries.find((country) => country.code === values.country)?.label ??
    'Not provided';

  return [
    { label: 'Email', value: values.email },
    { label: 'Username', value: values.username },
    {
      label: 'Full name',
      value:
        [values.firstName, values.lastName].filter(Boolean).join(' ') ||
        'Not provided',
    },
    { label: 'Phone', value: formatOptional(values.phoneNumber) },
    { label: 'Date of birth', value: formatDate(values.dateOfBirth) },
    { label: 'Country', value: countryLabel },
    {
      label: 'Newsletter',
      value: values.newsletter ? 'Subscribed' : 'Not subscribed',
    },
  ];
}

export default function RegistrationForm() {
  const { state, setStep, mergeDraft, resetFlow } = useRegistrationFlow();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>(emptyUsernameStatus);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SubmissionReceipt | null>(null);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const usernameRequestId = useRef(0);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setError,
    clearErrors,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    defaultValues: {
      ...DEFAULT_REGISTRATION_DATA,
      ...state.draft,
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(registrationSchema),
  });

  const values = useWatch({ control }) as RegistrationValues;
  const deferredUsername = useDeferredValue(values.username);

  const saveDraft = useEffectEvent((draft: RegistrationValues) => {
    mergeDraft(toPersistedDraft(draft));
  });

  const runUsernameCheck = useEffectEvent(
    async (candidate: string, requestId: number) => {
      try {
        const result = await checkUsernameAvailability(candidate);

        if (requestId !== usernameRequestId.current) {
          return;
        }

        if (result.available) {
          clearErrors('username');
          setUsernameStatus({
            state: 'available',
            message: result.message,
            suggestion: result.suggestion,
          });
          return;
        }

        setError('username', {
          type: 'server',
          message: result.message,
        });
        setUsernameStatus({
          state: 'unavailable',
          message: result.message,
          suggestion: result.suggestion,
        });
      } catch {
        if (requestId !== usernameRequestId.current) {
          return;
        }

        setUsernameStatus({
          state: 'error',
          message: 'Unable to validate the username right now.',
        });
      }
    },
  );

  useEffect(() => {
    let isMounted = true;

    fetchCountries()
      .then((response) => {
        if (isMounted) {
          setCountries(response);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCountriesError('Country list is temporarily unavailable.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      saveDraft(values);
    }, 250);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [values]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [state.currentStep]);

  useEffect(() => {
    const trimmed = deferredUsername.trim();

    if (!trimmed || !usernamePattern.test(trimmed)) {
      return;
    }

    const requestId = usernameRequestId.current + 1;
    usernameRequestId.current = requestId;

    const timerId = window.setTimeout(() => {
      setUsernameStatus({
        state: 'checking',
        message: 'Checking username availability…',
      });
      void runUsernameCheck(trimmed, requestId);
    }, 450);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [deferredUsername]);

  const displayedUsernameStatus = !values.username.trim()
    ? emptyUsernameStatus
    : !usernamePattern.test(values.username.trim())
      ? {
          state: 'idle' as const,
          message: 'Use 3 to 20 letters, numbers, or underscores.',
        }
      : usernameStatus;

  const moveToStep = (step: number) => {
    startTransition(() => {
      setStep(step);
    });
  };

  const handleNext = async () => {
    setServerError(null);
    const fields =
      state.currentStep === 0
        ? ACCOUNT_FIELDS
        : state.currentStep === 1
          ? PROFILE_FIELDS
          : CONFIRM_FIELDS;

    const isValid = await trigger(fields, { shouldFocus: true });

    if (!isValid) {
      return;
    }

    if (state.currentStep === 0) {
      if (usernameStatus.state === 'checking') {
        setServerError('Please wait for the username check to finish.');
        return;
      }

      if (usernameStatus.state === 'unavailable') {
        setFocus('username');
        return;
      }
    }

    moveToStep(Math.min(state.currentStep + 1, FORM_STEPS.length - 1));
  };

  const handleBack = () => {
    setServerError(null);
    moveToStep(Math.max(state.currentStep - 1, 0));
  };

  const handleReset = () => {
    setSuccess(null);
    reset(DEFAULT_REGISTRATION_DATA);
    resetFlow();
    setUsernameStatus(emptyUsernameStatus);
  };

  const onSubmit = handleSubmit(async (submittedValues) => {
    setServerError(null);

    if (usernameStatus.state !== 'available') {
      setError('username', {
        type: 'server',
        message: 'Choose an available username before submitting.',
      });
      moveToStep(0);
      setFocus('username');
      return;
    }

    try {
      const receipt = await submitRegistration(
        toRegistrationPayload(submittedValues),
      );
      setSuccess(receipt);
      reset(DEFAULT_REGISTRATION_DATA);
      resetFlow();
      setUsernameStatus(emptyUsernameStatus);
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Something went wrong while creating the account.';

      setServerError(message);

      if (message.toLowerCase().includes('email')) {
        moveToStep(0);
        setFocus('email');
      }
    }
  });

  if (success) {
    return (
      <section className="rounded-[32px] border border-emerald-200 bg-white/95 p-8 shadow-[0_32px_120px_rgba(15,23,42,0.14)]">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircleIcon className="h-8 w-8" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Registration complete
            </p>
            <h2 className="font-[Iowan_Old_Style,Palatino_Linotype,serif] text-3xl font-semibold text-slate-950">
              Welcome aboard, {success.displayName}
            </h2>
          </div>
        </div>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Your secure account is ready. A confirmation email has been queued for{' '}
          <span className="font-semibold text-slate-900">{success.email}</span>.
        </p>
        <dl className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/90 p-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Reference
            </dt>
            <dd className="mt-2 text-sm font-semibold text-slate-900">
              {success.reference}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Username
            </dt>
            <dd className="mt-2 text-sm font-semibold text-slate-900">
              {success.username}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Created
            </dt>
            <dd className="mt-2 text-sm font-semibold text-slate-900">
              {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(success.createdAt))}
            </dd>
          </div>
        </dl>
        <button
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          onClick={handleReset}
          type="button"
        >
          Register another account
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-[32px] border border-white/70 bg-white/92 p-6 shadow-[0_32px_120px_rgba(15,23,42,0.14)] backdrop-blur xl:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">
            Production-ready onboarding
          </p>
          <h2
            className="font-[Iowan_Old_Style,Palatino_Linotype,serif] text-3xl font-semibold text-slate-950"
            ref={headingRef}
            tabIndex={-1}
          >
            Build a trustworthy account in under two minutes.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Sensitive fields never persist to local storage, usernames are checked in
            real time, and every step is validated before you move forward.
          </p>
        </div>
        <span className="hidden rounded-2xl bg-amber-100 p-3 text-amber-700 sm:flex">
          <SparklesIcon className="h-7 w-7" />
        </span>
      </div>

      <div aria-live="polite" className="sr-only">
        Step {state.currentStep + 1} of {FORM_STEPS.length}. {FORM_STEPS[state.currentStep].label}.
      </div>

      <div className="mt-8">
        <StepIndicator currentStep={state.currentStep} />
      </div>

      <form className="mt-8 space-y-8" noValidate onSubmit={onSubmit}>
        {serverError ? (
          <div className="flex items-start gap-3 rounded-3xl border border-rose-200 bg-rose-50/90 px-4 py-4 text-sm text-rose-900">
            <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{serverError}</p>
          </div>
        ) : null}

        {state.currentStep === 0 ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-5">
              <TextField
                autoComplete="email"
                error={errors.email?.message}
                hint="Use a permanent email address so we can verify your account."
                label="Email address"
                placeholder="you@company.com"
                required
                type="email"
                {...register('email')}
              />
              <TextField
                autoCapitalize="none"
                autoComplete="username"
                error={errors.username?.message}
                hint="Three to twenty characters. Letters, numbers, underscores."
                label="Username"
                placeholder="stormrider_01"
                required
                status={
                  <div className="flex items-start gap-2">
                    <InformationCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p
                        className={`font-medium ${
                          displayedUsernameStatus.state === 'available'
                            ? 'text-emerald-700'
                            : displayedUsernameStatus.state === 'unavailable' ||
                                displayedUsernameStatus.state === 'error'
                              ? 'text-rose-700'
                              : 'text-slate-600'
                        }`}
                      >
                        {displayedUsernameStatus.message}
                      </p>
                      {displayedUsernameStatus.state === 'unavailable' &&
                      displayedUsernameStatus.suggestion ? (
                        <p className="mt-1 text-slate-500">
                          Suggested alternative: {displayedUsernameStatus.suggestion}
                        </p>
                      ) : null}
                    </div>
                  </div>
                }
                {...register('username')}
              />
              <TextField
                autoComplete="new-password"
                error={errors.password?.message}
                hint="Use a unique passphrase that you have not used elsewhere."
                label="Password"
                placeholder="Create a strong password"
                required
                type="password"
                {...register('password')}
              />
              <TextField
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                label="Confirm password"
                placeholder="Repeat your password"
                required
                type="password"
                {...register('confirmPassword')}
              />
            </div>
            <div className="space-y-5">
              <PasswordStrengthMeter password={values.password} />
              <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Security notes
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>Password fields are never stored in local storage.</li>
                  <li>Async username checks are debounced to reduce network chatter.</li>
                  <li>Disposable email domains are blocked before submission.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {state.currentStep === 1 ? (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                autoComplete="given-name"
                error={errors.firstName?.message}
                hint="Optional. Helpful for personalization and support."
                label="First name"
                placeholder="Avery"
                {...register('firstName')}
              />
              <TextField
                autoComplete="family-name"
                error={errors.lastName?.message}
                label="Last name"
                placeholder="Parker"
                {...register('lastName')}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                autoComplete="tel"
                error={errors.phoneNumber?.message}
                hint="Optional. Use international format for account recovery."
                label="Phone number"
                placeholder="+14155550123"
                {...register('phoneNumber')}
              />
              <TextField
                error={errors.dateOfBirth?.message}
                label="Date of birth"
                max={new Date().toISOString().slice(0, 10)}
                type="date"
                {...register('dateOfBirth')}
              />
            </div>
            <SelectField
              defaultValue=""
              error={errors.country?.message}
              hint={countriesError ?? 'Optional. Used for regional preferences and compliance.'}
              label="Country"
              {...register('country')}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </SelectField>
            <CheckboxField
              description="Receive monthly product news, security guidance, and release notes."
              label="Keep me updated with product insights"
              {...register('newsletter')}
            />
          </div>
        ) : null}

        {state.currentStep === 2 ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Review your answers
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">
                    Confirm the details before account creation.
                  </h3>
                </div>
                <span className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Final check
                </span>
              </div>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {summaryRows(values, countries).map((row) => (
                  <div
                    className="rounded-2xl border border-white bg-white/95 px-4 py-4 shadow-sm"
                    key={row.label}
                  >
                    <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {row.label}
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-slate-900">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <CheckboxField
              description="I agree to the Terms of Service, Privacy Policy, and security disclosures."
              error={errors.terms?.message}
              label="I accept the terms and understand how my data is handled"
              {...register('terms')}
            />
          </div>
        ) : null}

        <FormNavigation
          currentStep={state.currentStep}
          disablePrimary={isSubmitting || usernameStatus.state === 'checking'}
          isSubmitting={isSubmitting}
          onBack={handleBack}
          onNext={handleNext}
          totalSteps={FORM_STEPS.length}
        />
      </form>
    </section>
  );
}
