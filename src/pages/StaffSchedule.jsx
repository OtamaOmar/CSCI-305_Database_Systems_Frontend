import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, CalendarDays, Clock, HeartPulse, Moon, Sun, Users } from 'lucide-react'

const shiftSummary = [
  {
    label: 'Morning shift',
    time: '07:00 - 15:00',
    onDuty: 18,
    note: '5 doctors, 13 nurses',
    tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'Evening shift',
    time: '15:00 - 23:00',
    onDuty: 16,
    note: '4 doctors, 12 nurses',
    tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    label: 'Night shift',
    time: '23:00 - 07:00',
    onDuty: 12,
    note: '3 doctors, 9 nurses',
    tone: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  },
]

const weeklySchedule = [
  {
    day: 'Monday',
    morning: 'ER Team A',
    evening: 'ER Team B',
    night: 'ICU Team C',
  },
  {
    day: 'Tuesday',
    morning: 'Trauma Team A',
    evening: 'ER Team C',
    night: 'Surgery Team B',
  },
  {
    day: 'Wednesday',
    morning: 'ER Team B',
    evening: 'Pediatrics Team A',
    night: 'ICU Team A',
  },
  {
    day: 'Thursday',
    morning: 'Cardio Team A',
    evening: 'ER Team A',
    night: 'Surgery Team C',
  },
  {
    day: 'Friday',
    morning: 'ER Team C',
    evening: 'Trauma Team B',
    night: 'ICU Team B',
  },
  {
    day: 'Saturday',
    morning: 'ER Team A',
    evening: 'ER Team B',
    night: 'ICU Team C',
  },
  {
    day: 'Sunday',
    morning: 'Pediatrics Team B',
    evening: 'ER Team C',
    night: 'Surgery Team A',
  },
]

const availabilityRows = [
  { name: 'Dr. Sara Ahmed', role: 'ED Lead', status: 'On duty', nextShift: 'Today · Morning' },
  { name: 'Dr. Karim Nasser', role: 'Trauma', status: 'On call', nextShift: 'Tonight · Night' },
  { name: 'Dr. Mei Chen', role: 'Pediatrics', status: 'Available', nextShift: 'Tomorrow · Morning' },
  { name: 'Dr. Tom Becker', role: 'Cardiology', status: 'Off duty', nextShift: 'Tomorrow · Evening' },
]

const statusStyles = {
  'On duty': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'On call': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Available: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  'Off duty': 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
}

function StaffSchedule() {
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
                to="/patient"
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Patients
              </Link>
              <Link
                to="/doctors"
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Doctors
              </Link>
              <Link
                to="/emergency"
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Emergency
              </Link>
              <Link
                to="/staff"
                className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Staff
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

            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Staff schedule
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Weekly staffing overview</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Track shifts, weekly assignments, and doctor availability across the emergency department.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {shiftSummary.map((shift) => (
            <article
              key={shift.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{shift.label}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${shift.tone}`}>{shift.onDuty} on duty</span>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" /> {shift.time}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{shift.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Weekly schedule</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Shift assignments for each day.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Day</th>
                  <th className="px-5 py-3">Morning</th>
                  <th className="px-5 py-3">Evening</th>
                  <th className="px-5 py-3">Night</th>
                </tr>
              </thead>
              <tbody>
                {weeklySchedule.map((row) => (
                  <tr key={row.day} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{row.day}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{row.morning}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{row.evening}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{row.night}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Doctor availability
            </h2>
            <span className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Users className="h-3.5 w-3.5" /> Updated 5 min ago
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {availabilityRows.map((row) => (
              <article
                key={row.name}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{row.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{row.role}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                    {row.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Next shift: {row.nextShift}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default StaffSchedule
