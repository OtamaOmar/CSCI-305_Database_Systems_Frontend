import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { apiFetch, clearAuth } from '../lib/api'
import {
  Activity,
  AlertTriangle,
  AlertCircle,
  CalendarDays,
  ClipboardList,
  MoreHorizontal,
  Stethoscope,
  Building2,
  FileText,
  MapPin,
  Pill,
  BedDouble,
  Users,
  Layers,
} from 'lucide-react'

const quickActions = [
  { label: 'Patients', sub: 'Records & profiles', icon: Users, to: '/patient' },
  { label: 'Appointments', sub: 'Schedule & manage', icon: CalendarDays, to: '/appointments' },
  { label: 'Emergency Ops', sub: 'Phase 2 module', icon: AlertTriangle, to: '/emergency-operations' },
  { label: 'Reports', sub: 'Charts & exports', icon: FileText, to: '/reports-dashboard' },
  { label: 'Rooms', sub: 'Availability & booking', icon: BedDouble, to: '/rooms-management' },
  { label: 'Departments', sub: 'Manage organization', icon: Layers, to: '/departments-page' },
  { label: 'Locations', sub: 'Hospital map', icon: MapPin, to: '/hospital-locations' },
  { label: 'Prescriptions', sub: 'Orders & history', icon: Pill, to: '/prescriptions' },
  { label: 'Files', sub: 'Uploads & documents', icon: Building2, to: '/reports-dashboard' },
  { label: 'Admin', sub: 'Users & invitations', icon: Users, to: '/admin-panel' },
]

const alertToneClass = {
  Critical: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
  Warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
  Info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300',
}

const levelClass = {
  Critical: 'bg-brand/10 text-brand',
  Urgent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Stable: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

const statusClass = {
  Available: 'text-emerald-600 dark:text-emerald-400',
  'In surgery': 'text-brand',
  'On call': 'text-slate-500 dark:text-slate-400',
  'On duty': 'text-emerald-600 dark:text-emerald-400',
  'Off duty': 'text-rose-500 dark:text-rose-300',
}

const STATUS_FALLBACK = 'text-slate-500 dark:text-slate-400'

function getInitials(value) {
  if (!value) return '--'
  return value
    .replace('Dr. ', '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function parseDate(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function Dashboard() {
  const { notify } = useAlert()
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })

  const [cases, setCases] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    let isMounted = true

    const fetchList = async (path, label) => {
      try {
        const data = await apiFetch(path)
        return Array.isArray(data) ? data : []
      } catch (err) {
        throw new Error(`${label} request failed.`, { cause: err })
      }
    }

    const loadDashboard = async () => {
      const [casesResult, doctorsResult, patientsResult, alertsResult] = await Promise.allSettled([
        fetchList('/api/cases', 'Cases'),
        fetchList('/api/doctors', 'Doctors'),
        fetchList('/api/patients', 'Patients'),
        fetchList('/api/notifications', 'Alerts'),
      ])

      if (!isMounted) return

      if (casesResult.status === 'fulfilled') {
        setCases(casesResult.value)
      } else {
        console.error(casesResult.reason)
        notify({ tone: 'error', message: 'Failed to load emergency cases.' })
      }

      if (doctorsResult.status === 'fulfilled') {
        setDoctors(doctorsResult.value)
      } else {
        console.error(doctorsResult.reason)
        notify({ tone: 'error', message: 'Failed to load doctors.' })
      }

      if (patientsResult.status === 'fulfilled') {
        setPatients(patientsResult.value)
      } else {
        console.error(patientsResult.reason)
        notify({ tone: 'error', message: 'Failed to load patients.' })
      }

      if (alertsResult.status === 'fulfilled') {
        setAlerts(alertsResult.value)
      } else {
        console.error(alertsResult.reason)
        notify({ tone: 'error', message: 'Failed to load alerts.' })
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [notify])

  const overviewCards = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)

    const casesToday = cases.filter((item) => {
      const date = parseDate(item.created_at || item.arrival_time)
      return date && date >= startOfToday && date < startOfTomorrow
    }).length

    const casesYesterday = cases.filter((item) => {
      const date = parseDate(item.created_at || item.arrival_time)
      return date && date >= startOfYesterday && date < startOfToday
    }).length

    const casesDelta = casesToday - casesYesterday
    const casesNote = casesToday || casesYesterday
      ? `${casesDelta >= 0 ? '+' : ''}${casesDelta} vs yesterday`
      : 'No cases logged yet'

    const openCases = cases.filter((item) => item.status && item.status !== 'Discharged').length
    const onDutyCount = doctors.filter((doctor) => doctor.status === 'On duty').length
    const onCallCount = doctors.filter((doctor) => doctor.status === 'On call').length
    const criticalPatients = patients.filter((patient) => patient.level === 'Critical').length
    const criticalAlertCount = alerts.filter((alert) => alert.level === 'Critical').length

    return [
      {
        title: 'Emergency cases today',
        value: String(casesToday),
        note: casesNote,
        noteClass: 'text-brand',
        icon: AlertTriangle,
        iconClass: 'text-brand',
      },
      {
        title: 'Active doctors',
        value: String(doctors.length),
        note: `${onDutyCount} on shift now`,
        noteClass: 'text-slate-500 dark:text-slate-400',
        icon: Stethoscope,
        iconClass: 'text-slate-700 dark:text-slate-200',
      },
      {
        title: 'Active patients',
        value: String(patients.length),
        note: `${criticalPatients} critical`,
        noteClass: 'text-slate-500 dark:text-slate-400',
        icon: ClipboardList,
        iconClass: 'text-slate-700 dark:text-slate-200',
      },
      {
        title: 'Open emergency cases',
        value: String(openCases),
        note: `${cases.length - openCases} discharged`,
        noteClass: 'text-slate-500 dark:text-slate-400',
        icon: AlertCircle,
        iconClass: 'text-slate-700 dark:text-slate-200',
      },
      {
        title: 'On-call doctors',
        value: String(onCallCount),
        note: `${onDutyCount} currently on duty`,
        noteClass: 'text-slate-500 dark:text-slate-400',
        icon: CalendarDays,
        iconClass: 'text-slate-700 dark:text-slate-200',
      },
      {
        title: 'Emergency alerts',
        value: String(alerts.length),
        note: `${criticalAlertCount} critical`,
        noteClass: 'text-slate-500 dark:text-slate-400',
        icon: Activity,
        iconClass: 'text-slate-700 dark:text-slate-200',
      },
    ]
  }, [alerts, cases, doctors, patients])

  const caseRows = useMemo(() => {
    return cases.slice(0, 5).map((item) => {
      const genderInitial = item.gender ? item.gender[0] : ''
      const noteParts = [
        item.complaint,
        item.age ? `${item.age}${genderInitial}` : null,
        item.room,
      ].filter(Boolean)

      return {
        id: item.id,
        name: item.name,
        initials: getInitials(item.name),
        note: noteParts.join(' · '),
        level: item.severity,
      }
    })
  }, [cases])

  const doctorRows = useMemo(() => {
    return doctors.slice(0, 4).map((doctor) => ({
      initials: getInitials(doctor.name),
      name: doctor.name,
      role: doctor.specialty || doctor.department || doctor.shift || 'Staff',
      status: doctor.status,
    }))
  }, [doctors])

  const emergencyAlerts = useMemo(() => {
    return alerts.slice(0, 3).map((alert) => ({
      id: alert.id,
      title: alert.title,
      detail: alert.message,
      level: alert.level,
    }))
  }, [alerts])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar
        navItems={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Charts', to: '/charts' },
        ]}
        activePath="/dashboard"
        isDark={isDark}
        onToggleTheme={() => setIsDark((value) => !value)}
        showContact
        showNotifications
        notificationsAsLink
        showUserMenu
        heightClass="h-14"
      />

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
            to="/login"
            onClick={() => {
              clearAuth()
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Sign out
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {caseRows.length ? 'Updated recently' : 'No case updates yet'}
                </p>
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

              {caseRows.length === 0 && (
                <li className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                  No emergency cases available.
                </li>
              )}
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
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {doctors.filter((doctor) => doctor.status === 'On duty').length} on shift
              </p>
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

                  <p className={`shrink-0 text-sm font-medium ${statusClass[row.status] || STATUS_FALLBACK}`}>
                    {row.status}
                  </p>
                </li>
              ))}

              {doctorRows.length === 0 && (
                <li className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                  No doctors available.
                </li>
              )}
            </ul>
          </article>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Emergency alerts
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Live feed</span>
          </div>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <ul>
              {emergencyAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 dark:border-slate-700"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{alert.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{alert.detail}</p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${alertToneClass[alert.level] || alertToneClass.Info}`}
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {alert.level || 'Info'}
                  </span>
                </li>
              ))}

              {emergencyAlerts.length === 0 && (
                <li className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                  No alerts available.
                </li>
              )}
            </ul>
          </article>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
