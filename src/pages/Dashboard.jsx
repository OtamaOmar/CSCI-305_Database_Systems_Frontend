import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Activity,
  AlertTriangle,
  Bell,
  ClipboardList,
  HeartPulse,
  MoreHorizontal,
  Moon,
  Stethoscope,
  Sun,
  UserPlus,
  Ambulance,
  BedDouble,
  FileText,
} from 'lucide-react'

const overviewCards = [
  {
    title: 'Emergency cases today',
    value: '128',
    note: '+12 vs yesterday',
    noteClass: 'text-brand',
    icon: AlertTriangle,
    iconClass: 'text-brand',
  },
  {
    title: 'Active doctors',
    value: '24',
    note: '8 on shift now',
    noteClass: 'text-slate-500 dark:text-slate-400',
    icon: Stethoscope,
    iconClass: 'text-slate-700 dark:text-slate-200',
  },
  {
    title: 'ICU availability',
    value: '12 / 40',
    note: '30% beds free',
    noteClass: 'text-slate-500 dark:text-slate-400',
    icon: BedDouble,
    iconClass: 'text-slate-700 dark:text-slate-200',
  },
  {
    title: 'Avg. wait time',
    value: '8m 24s',
    note: '↓ 18% this week',
    noteClass: 'text-slate-500 dark:text-slate-400',
    icon: Activity,
    iconClass: 'text-slate-700 dark:text-slate-200',
  },
]

const quickActions = [
  { label: 'Register patient', sub: 'Open workflow', icon: UserPlus, to: '/patient' },
  { label: 'Incoming ambulance', sub: 'Open workflow', icon: Ambulance },
  { label: 'New triage', sub: 'Open workflow', icon: ClipboardList },
  { label: 'Generate report', sub: 'Open workflow', icon: FileText },
]

const caseRows = [
  { initials: 'AK', name: 'Adan Khalid', id: 'ED-2841', note: 'Chest pain · 42M · Bay 03', level: 'Critical' },
  { initials: 'ML', name: 'Maria Lopez', id: 'ED-2840', note: 'Fracture · 28F · Bay 07', level: 'Urgent' },
  { initials: 'YT', name: 'Yuki Tanaka', id: 'ED-2839', note: 'Fever · 8M · Bay 12', level: 'Stable' },
  { initials: 'OS', name: 'Omar Said', id: 'ED-2838', note: 'Trauma · 51M · Bay 01', level: 'Critical' },
  { initials: 'LP', name: 'Lina Park', id: 'ED-2837', note: 'Asthma · 34F · Bay 09', level: 'Urgent' },
]

const doctorRows = [
  { initials: 'A', name: 'Dr. Sara Ahmed', role: 'ED Lead', status: 'Available' },
  { initials: 'N', name: 'Dr. Karim Nasser', role: 'Trauma', status: 'In surgery' },
  { initials: 'C', name: 'Dr. Mei Chen', role: 'Pediatrics', status: 'Available' },
  { initials: 'B', name: 'Dr. Tom Becker', role: 'Cardiology', status: 'On call' },
]

const levelClass = {
  Critical: 'bg-brand/10 text-brand',
  Urgent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Stable: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

const statusClass = {
  Available: 'text-emerald-600 dark:text-emerald-400',
  'In surgery': 'text-brand',
  'On call': 'text-slate-500 dark:text-slate-400',
}

function Dashboard() {
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
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950">
              <HeartPulse className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Pulse<span className="text-brand">ED</span>
            </p>
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

            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                SA
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Dr. Sara Ahmed</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">St. Mercy General</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live monitoring
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Real-time view of emergency operations.
            </p>
          </div>

          <Link
            to="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Sign out
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => {
            const Icon = card.icon

            return (
              <article
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mb-5 flex items-start justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Icon className={`h-4 w-4 ${card.iconClass}`} />
                  </div>
                </div>
                <p className="text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{card.value}</p>
                <p className={`mt-2 text-sm ${card.noteClass}`}>{card.note}</p>
              </article>
            )
          })}
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Quick actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon

              if (action.to) {
                return (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{action.label}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{action.sub}</p>
                    </div>
                  </Link>
                )
              }

              return (
                <button
                  key={action.label}
                  type="button"
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{action.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{action.sub}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.9fr_1fr]">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div>
                <Link
                  to="/emergency"
                  className="text-lg font-semibold text-slate-900 transition hover:text-brand dark:text-slate-100 dark:hover:text-brand"
                >
                  Active emergency cases
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400">Updated just now</p>
              </div>
              <Link
                to="/emergency"
                className="text-sm font-medium text-slate-500 transition hover:text-brand dark:text-slate-400 dark:hover:text-brand"
              >
                View all
              </Link>
            </div>

            <ul>
              {caseRows.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3 last:border-b-0 dark:border-slate-700"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {row.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium text-slate-900 dark:text-slate-100">
                        {row.name}
                        <span className="ml-2 text-slate-500 dark:text-slate-400">{row.id}</span>
                      </p>
                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">{row.note}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${levelClass[row.level]}`}>
                      {row.level}
                    </span>
                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <Link
                to="/doctors"
                className="text-lg font-semibold text-slate-900 transition hover:text-brand dark:text-slate-100 dark:hover:text-brand"
              >
                Active doctors
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400">8 on shift</p>
            </div>

            <ul>
              {doctorRows.map((row) => (
                <li
                  key={row.name}
                  className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3 last:border-b-0 dark:border-slate-700"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {row.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium text-slate-900 dark:text-slate-100">{row.name}</p>
                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">{row.role}</p>
                    </div>
                  </div>

                  <p className={`shrink-0 text-sm font-medium ${statusClass[row.status]}`}>{row.status}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
