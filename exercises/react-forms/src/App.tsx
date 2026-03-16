import { lazy, Suspense } from 'react';

const RegistrationForm = lazy(() => import('./components/RegistrationForm'));

function App() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.14),transparent_28%),linear-gradient(180deg,rgba(255,251,235,0.98),rgba(248,250,252,0.95))]" />
      <div className="mx-auto grid max-w-7xl gap-10 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] xl:items-start">
        <section className="rounded-[36px] border border-white/70 bg-slate-950 px-6 py-8 text-white shadow-[0_32px_120px_rgba(15,23,42,0.24)] sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-300">
            Secure onboarding
          </p>
          <h1 className="mt-4 max-w-xl font-[Iowan_Old_Style,Palatino_Linotype,serif] text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Registration that feels premium, fast, and trustworthy.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            This flow combines schema-driven validation, accessible interactions,
            debounced async checks, and a review-first submission model so users
            never feel lost or exposed.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-amber-300">
                Built for confidence
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Inline guidance, resilient validation, and strong visual hierarchy
                reduce form fatigue.
              </p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-teal-300">
                Security-aware persistence
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Draft details persist across refreshes, but passwords never touch
                local storage.
              </p>
            </article>
          </div>
        </section>
        <Suspense
          fallback={
            <section className="rounded-[32px] border border-white/70 bg-white/92 p-8 shadow-[0_32px_120px_rgba(15,23,42,0.14)]">
              <div className="space-y-4">
                <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
                <div className="h-12 w-4/5 animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
              </div>
            </section>
          }
        >
          <RegistrationForm />
        </Suspense>
      </div>
    </main>
  );
}

export default App;
