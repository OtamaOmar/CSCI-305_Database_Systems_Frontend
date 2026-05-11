import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AlertTriangle, Bell, CheckCircle2, Clock, HeartPulse, Info, Moon, ShieldCheck, Siren, Sun } from 'lucide-react'

const emergencyAlerts = [
  {
    id: 'AL-501',
    title: 'Code Red - Trauma Bay 2',
    message: 'Multi-trauma patient inbound, ETA 5 min. Trauma team B activated.',
    time: '2 min ago',
    level: 'Critical',
  },
  {
    id: 'AL-502',
    title: 'ICU capacity warning',
    message: 'ICU occupancy 92%. Prepare step-down beds for overflow.',
    time: '12 min ago',
    level: 'Warning',
  },
  {
    id: 'AL-503',
    title: 'Ambulance inbound',
    message: 'Cardiac case inbound from North Zone. ETA 9 min.',
    time: '20 min ago',
    level: 'Info',
  },
]

const systemNotifications = [
  {
    id: 'SYS-201',
    title: 'Backup completed',
    message: 'Nightly backup finished successfully for patient records.',
    time: 'Today, 03:10',
    icon: CheckCircle2,
  },
  {
    id: 'SYS-202',
    title: 'Security patch applied',
    message: 'System patch 3.4.1 installed. No downtime detected.',
    time: 'Yesterday, 22:30',
    icon: ShieldCheck,
  },
  {
    id: 'SYS-203',
    title: 'Reminder: shift briefing',
    message: 'Morning shift briefing scheduled for 06:45 in Ops room.',
    time: 'Yesterday, 18:00',
    icon: Info,
  },
]

const alertToneClass = {
  Critical: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
  Warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
  Info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300',
}

function Notifications() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-slate-100/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950">
                <HeartPulse className="h-4 w-4" />
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Pulse<span className="text-brand">ED</span>
              </p>
            </div>

            <nav className="hidden items-center gap-2 text-sm md:flex">
              <Link
                to="/dashboard"
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Dashboard
              </Link>
              <Link
                to="/charts"
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Charts
              </Link>
              <Link
                to="/notifications"
                className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Notifications
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsDark((value) => !value)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              to="/notifications"
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Link>

            <div className="relative hidden items-center gap-2.5 sm:flex">
              <button
                type="button"
                onClick={() => setIsMenuOpen((value) => !value)}
                className="flex items-center gap-2.5 rounded-xl px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  SA
                </div>
                <div className="leading-tight text-left">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Dr. Sara Ahmed</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">St. Mercy General</p>
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Profile settings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Emergency alerts</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Critical updates and system notifications for the emergency department.
          </p>
        </div>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Emergency alerts</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Live alerts from triage and ICU.</p>
            </div>
            <ul>
              {emergencyAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 dark:border-slate-700"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{alert.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{alert.message}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5" /> {alert.time}
                    </span>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${alertToneClass[alert.level]}`}
                  >
                    <Siren className="h-3.5 w-3.5" />
                    {alert.level}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">System notifications</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Operational updates and reminders.</p>
            </div>
            <ul>
              {systemNotifications.map((item) => {
                const Icon = item.icon

                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 dark:border-slate-700"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.message}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5" /> {item.time}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <AlertTriangle className="h-4 w-4 text-brand" />
            Notifications are updated every 60 seconds and prioritized by severity.
          </div>
        </section>
      </main>
    </div>
  )
}

export default Notifications
