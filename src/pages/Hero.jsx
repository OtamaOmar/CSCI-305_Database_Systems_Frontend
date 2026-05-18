import { useEffect, useState } from 'react'
import { Activity, HeartPulse, MoveRight, LogIn, Moon, Sun } from 'lucide-react'
import { Link } from '@tanstack/react-router'

function Hero() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const queueRows = [
    { initials: 'AK', name: 'Adan Khalid', issue: 'Chest pain', time: '42M', status: 'Critical', tone: 'critical' },
    { initials: 'ML', name: 'Maria Lopez', issue: 'Fracture', time: '28F', status: 'Urgent', tone: 'urgent' },
    { initials: 'YT', name: 'Yuki Tanaka', issue: 'Fever', time: '8M', status: 'Stable', tone: 'stable' },
    { initials: 'OS', name: 'Omar Said', issue: 'Trauma', time: '51M', status: 'Critical', tone: 'critical' },
  ]

  const statusStyles = {
    critical: 'bg-brand/10 text-brand',
    urgent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    stable: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  }

  return (
    <div className="min-h-screen bg-light-bg font-sans text-light-text dark:bg-dark-bg dark:text-dark-text">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-light-bg via-light-bg to-light-accentSoft/15 dark:from-dark-bg dark:via-dark-bg dark:to-dark-accent/20" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-144 w-xl rounded-full bg-brand/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-24 right-0 h-96 w-208 bg-heroEmergency opacity-[0.11] blur-3xl dark:opacity-[0.2]" />

        <div className="relative mx-auto max-w-315 px-6 pb-16 pt-6 sm:px-8 lg:px-10">
          <header className="mb-12 flex items-center justify-between lg:mb-20">
            <div className="flex items-center gap-3">
              <HeartPulse className="h-9 w-9 rounded-xl bg-light-text p-2 text-light-card dark:bg-dark-text dark:text-dark-bg" />
              <p className="text-lg font-semibold text-light-text dark:text-dark-text">
                Pulse<span className="text-brand">ED</span>
              </p>
            </div>

            <nav className="hidden items-center gap-12 text-sm text-light-secondary/70 dark:text-dark-text/75 md:flex">
              <a href="#" className="transition hover:text-light-text dark:hover:text-dark-text">Platform</a>
              <a href="#" className="transition hover:text-light-text dark:hover:text-dark-text">Modules</a>
              <a href="#" className="transition hover:text-light-text dark:hover:text-dark-text">Hospitals</a>
              <a href="#" className="transition hover:text-light-text dark:hover:text-dark-text">Docs</a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDark((value) => !value)}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="rounded-2xl bg-light-card px-6 py-2.5 text-sm font-semibold text-light-text shadow-sm ring-1 ring-dark-border/20 transition hover:bg-light-bg dark:bg-dark-card dark:text-dark-text dark:ring-dark-border dark:hover:bg-dark-bg"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link
                to="/login"
                className="rounded-2xl bg-light-card px-6 py-2.5 text-sm font-semibold text-light-text shadow-sm ring-1 ring-dark-border/20 transition hover:bg-light-bg dark:bg-dark-card dark:text-dark-text dark:ring-dark-border dark:hover:bg-dark-bg"
              >
                Sign in
              </Link>
            </div>
          </header>

          <main className="grid items-center gap-12 lg:grid-cols-[1fr_1.06fr] lg:gap-8">
            <section className="max-w-140">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-dark-border/20 bg-light-card/80 px-4 py-1.5 text-sm text-light-secondary/60 dark:border-dark-border dark:bg-dark-card/80 dark:text-dark-text/65">
                <span className="h-2 w-2 rounded-full bg-brand" />
                LIVE
                <span>.</span>
                <span>V3.2</span>
              </div>

              <h1 className="text-5xl font-extrabold leading-[1.1] text-light-text sm:text-6xl dark:text-dark-text">
                Smart Emergency
                <br />
                Department
                <br />
                <span className="text-brand">Management.</span>
              </h1>

              <p className="mt-8 max-w-135 text-lg leading-relaxed text-light-secondary/55 sm:text-xl lg:text-2xl dark:text-dark-text/70">
                One platform for triage, patient records, ICU monitoring, and staff coordination for
                the speed of emergency care.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/onboard"
                  className="inline-flex items-center gap-3 rounded-2xl bg-light-secondary px-8 py-4 text-lg font-semibold text-light-card transition hover:brightness-110 dark:bg-dark-accent"
                >
                  Set up hospital
                  <MoveRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-3 rounded-2xl border border-dark-border/20 bg-light-card px-8 py-4 text-lg font-semibold text-light-secondary transition hover:bg-light-bg dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:hover:bg-dark-bg"
                >
                  Sign up
                  <MoveRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 rounded-2xl border border-dark-border/20 bg-light-card px-8 py-4 text-lg font-semibold text-light-secondary transition hover:bg-light-bg dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:hover:bg-dark-bg"
                >
                  Login
                  <LogIn className="h-5 w-5" />
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-7 text-light-text sm:max-w-140 sm:divide-x sm:divide-dark-border/20 dark:text-dark-text dark:sm:divide-dark-border">
                <div className="pr-5">
                  <p className="text-4xl font-bold">120+</p>
                  <p className="mt-1 text-sm tracking-widest text-light-secondary/50 dark:text-dark-text/60">HOSPITALS</p>
                </div>
                <div className="sm:px-5">
                  <p className="text-4xl font-bold">2.4M</p>
                  <p className="mt-1 text-sm tracking-widest text-light-secondary/50 dark:text-dark-text/60">CASES</p>
                </div>
                <div className="sm:pl-5">
                  <p className="text-4xl font-bold">99.99%</p>
                  <p className="mt-1 text-sm tracking-widest text-light-secondary/50 dark:text-dark-text/60">UPTIME</p>
                </div>
              </div>
            </section>

            <section className="relative pb-6">
              <div className="overflow-hidden rounded-[28px] border border-light-card/80 bg-light-card/85 shadow-heroCard backdrop-blur dark:border-dark-border dark:bg-dark-card/90">
                <div className="flex items-center justify-between border-b border-dark-border/15 px-6 py-4 dark:border-dark-border">
                  <div className="flex items-center gap-3">
                    <HeartPulse className="h-9 w-9 rounded-xl bg-light-accentSoft/20 p-2 dark:bg-dark-bg text-brand" />
                    <div>
                      <p className="font-semibold text-light-text dark:text-dark-text">ED Command Center</p>
                      <p className="text-sm text-light-secondary/55 dark:text-dark-text/65">St. Mercy General</p>
                    </div>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-light-secondary/55 dark:text-dark-text/65">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    Live
                  </p>
                </div>

                <div className="grid grid-cols-3 divide-x divide-dark-border/15 border-b border-dark-border/15 dark:divide-dark-border dark:border-dark-border">
                  <div className="px-6 py-4">
                    <p className="text-xs font-semibold tracking-widest text-light-secondary/50 dark:text-dark-text/55">IN ED</p>
                    <p className="mt-2 text-4xl font-bold text-light-text dark:text-dark-text">47</p>
                    <p className="mt-1 text-sm text-light-secondary/55 dark:text-dark-text/65">+3</p>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-xs font-semibold tracking-widest text-light-secondary/50 dark:text-dark-text/55">ICU FREE</p>
                    <p className="mt-2 text-4xl font-bold text-light-text dark:text-dark-text">12/40</p>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-xs font-semibold tracking-widest text-light-secondary/50 dark:text-dark-text/55">CRITICAL</p>
                    <p className="mt-2 text-4xl font-bold text-light-text dark:text-dark-text">06</p>
                    <p className="mt-1 text-sm text-brand">Code Red</p>
                  </div>
                </div>

                <div className="border-b border-dark-border/15 px-6 py-4 dark:border-dark-border">
                  <div className="mb-4 flex items-center justify-between text-sm text-light-secondary/55 dark:text-dark-text/65">
                    <p>Vitals . Bay 03</p>
                    <p>HR 92 . SpO2 97%</p>
                  </div>
                  <div className="h-16 rounded-xl bg-light-bg/80 px-6 py-6 dark:bg-dark-bg/55">
                    <div className="mx-auto max-w-[80%]">
                      <svg
                        className="pulse-live h-8 w-full text-brand/75"
                        viewBox="0 0 200 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M0 10 H72 L82 10 L87 4 L93 16 L99 10 H200"
                          className="stroke-current"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold tracking-widest text-light-secondary/50 dark:text-dark-text/55">TRIAGE QUEUE</p>
                    <p className="text-light-secondary/50 dark:text-dark-text/55">...</p>
                  </div>

                  <div className="space-y-4">
                    {queueRows.map((row) => (
                      <div key={row.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-light-bg text-xs text-light-secondary/55 dark:bg-dark-bg dark:text-dark-text/65">
                            {row.initials}
                          </div>
                          <div>
                            <p className="font-medium text-light-text dark:text-dark-text">{row.name}</p>
                            <p className="text-sm text-light-secondary/55 dark:text-dark-text/65">
                              {row.issue} . {row.time}
                            </p>
                          </div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.tone]}`}>
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-3 left-6 rounded-3xl border border-dark-border/20 bg-light-card px-5 py-4 shadow-heroCard dark:border-dark-border dark:bg-dark-card"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-light-accentSoft/20 p-2 text-brand dark:bg-dark-bg">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs tracking-widest text-light-secondary/50 dark:text-dark-text/55">AVG WAIT</p>
                    <p className="mt-1 text-2xl font-bold text-light-text dark:text-dark-text">
                      8m 24s <span className="text-sm font-semibold text-emerald-500">+ 18%</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Hero
